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

        // 1. Get all files in public/images/landscapes
        // glob returns full system paths
        $files = glob(public_path('images/landscapes/*.*'));

        if (empty($files)) {
            // Fallback if directory is empty
            return [
                'url' => 'https://images.unsplash.com/photo-1527668752968-14dc70a27c85?auto=format&fit=crop&q=80&w=800&h=600',
                'location' => 'Swiss Alps (Fallback)',
                'maps_link' => 'https://www.google.com/maps/search/?api=1&query=Switzerland',
                'category' => 'fallback',
                'updated_at' => now()->toISOString()
            ];
        }

        // 2. Pick a file based on version/seed
        // We use the hour + version to seed the selection so it rotates but stable per refresh
        $hour = (int) date('G');
        $seed = $hour + $version;
        $index = $seed % count($files);
        $file = $files[$index];

        // 3. Metadata
        $filename = basename($file);
        // Filename format: Location_Name_Extra.png -> Location Name Extra
        $locationName = str_replace(['_', '-'], ' ', pathinfo($filename, PATHINFO_FILENAME));

        // Build the URL relative to the public root
        $url = asset('images/landscapes/' . $filename);

        return [
            'url' => $url,
            'location' => $locationName,
            'maps_link' => "https://www.google.com/maps/search/?api=1&query=" . urlencode($locationName . ", Switzerland"),
            'category' => 'local',
            'updated_at' => now()->toISOString()
        ];
    }
}
