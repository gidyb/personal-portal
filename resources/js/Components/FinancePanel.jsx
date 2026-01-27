import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function FinancePanel() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/finance')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch finance data', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full mt-8">
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-24 bg-gray-50 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <TrendingUp size={24} className="text-indigo-600" />
                Financial Markets Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {data.map((item) => (
                    <div key={item.symbol} className="flex flex-col bg-gray-50/50 p-4 rounded-xl border border-gray-50 hover:border-gray-200 transition-all hover:shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-gray-900 leading-none">
                                        {item.currentPrice.toLocaleString()}
                                        <span className="text-xs font-normal text-gray-400 ml-1">{item.currency}</span>
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center ${item.changePercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                                        {item.changePercent > 0 ? <TrendingUp size={10} className="ml-0.5" /> :
                                            item.changePercent < 0 ? <TrendingDown size={10} className="ml-0.5" /> :
                                                <Minus size={10} className="ml-0.5" />}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-28 -mx-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={item.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        hide={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: '#9ca3af' }}
                                        interval={Math.floor(item.history.length / 4)}
                                    />
                                    <YAxis
                                        hide={false}
                                        domain={['auto', 'auto']}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: '#9ca3af' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '10px' }}
                                        itemStyle={{ padding: 0 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={item.changePercent >= 0 ? '#10b981' : '#ef4444'}
                                        strokeWidth={2}
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
                <div className="text-center py-12 text-gray-400">
                    <p>No financial data available at the moment.</p>
                </div>
            )}
        </div>
    );
}
