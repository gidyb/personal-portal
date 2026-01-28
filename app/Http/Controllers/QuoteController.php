<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class QuoteController extends Controller
{
    private $frenchContent = [
        [
            'quote' => "L'imagination est plus importante que le savoir. Le savoir est limité alors que l'imagination englobe le monde entier.",
            'translation' => "Imagination is more important than knowledge. Knowledge is limited whereas imagination encompasses the entire world.",
            'author' => "Albert Einstein",
            'word' => "Englober",
            'translation_word' => "To encompass / To include",
            'usage' => "Ce projet doit englober tous les aspects de la durabilité environnementale."
        ],
        [
            'quote' => "Le bonheur est parfois caché dans l'inconnu.",
            'translation' => "Happiness is sometimes hidden in the unknown.",
            'author' => "Victor Hugo",
            'word' => "L'inconnu",
            'translation_word' => "The unknown",
            'usage' => "Face à l'inconnu, il est normal de ressentir une certaine appréhension."
        ],
        [
            'quote' => "Rien ne se perd, rien ne se crée, tout se transforme.",
            'translation' => "Nothing is lost, nothing is created, everything is transformed.",
            'author' => "Antoine Lavoisier",
            'word' => "Se transformer",
            'translation_word' => "To transform (oneself)",
            'usage' => "Avec le temps, cette vieille usine va se transformer en un centre culturel moderne."
        ],
        [
            'quote' => "Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés.",
            'translation' => "Demand much from yourself and expect little from others. Thus many troubles will be spared you.",
            'author' => "Confucius",
            'word' => "Épargner",
            'translation_word' => "To spare / To save",
            'usage' => "Grâce à son intervention rapide, de graves complications ont été épargnées au patient."
        ],
        [
            'quote' => "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute.",
            'translation' => "The greatest glory is not in never falling, but in rising every time we fall.",
            'author' => "Nelson Mandela",
            'word' => "Une chute",
            'translation_word' => "A fall / A drop",
            'usage' => "La chute des températures a été soudaine après le coucher du soleil."
        ],
        [
            'quote' => "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.",
            'translation' => "One sees clearly only with the heart. What is essential is invisible to the eye.",
            'author' => "Antoine de Saint-Exupéry",
            'word' => "L'essentiel",
            'translation_word' => "The essential / The core",
            'usage' => "L'essentiel dans ce débat est de trouver un compromis acceptable pour tous."
        ],
        [
            'quote' => "Le courage, c'est de chercher la vérité et de la dire ; ce n'est pas de subir la loi du mensonge triomphant.",
            'translation' => "Courage is to seek the truth and tell it; it is not to suffer the law of the triumphant lie.",
            'author' => "Jean Jaurès",
            'word' => "Subir",
            'translation_word' => "To undergo / To suffer / To endure",
            'usage' => "Il a dû subir plusieurs examens médicaux avant d'obtenir son diagnostic."
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
                    'translation' => $selectedFrench['translation'],
                    'author' => $selectedFrench['author']
                ],
                'frenchWord' => [
                    'word' => $selectedFrench['word'],
                    'translation' => $selectedFrench['translation_word'],
                    'usage' => $selectedFrench['usage']
                ]
            ];
        });
    }
}
