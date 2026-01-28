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
            <div className="w-full h-32 md:h-48 lg:h-64 bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-2xl">🏔️</span>
            </div>
        );
    }

    if (!imageData) return null;

    return (
        <div className="flex flex-col w-full group">
            <a
                href={imageData.maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full h-48 md:h-64 lg:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-all group-hover:shadow-indigo-200 group-hover:border-indigo-50 bg-gray-50 cursor-pointer block"
                title="View on Google Maps"
            >
                <img
                    src={imageData.url}
                    alt={imageData.location}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1527668752968-14dc70a27c85?auto=format&fit=crop&q=80&w=400&h=300"; // Reliable fallback
                    }}
                />

                {/* Minimal Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center backdrop-blur-[3px]">
                    <div className="flex flex-col items-center">
                        <MapPin size={24} className="text-indigo-300 mb-2" />
                        <p className="text-sm font-bold text-white uppercase tracking-widest leading-tight px-2 mb-2">
                            {imageData.location}
                        </p>
                        <div className="text-[10px] text-white font-black uppercase tracking-[0.2em] border-2 border-white/40 px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
                            Explore on Maps
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}
