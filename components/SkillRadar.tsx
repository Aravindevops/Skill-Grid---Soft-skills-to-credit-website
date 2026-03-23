import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { SkillMetrics } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  skills: SkillMetrics;
}

const SkillRadar: React.FC<Props> = ({ skills }) => {
  const { theme } = useTheme();
  
  const data = [
    { subject: 'Leadership', A: skills?.leadership || 0, fullMark: 100 },
    { subject: 'Creativity', A: skills?.creativity || 0, fullMark: 100 },
    { subject: 'Teamwork', A: skills?.teamwork || 0, fullMark: 100 },
    { subject: 'Technical', A: skills?.technical || 0, fullMark: 100 },
    { subject: 'Communication', A: skills?.communication || 0, fullMark: 100 },
  ];

  // Dynamic colors based on theme
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0'; // slate-700 vs slate-200
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 vs slate-500
  const radarStroke = theme === 'dark' ? '#818cf8' : '#4f46e5'; // indigo-400 vs indigo-600
  const radarFill = theme === 'dark' ? '#6366f1' : '#6366f1'; 

  return (
    <div className="w-full h-[400px] bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200 flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Skill Analysis</h3>
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: tickColor, fontSize: 13, fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="My Skills"
              dataKey="A"
              stroke={radarStroke}
              strokeWidth={3}
              fill={radarFill}
              fillOpacity={0.4}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillRadar;