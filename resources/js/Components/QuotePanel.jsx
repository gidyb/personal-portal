import React, { useState, useEffect } from 'react';
import { Quote, Languages, BookOpen } from 'lucide-react';

export default function QuotePanel() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        fetch('/quotes')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch quotes', err);
                setLoading(false);
            });
    }, [mounted]);

    if (!mounted || loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side: Quotes */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 space-y-6">
                    {/* English Quote */}
                    <div>
                        <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Quote size={14} /> English Inspiration
                        </h3>
                        <p className="text-gray-800 text-lg font-medium italic leading-relaxed">
                            "{data.englishQuote.text}"
                        </p>
                        <p className="text-gray-400 text-xs mt-1">— {data.englishQuote.author}</p>
                    </div>

                    {/* French Quote */}
                    <div className="pt-4 border-t border-gray-50">
                        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Languages size={14} /> Citation en Français
                        </h3>
                        <p className="text-gray-800 text-lg font-semibold leading-relaxed">
                            "{data.frenchQuote.text}"
                        </p>
                        <p className="text-gray-400 text-xs mt-1">— {data.frenchQuote.author}</p>
                    </div>
                </div>

                {/* Right Side: Word of the Day */}
                <div className="p-6 bg-emerald-50/30">
                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <BookOpen size={14} /> Mot du jour (A2-B1)
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <span className="text-3xl font-black text-emerald-950 block">
                                {data.frenchWord.word}
                            </span>
                            <span className="text-emerald-700 font-medium text-sm">
                                {data.frenchWord.translation}
                            </span>
                        </div>

                        <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-tighter mb-1">Usage Commun</p>
                            <p className="text-gray-800 italic leading-relaxed">
                                "{data.frenchWord.usage}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
