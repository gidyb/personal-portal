<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class QuoteController extends Controller
{
    private $frenchContent = [
        [
            'quote' => "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
            'author' => "Winston Churchill",
            'word' => "Courage",
            'translation' => "Courage",
            'usage' => "Il faut du courage pour changer de carrière à 40 ans."
        ],
        [
            'quote' => "La vie est un voyage, pas une destination.",
            'author' => "Ralph Waldo Emerson",
            'word' => "Voyage",
            'translation' => "Journey / Trip",
            'usage' => "Bon voyage ! J'espère que tu passeras de bonnes vacances."
        ],
        [
            'quote' => "Petit à petit, l'oiseau fait son nid.",
            'author' => "Proverbe Français",
            'word' => "Petit à petit",
            'translation' => "Little by little",
            'usage' => "J'apprends le français petit à petit, chaque jour."
        ],
        [
            'quote' => "Rien n'est impossible, seule la peur de l'échec l'est.",
            'author' => "Paulo Coelho",
            'word' => "Échec",
            'translation' => "Failure",
            'usage' => "L'échec n'est qu'une opportunité de recommencer plus intelligemment."
        ],
        [
            'quote' => "Le plus grand voyage commence par un premier pas.",
            'author' => "Lao Tseu",
            'word' => "Commencer",
            'translation' => "To start / To begin",
            'usage' => "Je vais commencer mon nouveau projet demain matin."
        ],
        [
            'quote' => "Vouloir, c'est pouvoir.",
            'author' => "Proverbe Français",
            'word' => "Vouloir",
            'translation' => "To want",
            'usage' => "Si tu veux vraiment réussir, tu trouveras un moyen."
        ],
        [
            'quote' => "La patience est amère, mais son fruit est doux.",
            'author' => "Jean-Jacques Rousseau",
            'word' => "Doux / Douce",
            'translation' => "Sweet / Soft",
            'usage' => "Cette pomme est très douce et sucrée."
        ],
    ];

    public function index()
    {
        return Cache::remember('daily_quote_data', now()->endOfDay(), function () {
            // Fetch English quote
            $englishQuote = "Believe you can and you're halfway there.";
            $englishAuthor = "Theodore Roosevelt";

            try {
                $response = Http::get('https://zenquotes.io/api/today');
                if ($response->successful()) {
                    $data = $response->json();
                    $englishQuote = $data[0]['q'] ?? $englishQuote;
                    $englishAuthor = $data[0]['a'] ?? $englishAuthor;
                }
            } catch (\Exception $e) {
                // Fallback to default
            }

            // Pick French content based on day of year
            $dayOfYear = date('z');
            $contentIndex = $dayOfYear % count($this->frenchContent);
            $selectedFrench = $this->frenchContent[$contentIndex];

            return [
                'englishQuote' => [
                    'text' => $englishQuote,
                    'author' => $englishAuthor
                ],
                'frenchQuote' => [
                    'text' => $selectedFrench['quote'],
                    'author' => $selectedFrench['author']
                ],
                'frenchWord' => [
                    'word' => $selectedFrench['word'],
                    'translation' => $selectedFrench['translation'],
                    'usage' => $selectedFrench['usage']
                ]
            ];
        });
    }
}
