import React, { useState, useEffect } from 'react';
import FinancePanel from './FinancePanel';
import QuotePanel from './QuotePanel';
import SwitzerlandImage from './SwitzerlandImage';

export default function PortalContent({ auth }) {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetch('/weather')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setWeather(data);
                }
                setLoadingWeather(false);
            })
            .catch(err => {
                console.error('Failed to fetch weather', err);
                setLoadingWeather(false);
            });
    }, []);

    const getGreeting = () => {
        const hour = time.getHours();
        const name = auth?.user?.name || 'Gidy';
        if (hour < 12) return `Good Morning, ${name}`;
        if (hour < 18) return `Good Afternoon, ${name}`;
        return `Good Evening, ${name}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Header Section: Info Stack + Hero Landscape */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
                {/* Left Side: Greeting, Time, Weather */}
                <div className="flex flex-col gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                            {getGreeting()}
                        </h1>
                        <div className="text-6xl md:text-7xl font-mono text-gray-800 leading-tight">
                            {formatTime(time)}
                        </div>
                        <div className="text-gray-500 text-lg md:text-xl mb-4">
                            {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        {/* Weather: Moved under the date/time stack */}
                        <div className="inline-block">
                            <a
                                href="https://www.accuweather.com/en/ch/lausanne/315181/daily-weather-forecast/315181"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 bg-white hover:bg-white hover:shadow-md transition-all rounded-3xl p-3 px-6 shadow-sm group border border-gray-100/50 hover:border-indigo-100"
                            >
                                <div className="text-4xl group-hover:scale-110 transition-transform">
                                    {weather?.current_weather ? getWeatherIcon(weather.current_weather.weathercode) : '...'}
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-2xl font-black text-gray-900 leading-none">
                                        {weather?.current_weather ? `${weather.current_weather.temperature}°C` : '--'}
                                    </div>
                                    <div className="max-h-0 overflow-hidden group-hover:max-h-12 transition-all duration-300">
                                        <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-[0.2em] pt-1">
                                            📍 Lausanne
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Hero Switzerland Image */}
                <div className="w-full">
                    <SwitzerlandImage />
                </div>
            </div>

            {/* Main Content: Quote of the Day & French Learning */}
            <div className="mt-6">
                <QuotePanel />
            </div>

            {/* Financial Stats: Full width at the bottom as requested */}
            <div className="mt-10">
                <FinancePanel />
            </div>
        </div>
    );
}

function getWeatherIcon(code) {
    if (code === 0) return '☀️'; // Clear
    if (code <= 3) return '🌤️'; // Partly cloudy
    if (code <= 48) return '🌫️'; // Fog
    if (code <= 57) return '🌦️'; // Drizzle
    if (code <= 67) return '🌧️'; // Rain
    if (code <= 77) return '❄️'; // Snow
    if (code <= 82) return '🌧️'; // Rain showers
    if (code <= 86) return '❄️'; // Snow showers
    if (code <= 99) return '⛈️'; // Thunderstorm
    return '❓';
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
        95: 'Thunderstorm',
    };
    return descriptions[code] || 'Unknown';
}
