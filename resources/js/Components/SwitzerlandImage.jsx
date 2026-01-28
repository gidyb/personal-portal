import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function SwitzerlandImage() {
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        fetch('/landscape')
            .then(res => res.json())
            .then(data => {
                setImageData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch landscape image', err);
                setLoading(false);
            });
    }, [mounted]);

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-3xl animate-pulse mb-8 flex items-center justify-center">
                <div className="text-gray-300 flex flex-col items-center">
                    <span className="text-4xl mb-2">🏔️</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Loading Switzerland...</span>
                </div>
            </div>
        );
    }

    if (!imageData) return null;

    return (
        <div className="relative w-full h-80 md:h-96 group mb-8">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                    src={imageData.url}
                    alt={imageData.location}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                {/* Location Info */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-white mb-1 drop-shadow-lg">
                        <MapPin size={18} className="text-indigo-400" />
                        <span className="text-sm font-bold uppercase tracking-widest opacity-90">Switzerland</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-2xl">
                        {imageData.location}
                    </h2>

                    {/* Status Tags */}
                    <div className="flex gap-2 mt-3 overflow-hidden">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-tighter border border-white/20">
                            {imageData.season_tag}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-tighter border border-white/20">
                            {imageData.weather_tag}
                        </span>
                        <span className="px-3 py-1 bg-indigo-500/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-tighter border border-indigo-400/50">
                            Refreshes Hourly
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
