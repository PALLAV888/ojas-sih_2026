import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface CheckInPoint {
  id?: string;
  date: string;
  sleep: number;
  energy: number;
  stress: number;
  digestion: number;
  mood: number;
  treatmentFollowed: 'yes' | 'partially' | 'no';
  wellnessScore?: number;
}

interface ImprovementChartProps {
  checkIns: CheckInPoint[];
  patientName?: string;
}

export const ImprovementChart: React.FC<ImprovementChartProps> = ({
  checkIns,
  patientName
}) => {
  // Format and calculate scores if missing
  const chartData = checkIns
    .map((c) => {
      let score = c.wellnessScore;
      if (typeof score !== 'number') {
        const avg = (c.sleep + c.energy + c.stress + c.digestion + c.mood) / 5;
        score = Math.round(100 - (avg - 1) * 25);
      }
      return {
        date: c.date.length > 5 ? c.date.slice(5) : c.date,
        fullDate: c.date,
        score,
        treatmentFollowed: c.treatmentFollowed
      };
    })
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  // Determine trend
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (chartData.length >= 2) {
    const firstScore = chartData[0].score;
    const lastScore = chartData[chartData.length - 1].score;
    if (lastScore > firstScore + 3) {
      trend = 'improving';
    } else if (lastScore < firstScore - 3) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }
  }

  const strokeColor =
    trend === 'improving' ? '#1f5233' : trend === 'declining' ? '#c97a4a' : '#1a3d5c';

  return (
    <div id="patient-improvement-chart-card" className="bg-white rounded-xl p-5 border border-[#a8b5a8]/30 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#1a1a1a]">
            Clinical Wellness Trajectory & Adherence
          </h4>
          <p className="text-xs text-[#6b7280]">
            Multi-variable recovery index plotted over daily check-in reports
          </p>
        </div>

        {/* Trend badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold">
          {trend === 'improving' && (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" />
              Improving ↑
            </span>
          )}
          {trend === 'declining' && (
            <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              <TrendingDown className="w-3.5 h-3.5" />
              Declining ↓
            </span>
          )}
          {trend === 'stable' && (
            <span className="flex items-center gap-1 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
              <Minus className="w-3.5 h-3.5" />
              Stable →
            </span>
          )}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-[#fef9f3] rounded-lg border border-dashed border-gray-200">
          <p className="text-xs text-[#6b7280]">
            No daily check-ins recorded yet for this patient.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Data points will appear as daily reflections are submitted.
          </p>
        </div>
      ) : (
        <>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1a3d5c] text-white p-2.5 rounded-lg text-xs shadow-lg">
                          <div className="font-semibold">{d.fullDate}</div>
                          <div className="text-emerald-300 font-bold text-sm">
                            Wellness Score: {d.score}/100
                          </div>
                          <div className="text-[11px] text-gray-200 capitalize">
                            Adherence: {d.treatmentFollowed}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#d4a574"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Good Baseline (70)',
                    fill: '#d4a574',
                    fontSize: 10,
                    position: 'insideBottomRight'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={strokeColor}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: strokeColor }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Adherence dots legend & timeline */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#6b7280] font-medium">Daily Adherence:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {chartData.map((d, i) => (
                  <div
                    key={i}
                    title={`${d.fullDate}: Adherence ${d.treatmentFollowed} (Score ${d.score})`}
                    className="flex flex-col items-center gap-0.5 cursor-pointer"
                  >
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        d.treatmentFollowed === 'yes'
                          ? 'bg-emerald-500'
                          : d.treatmentFollowed === 'partially'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="text-[9px] text-gray-400">{d.date.slice(-2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#6b7280]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Full
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Partial
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Missed
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImprovementChart;
