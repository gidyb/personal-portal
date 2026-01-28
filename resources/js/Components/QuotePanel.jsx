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
                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Quote size={12} /> English Inspiration
                        </h4>
                        <p className="text-gray-800 text-lg font-medium italic leading-relaxed">
                            "{data.englishQuote.text}"
                        </p>
                        <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-tighter">— {data.englishQuote.author}</p>
                    </div>

                    {/* French Quote */}
                    <div className="pt-4 border-t border-gray-50 group relative">
                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Languages size={12} /> Citation en Français
                        </h4>
                        <div className="relative">
                            <p className="text-gray-800 text-lg font-semibold leading-relaxed cursor-help decoration-emerald-200/50 decoration-2 underline-offset-4 hover:underline transition-all">
                                "{data.frenchQuote.text}"
                            </p>
                            {/* Hover Translation Tooltip */}
                            <div className="absolute left-0 -top-2 -translate-y-full w-full bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700">
                                <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                                    <Languages size={10} /> Traduction
                                </div>
                                {data.frenchQuote.translation}
                                <div className="absolute -bottom-1 left-6 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-tighter">— {data.frenchQuote.author}</p>
                    </div>
                </div>

                {/* Right Side: Word of the Day */}
                <div className="p-6 bg-emerald-50/20">
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <BookOpen size={12} /> Mot du jour
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <span className="text-3xl font-black text-emerald-950 block tracking-tight">
                                {data.frenchWord.word}
                            </span>
                            <span className="text-emerald-700 font-medium text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                {data.frenchWord.translation}
                            </span>
                        </div>

                        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50 shadow-sm">
                            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2 opacity-60">Usage Commun</p>
                            <p className="text-gray-800 italic leading-relaxed text-sm">
                                "{data.frenchWord.usage}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
