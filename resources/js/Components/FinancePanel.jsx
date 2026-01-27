import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function FinancePanel() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/finance')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(json.length === 0);
            })
            .catch(err => {
                console.error('Failed to fetch finance data', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full md:w-1/2">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                            <div className="h-8 bg-gray-50 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full md:w-1/2">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp size={24} className="text-indigo-600" />
                Financial Overview
            </h2>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-xl transition-colors">
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900 leading-tight">
                                    {item.currentPrice.toLocaleString()}
                                </span>
                                <span className={`text-xs font-medium flex items-center ${item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                                    {item.changePercent > 0 ? <TrendingUp size={12} className="ml-0.5" /> :
                                        item.changePercent < 0 ? <TrendingDown size={12} className="ml-0.5" /> :
                                            <Minus size={12} className="ml-0.5" />}
                                </span>
                            </div>
                        </div>

                        <div className="w-24 h-12">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={item.history}>
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={item.changePercent >= 0 ? '#10b981' : '#ef4444'}
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No financial data available at the moment.
                </div>
            )}
        </div>
    );
}
