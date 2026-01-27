import React, { useState, useEffect } from 'react';

export default function PortalContent({ auth }) {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetch('/weather')
            .then(res => res.json())
            .then(data => {
                setWeather(data);
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

    return (
        <div className="p-6 space-y-8">
            <div className="text-center">
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

            <div className="bg-indigo-50 rounded-xl p-6 shadow-inner">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                    <span className="mr-2">Weather Forecast</span>
                    {loadingWeather && <span className="text-sm font-normal text-indigo-400 animate-pulse">(Updating...)</span>}
                </h3>

                {weather ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <div className="text-5xl mr-4">
                                {getWeatherIcon(weather.current_weather.weathercode)}
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {weather.current_weather.temperature}°C
                                </div>
                                <div className="text-gray-600">
                                    Current Temperature
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center border-l border-indigo-200 pl-4">
                            <div className="text-gray-700">
                                <span className="font-semibold">Windspeed:</span> {weather.current_weather.windspeed} km/h
                            </div>
                            <div className="text-gray-700">
                                <span className="font-semibold">Condition:</span> {getWeatherDescription(weather.current_weather.weathercode)}
                            </div>
                        </div>
                    </div>
                ) : (
                    !loadingWeather && <div className="text-red-500">Could not load weather data.</div>
                )}
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
