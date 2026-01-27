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
        'S&P 500' => '^GSPC',
        'NDX 100' => '^NDX',
        'TA-125' => '^TA125.TA',
        'USD to NIS' => 'USDILS=X',
        'CHF to NIS' => 'CHFILS=X',
        'CHF to USD' => 'CHFUSD=X',
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

                    $results[] = [
                        'name' => $name,
                        'symbol' => $symbol,
                        'currentPrice' => round($meta['regularMarketPrice'] ?? 0, 2),
                        'currency' => $meta['currency'] ?? 'USD',
                        'changePercent' => round($meta['regularMarketChangePercent'] ?? 0, 2),
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
