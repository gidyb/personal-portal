<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function index()
    {
        // 1. Get current location via IP (using server-side IP detection)
        $locationResponse = Http::get('http://ip-api.com/json/');
        $location = $locationResponse->json();

        if ($location && $location['status'] === 'success') {
            $latitude = $location['lat'];
            $longitude = $location['lon'];
            $city = $location['city'];
        } else {
            // Fallback to Lausanne
            $latitude = 46.5197;
            $longitude = 6.6323;
            $city = 'Lausanne';
        }

        $response = Http::get('https://api.open-meteo.com/v1/forecast', [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'current_weather' => true,
            'timezone' => 'auto',
        ]);

        $data = $response->json();
        $data['city'] = $city;

        return response()->json($data);
    }
}
