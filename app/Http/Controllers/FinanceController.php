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
        return Cache::remember('finance_data', 3600, function () {
            $results = [];

            foreach ($this->symbols as $name => $symbol) {
                try {
                    $response = Http::get("https://query1.finance.yahoo.com/v8/finance/chart/{$symbol}", [
                        'range' => '1mo',
                        'interval' => '1d',
                    ]);

                    if ($response->successful()) {
                        $data = $response->json();
                        $chartData = $data['chart']['result'][0];
                        $indicators = $chartData['indicators']['quote'][0]['close'];
                        $timestamps = $chartData['timestamp'];
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
                            'currentPrice' => round($meta['regularMarketPrice'], 2),
                            'currency' => $meta['currency'],
                            'changePercent' => round((($meta['regularMarketPrice'] - $meta['previousClose']) / $meta['previousClose']) * 100, 2),
                            'history' => $history,
                        ];
                    }
                } catch (\Exception $e) {
                    // Skip if failed
                }
            }

            return $results;
        });
    }
}
