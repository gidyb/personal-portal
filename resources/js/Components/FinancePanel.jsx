import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Minus, ArrowUp, ArrowDown } from 'lucide-react';

export default function FinancePanel() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = () => {
        fetch('/finance')
            .then(res => res.json())
            .then(json => {
                setData(Array.isArray(json) ? json : []);
                setLastUpdated(new Date());
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch finance data', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full mt-6">
                <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-20 bg-gray-50 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-600" />
                    Financial Markets
                </h2>
                {lastUpdated && (
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                            Live updates • Last: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((item) => (
                    <div key={item.symbol} className="flex flex-col bg-gray-50/30 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">{item.name}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-black text-gray-900 leading-none">
                                        {typeof item.currentPrice === 'number' ? item.currentPrice.toLocaleString() : item.currentPrice}
                                    </span>
                                    {item.dailyChangePercent !== undefined && (
                                        <div className={`flex items-center gap-0.5 ${item.dailyChangePercent > 0 ? 'text-emerald-600' :
                                                item.dailyChangePercent < 0 ? 'text-red-600' :
                                                    'text-gray-400'
                                            }`}>
                                            {item.dailyChangePercent > 0 && <ArrowUp size={10} strokeWidth={3} />}
                                            {item.dailyChangePercent < 0 && <ArrowDown size={10} strokeWidth={3} />}
                                            <span className="text-[11px] font-bold leading-none">
                                                {item.dailyChangePercent > 0 ? '+' : ''}{item.dailyChangePercent}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 80 }}>
                            <ResponsiveContainer>
                                <LineChart data={item.history || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="date"
                                        hide={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 8, fill: '#d1d5db' }}
                                        interval={Math.max(1, Math.floor((item.history?.length || 1) / 2))}
                                    />
                                    <YAxis
                                        hide={false}
                                        domain={['auto', 'auto']}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 8, fill: '#d1d5db' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '9px', padding: '4px 8px' }}
                                        itemStyle={{ padding: 0 }}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#6366f1"
                                        strokeWidth={1.5}
                                        dot={false}
                                        activeDot={{ r: 3, strokeWidth: 0 }}
                                        isAnimationActive={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {data.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    <p className="text-sm italic">No market data available.</p>
                </div>
            )}
        </div>
    );
}
