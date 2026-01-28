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
            '1464822759023-fed622ff2c3b',
            '1506744038136-46273834b3fb',
            '1454496522488-7a8e488e860c',
            '1491553327339-1d4fa920d912',
            '1472396961693-142e6e269027',
            '1465056836041-7f43ec675526'
        ],
        'moody' => [
            '1475924156734-496f6cac6ec1',
            '1500382017468-9049fed747ef',
            '1534447677768-be436bb09401',
            '1494548162494-384bba4ab999',
            '1428906368331-155546051786'
        ],
        'night' => [
            '1519681393784-d120267933ba',
            '1534067783941-51c9c23ecfd3',
            '1470252649358-9675c4046adc',
            '1486783315233-5c9ac556d0d5'
        ],
        'snow' => [
            '1491553327339-1d4fa920d912',
            '1517299321541-3da68c41453c',
            '1454496522488-7a8e488e860c',
            '1486783315233-5c9ac556d0d5'
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
