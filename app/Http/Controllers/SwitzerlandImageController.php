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

    public function index()
    {
        return Cache::remember('switzerland_landscape_image_v6', 3600, function () {
            // 1. Get context
            $weather = $this->getWeatherKeywords();
            $season = $this->getSeason();
            $timeOfDay = ($hour = (int) date('G')) && ($hour < 7 || $hour > 18) ? 'night' : 'day';

            // 2. Pick a location
            $locationIndex = $hour % count($this->locations);
            $location = $this->locations[$locationIndex];

            // 3. Build keywords for Lorem Flickr
            // We include Switzerland and the location first to ensure geographic relevance
            $keywords = "switzerland," . str_replace(' ', '', $location['query']) . "," . $season . "," . $weather . "," . $timeOfDay;

            // 4. Using Lorem Flickr with better context
            $imageUrl = "https://loremflickr.com/800/600/" . $keywords . "/all";

            return [
                'url' => $imageUrl,
                'location' => $location['name'],
                'weather_tag' => $weather,
                'season_tag' => $season,
                'time_tag' => $timeOfDay,
                'updated_at' => now()->toISOString()
            ];
        });
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

    private function getWeatherKeywords()
    {
        try {
            // Fetch real weather from Lausanne
            $response = Http::get('https://api.open-meteo.com/v1/forecast', [
                'latitude' => 46.5197,
                'longitude' => 6.6323,
                'current_weather' => true,
            ]);

            if ($response->successful()) {
                $code = $response->json()['current_weather']['weathercode'] ?? 0;
                if ($code == 0)
                    return 'sunny';
                if ($code <= 3)
                    return 'partly cloudy';
                if ($code <= 67)
                    return 'rainy';
                if ($code <= 86)
                    return 'snowy';
                if ($code <= 99)
                    return 'stormy';
            }
        } catch (\Exception $e) {
            // fallback
        }
        return 'mountain';
    }
}
