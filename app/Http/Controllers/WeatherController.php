<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function index()
    {
        // Defaulting to a central coordinate; ideally this would be user-configurable
        $latitude = 51.5074;
        $longitude = -0.1278;

        $response = Http::get('https://api.open-meteo.com/v1/forecast', [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'current_weather' => true,
            'timezone' => 'auto',
        ]);

        return response()->json($response->json());
    }
}
