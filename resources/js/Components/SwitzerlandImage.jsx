import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function SwitzerlandImage() {
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [version, setVersion] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        setLoading(true);
        setError(null);

        fetch(`/landscape?v=${version}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setImageData(data);
            })
            .catch(err => {
                console.error('Failed to fetch landscape image', err);
                setError(err.message);
                setLoading(false);
            });
    }, [mounted, version]);

    const handleNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVersion(prev => prev + 1);
    };

    if (!mounted) return null;

    if (error) {
        return (
            <div className="w-full h-32 md:h-48 lg:h-64 bg-red-50 rounded-3xl flex items-center justify-center border-2 border-red-200">
                <div className="text-red-500 text-xs font-bold p-4 text-center">
                    Image Load Error: {error}
                    <br />
                    <button onClick={() => setVersion(v => v + 1)} className="mt-2 text-indigo-600 hover:underline">Retry</button>
                </div>
            </div>
        );
    }

    if (loading && version === 0 && !imageData) {
        return (
            <div className="w-full h-32 md:h-48 lg:h-64 bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-2xl">🏔️</span>
            </div>
        );
    }

    if (!imageData) return null;

    return (
        <div className="flex flex-col w-full group relative">
            <a
                href={imageData.maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full h-48 md:h-64 lg:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-all group-hover:shadow-indigo-200 group-hover:border-indigo-50 bg-gray-50 cursor-pointer block opacity-100"
                title="View on Google Maps"
            >
                <img
                    src={imageData.url}
                    alt={imageData.location}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onLoad={() => setLoading(false)}
                    onError={(e) => {
                        console.error('Image Load Error', e);
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1527668752968-14dc70a27c85?auto=format&fit=crop&q=80&w=400&h=300";
                    }}
                />

                {/* Debug Info Overlay - Temporary */}
                <div className="absolute bottom-0 left-0 bg-black/80 text-green-300 text-[10px] p-2 leading-tight w-full break-all font-mono z-50 pointer-events-none opacity-50 hover:opacity-100">
                    STATUS: {loading ? 'LOADING' : 'LOADED'} | V: {version} <br />
                    URL: {imageData.url}
                </div>

                {/* Minimal Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center backdrop-blur-[3px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col items-center">
                            <MapPin size={24} className="text-indigo-300 mb-2" />
                            <p className="text-sm font-bold text-white uppercase tracking-widest leading-tight px-2">
                                {imageData.location}
                            </p>
                        </div>

                        {/* Next Button - High Visibility on Hover */}
                        <button
                            onClick={handleNext}
                            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 pointer-events-auto"
                        >
                            <span>Next Picture</span>
                            <span className="text-lg leading-none">→</span>
                        </button>
                    </div>
                </div>
            </a>

            {/* Loading Spinner for switch */}
            {loading && version > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
