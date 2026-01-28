<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SwitzerlandImageController extends Controller
{
    private $locations = [
        ['name' => 'The Matterhorn, Zermatt', 'query' => 'Zermatt, Matterhorn'],
        ['name' => 'Lake Geneva, Montreux', 'query' => 'Lake Geneva, Montreux'],
        ['name' => 'Lucerne Old Town', 'query' => 'Lucerne, Luzern'],
        ['name' => 'Lauterbrunnen Valley', 'query' => 'Lauterbrunnen'],
        ['name' => 'Grindelwald Mountains', 'query' => 'Grindelwald'],
        ['name' => 'St. Moritz Lake', 'query' => 'St. Moritz'],
        ['name' => 'Interlaken', 'query' => 'Interlaken'],
        ['name' => 'Bern Old City', 'query' => 'Bern, Switzerland'],
        ['name' => 'Appenzell Rolling Hills', 'query' => 'Appenzell'],
        ['name' => 'Lugano Waterfront', 'query' => 'Lugano'],
        ['name' => 'Chillon Castle', 'query' => 'Chillon Castle'],
        ['name' => 'Oeschinen Lake', 'query' => 'Oeschinensee'],
    ];

    private $imageLibrary = [
        'sunny' => [
            'i9FLW1vO5G4',
            't_e5s58Z0wM',
            'eW2_F_KqZ_o',
            'yC-Y_m_a5S8',
            '7R_u4h5qQkI',
            'v9L1_v6D_Y',
            'A8r_Zq_w8fM'
        ],
        'moody' => [
            'Z8m_Zq_w8fM',
            'A8r_Zq_w8fM',
            'L-W-Ww-o-I',
            'd8iG83hWp6k',
            '_U9p8yGjS7o'
        ],
        'night' => [
            'd8iG83hWp6k',
            'l5Gg-yOaJpI',
            'L5yQk0c_S00',
            'c0iW1Hn-6gI',
            'P21lJj_y8qU'
        ],
        'snow' => [
            'yC-Y_m_a5S8',
            '7R_u4h5qQkI',
            'v9L1_v6D_Y',
            'L5yQk0c_S00'
        ]
    ];

    public function index(Request $request)
    {
        $version = $request->get('v', 0);
        $cacheKey = 'switzerland_landscape_image_v10';

        if ($version > 0) {
            return $this->generateImageData($version);
        }

        return Cache::remember($cacheKey, 3600, function () {
            return $this->generateImageData(0);
        });
    }

    private function generateImageData($seed = 0)
    {
        // 1. Get context
        $weatherCode = $this->getWeatherCode();
        $hour = (int) date('G');

        // 2. Determine Category
        $category = 'sunny';

        // Night starts at 5 PM (17:00) in winter Switzerland
        if ($hour < 7 || $hour >= 17) {
            $category = 'night';
        } elseif ($weatherCode >= 85) {
            $category = 'snow';
        } elseif ($weatherCode >= 51 || ($weatherCode >= 1 && $weatherCode <= 3)) {
            $category = 'moody';
        }

        // 3. Pick an image ID from the matching pool
        $pool = $this->imageLibrary[$category];
        // Use seed/version to flip through images
        $index = ($hour + $seed) % count($pool);
        $photoId = $pool[$index];

        // 4. Stable location for the hour
        $locationIndex = $hour % count($this->locations);
        $location = $this->locations[$locationIndex];

        // 5. Build direct Unsplash URL
        $imageUrl = "https://images.unsplash.com/photo-{$photoId}?auto=format&fit=crop&q=80&w=800&h=600";

        return [
            'url' => $imageUrl,
            'location' => $location['name'],
            'maps_link' => "https://www.google.com/maps/search/?api=1&query=" . urlencode($location['name'] . ", Switzerland"),
            'category' => $category,
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

    private function getSeason()
    {
        $month = (int) date('m');
        if (in_array($month, [12, 1, 2]))
            return 'winter';
        if (in_array($month, [3, 4, 5]))
            return 'spring';
        if (in_array($month, [6, 7, 8]))
            return 'summer';
        return 'autumn';
    }
}
