<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function index()
    {
        // Location: Lausanne, Switzerland
        $latitude = 46.5197;
        $longitude = 6.6323;
        $city = 'Lausanne';

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
