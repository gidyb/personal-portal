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
            <div className="w-24 h-24 md:w-48 md:h-32 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center border-2 border-white shadow-sm mx-auto">
                <span className="text-xl">🏔️</span>
            </div>
        );
    }

    if (!imageData) return null;

    return (
        <div className="flex flex-col items-center group">
            <div className="relative w-24 h-24 md:w-48 md:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white transition-all group-hover:shadow-indigo-100 group-hover:border-indigo-50">
                <img
                    src={imageData.url}
                    alt={imageData.location}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Minimal Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center">
                        <MapPin size={14} className="text-indigo-300 mb-1" />
                        <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight px-1">
                            {imageData.location}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
