"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
    { subject: '2019', A: 120, B: 110, fullMark: 150 },
    { subject: '2020', A: 98, B: 130, fullMark: 150 },
    { subject: '2021', A: 86, B: 130, fullMark: 150 },
    { subject: '2022', A: 99, B: 100, fullMark: 150 },
    { subject: '2023', A: 85, B: 90, fullMark: 150 },
    { subject: '2024', A: 65, B: 85, fullMark: 150 },
];

export default function DealsRadarChart() {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800">Deals Statistics</h3>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#f3f4f6" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar
                            name="Mike"
                            dataKey="A"
                            stroke="#2A7E74"
                            strokeWidth={2}
                            fill="#2A7E74"
                            fillOpacity={0.2}
                        />
                        <Radar
                            name="Lily"
                            dataKey="B"
                            stroke="#8884d8"
                            strokeWidth={2}
                            fill="#8884d8"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2A7E74]"></span>
                    <span className="text-xs text-gray-500">Target</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8884d8]"></span>
                    <span className="text-xs text-gray-500">Last Week</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                    <span className="text-xs text-gray-500">Last Month</span>
                </div>
            </div>
        </div>
    );
}
