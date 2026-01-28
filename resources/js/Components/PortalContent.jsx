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
        <div className="p-6 min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                {/* Greeting and Time - Left/Center */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-indigo-600 mb-2">
                        {getGreeting()}
                    </h1>
                    <div className="text-6xl font-mono text-gray-800">
                        {formatTime(time)}
                    </div>
                    <div className="text-gray-500 text-lg">
                        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Dynamic Switzerland Landscape - Center */}
                <div className="hidden md:flex flex-col items-center">
                    <SwitzerlandImage />
                </div>

                <div className="w-full md:w-auto">
                    <a
                        href="https://www.accuweather.com/en/ch/lausanne/315181/daily-weather-forecast/315181"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-indigo-50/50 hover:bg-indigo-100 transition-all rounded-2xl p-2 px-4 shadow-sm group border border-indigo-100/50 hover:border-indigo-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-3xl group-hover:scale-110 transition-transform">
                                {weather?.current_weather ? getWeatherIcon(weather.current_weather.weathercode) : '...'}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xl font-black text-gray-900 leading-none">
                                    {weather?.current_weather ? `${weather.current_weather.temperature}°C` : '--'}
                                </div>

                                {/* Hidden details that appear on hover */}
                                <div className="max-h-0 overflow-hidden group-hover:max-h-12 transition-all duration-300 ease-in-out">
                                    <div className="flex flex-col pt-1">
                                        <div className="text-[9px] font-bold text-indigo-800 flex items-center gap-1 uppercase tracking-widest whitespace-nowrap">
                                            📍 Lausanne
                                        </div>
                                        {weather?.current_weather?.windspeed > 0 && (
                                            <div className="text-[8px] text-gray-500 font-medium whitespace-nowrap">
                                                {weather.current_weather.windspeed} km/h wind
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* Quotes and French Learning Section */}
            <div className="mt-8">
                <QuotePanel />
            </div>

            {/* Financial Panel - Full width, 2-column layout */}
            <div className="mt-12">
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
