<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SwitzerlandImageController extends Controller
{
    public function index(Request $request)
    {
        $version = $request->get('v', 0);

        // 1. Determine Context & Tag
        $weatherCode = $this->getWeatherCode();
        $hour = (int) date('G');

        $tag = '[sunny_wide]'; // Default

        // Night logic (5 PM - 7 AM)
        if ($hour < 7 || $hour >= 17) {
            $tag = '[night_wide]';
        } elseif ($weatherCode >= 71) { // Snow codes
            $tag = '[snowy_wide]';
        } elseif ($weatherCode >= 51 || ($weatherCode >= 1 && $weatherCode <= 3)) { // Rain/Cloudy
            $tag = '[rainy_wide]';
        }

        // 2. Get all files
        $allFiles = glob(public_path('images/landscapes/*.*'));

        if (empty($allFiles)) {
            return [
                'url' => 'https://images.unsplash.com/photo-1527668752968-14dc70a27c85?auto=format&fit=crop&q=80&w=800&h=600',
                'location' => 'Swiss Alps (Fallback)',
                'maps_link' => 'https://www.google.com/maps/search/?api=1&query=Switzerland',
                'category' => 'fallback',
                'updated_at' => now()->toISOString()
            ];
        }

        // 3. Filter by Tag
        $matchingFiles = array_filter($allFiles, function ($file) use ($tag) {
            return stripos(basename($file), $tag) !== false;
        });

        // 4. Fallback behavior
        // If no files match the specific tag, use ALL files
        if (empty($matchingFiles)) {
            $matchingFiles = $allFiles;
        }

        $matchingFiles = array_values($matchingFiles); // API requires 0-indexed array

        // 5. Select File
        $seed = $hour + $version;
        $index = $seed % count($matchingFiles);
        $file = $matchingFiles[$index];

        // 6. Metadata
        $filename = basename($file);
        // "Matterhorn_Panorama_[sunny_wide].jpg" -> "Matterhorn Panorama"
        $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
        // Remove [tag]
        $locationName = preg_replace('/_?\[.*?\]/', '', $nameWithoutExt);
        $locationName = str_replace(['_', '-'], ' ', $locationName);

        $url = asset('images/landscapes/' . $filename);

        return [
            'url' => $url,
            'location' => trim($locationName),
            'maps_link' => "https://www.google.com/maps/search/?api=1&query=" . urlencode(trim($locationName) . ", Switzerland"),
            'category' => str_replace(['_wide', '[', ']'], '', $tag),
            'updated_at' => now()->toISOString()
        ];
    }

    private function getWeatherCode()
    {
        try {
            $response = Http::get('https://api.open-meteo.com/v1/forecast', [
                'latitude' => 46.5197,
                'longitude' => 6.6323,
                'current_weather' => true,
            ]);

            if ($response->successful()) {
                return $response->json()['current_weather']['weathercode'] ?? 0;
            }
        } catch (\Exception $e) {
        }
        return 0;
    }
}
