<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class FinanceController extends Controller
{
    private $symbols = [
        'INTC' => 'INTC',
        'MBLY' => 'MBLY',
        'NDX 100' => '^NDX',
        'USD to NIS' => 'USDILS=X',
        'S&P 500' => '^GSPC',
        'TA-125' => '^TA125.TA',
        'CHF to NIS' => 'CHFILS=X',
        'USD to CHF' => 'USDCHF=X',
    ];

    public function index()
    {
        $results = [];

        foreach ($this->symbols as $name => $symbol) {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                ])->get("https://query1.finance.yahoo.com/v8/finance/chart/{$symbol}", [
                            'range' => '1mo',
                            'interval' => '1d',
                            't' => time(), // Cache buster
                        ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if (!isset($data['chart']['result'][0])) {
                        continue;
                    }
                    $chartData = $data['chart']['result'][0];
                    $indicators = $chartData['indicators']['quote'][0]['close'] ?? [];
                    $timestamps = $chartData['timestamp'] ?? [];

                    if (empty($timestamps)) {
                        continue;
                    }

                    $meta = $chartData['meta'];

                    $history = [];
                    foreach ($timestamps as $index => $timestamp) {
                        if (isset($indicators[$index])) {
                            $history[] = [
                                'date' => date('Y-m-d', $timestamp),
                                'value' => round($indicators[$index], 2),
                            ];
                        }
                    }

                    $currentPrice = round($meta['regularMarketPrice'] ?? 0, 2);

                    // Calculate daily change using the last two close prices from history
                    // chartPreviousClose is not reliable - it's a reference point, not yesterday's close
                    $dailyChange = 0;
                    $dailyChangePercent = 0;
                    $previousClose = 0;

                    if (count($indicators) >= 2) {
                        // Get the last two close prices
                        $lastClose = end($indicators);
                        $prevClose = prev($indicators);

                        if ($prevClose > 0) {
                            $previousClose = round($prevClose, 2);
                            $dailyChange = round($lastClose - $prevClose, 2);
                            $dailyChangePercent = round((($lastClose - $prevClose) / $prevClose) * 100, 2);
                        }
                    }

                    $results[] = [
                        'name' => $name,
                        'symbol' => $symbol,
                        'currentPrice' => $currentPrice,
                        'previousClose' => $previousClose,
                        'dailyChange' => $dailyChange,
                        'dailyChangePercent' => $dailyChangePercent,
                        'currency' => $meta['currency'] ?? 'USD',
                        'history' => $history,
                    ];
                }
            } catch (\Exception $e) {
                // Skip if failed
            }
        }

        return response()->json($results);
    }
}
