import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { GameResult } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface PerformanceTrendsChartProps {
  results: GameResult[];
  onStartPractice?: () => void;
}

interface ChartDataPoint {
  index: number;
  sessionLabel: string;
  name: string;
  accuracy: number;
  score: number;
  date: string;
  mode: string;
}

export const PerformanceTrendsChart: React.FC<PerformanceTrendsChartProps> = ({ 
  results = [],
  onStartPractice 
}) => {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  // Take the last 10 sessions (or all if fewer than 10)
  const last10 = results.slice(-10);

  const chartData: ChartDataPoint[] = last10.map((res, i) => ({
    index: i + 1,
    sessionLabel: `S${i + 1}`,
    name: res.title || `Session ${i + 1}`,
    accuracy: Math.max(0, Math.min(100, Math.round(res.accuracy))),
    score: res.score,
    date: res.date,
    mode: res.mode || 'mc'
  }));

  // Calculate summary metrics
  const sessionCount = chartData.length;
  const currentAccuracy = sessionCount > 0 ? chartData[sessionCount - 1].accuracy : 0;
  const accuracies = chartData.map(d => d.accuracy);
  const avgAccuracy = sessionCount > 0 
    ? Math.round(accuracies.reduce((a, b) => a + b, 0) / sessionCount) 
    : 0;
  const maxAccuracy = sessionCount > 0 ? Math.max(...accuracies) : 0;
  const minAccuracy = sessionCount > 0 ? Math.min(...accuracies) : 0;
  const aboveTargetCount = chartData.filter(d => d.accuracy >= 80).length;

  // Compute trend delta (comparing latest session to average of earlier sessions, or first vs last)
  const firstHalf = accuracies.slice(0, Math.max(1, Math.floor(sessionCount / 2)));
  const secondHalf = accuracies.slice(Math.floor(sessionCount / 2));
  const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
  const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
  const trendDelta = Math.round(secondHalfAvg - firstHalfAvg);

  const activePoint = activePointIndex !== null && chartData[activePointIndex]
    ? chartData[activePointIndex]
    : chartData[chartData.length - 1];

  if (sessionCount === 0) {
    return (
      <section 
        id="performance-trends-card"
        className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#28d4c7]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              10-Session Performance Trends
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#102126] text-[#9db4b8] border border-[#23444a]">
            0 Sessions Recorded
          </span>
        </div>
        <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#13262b] border border-[#23444a] flex items-center justify-center text-[#28d4c7]">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No session history yet</h4>
          <p className="text-xs text-[#9db4b8] max-w-sm">
            Complete your first GL revision round or timed quiz to start mapping your accuracy trajectory toward the 80% mastery target.
          </p>
          {onStartPractice && (
            <button
              onClick={onStartPractice}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#28d4c7] text-[#031011] hover:bg-[#20b2a6] active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Start Practice Session
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section 
      id="performance-trends-section"
      className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
    >
      {/* Header with Title & Stat Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23444a]/70 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#28d4c7]/15 text-[#28d4c7]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Accuracy Trends (Last {sessionCount} Sessions)
            </h3>
          </div>
          <p className="text-xs text-[#9db4b8] mt-1">
            Tracking Active Recall Mastery against the 80% GL Assessment benchmark.
          </p>
        </div>

        {/* Highlight Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trend Indicator */}
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
            trendDelta >= 0 
              ? 'bg-[#8bd450]/15 text-[#8bd450] border-[#8bd450]/30' 
              : 'bg-[#ff6b5f]/15 text-[#ff6b5f] border-[#ff6b5f]/30'
          }`}>
            {trendDelta >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {trendDelta >= 0 ? `+${trendDelta}%` : `${trendDelta}%`} Trend
            </span>
          </div>

          {/* GL Mastery Rate */}
          <div className="px-3 py-1.5 rounded-xl bg-[#f2b84b]/15 text-[#f2b84b] border border-[#f2b84b]/30 flex items-center gap-1.5 text-xs font-bold">
            <Target className="w-3.5 h-3.5" />
            <span>{aboveTargetCount}/{sessionCount} ≥ 80% Benchmark</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#102126] border border-[#23444a]/70 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9db4b8]">
            Latest Session
          </div>
          <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
            <span>{currentAccuracy}%</span>
            <span className={`text-[11px] font-bold ${
              currentAccuracy >= 80 ? 'text-[#8bd450]' : 'text-[#f2b84b]'
            }`}>
              {currentAccuracy >= 80 ? 'Mastered' : 'Revising'}
            </span>
          </div>
        </div>

        <div className="bg-[#102126] border border-[#23444a]/70 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9db4b8]">
            10-Session Average
          </div>
          <div className="text-2xl font-black text-[#28d4c7] mt-1 flex items-baseline gap-1.5">
            <span>{avgAccuracy}%</span>
            <span className="text-[11px] text-[#9db4b8] font-medium">Mean</span>
          </div>
        </div>

        <div className="bg-[#102126] border border-[#23444a]/70 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9db4b8]">
            Peak Accuracy
          </div>
          <div className="text-2xl font-black text-[#f2b84b] mt-1 flex items-baseline gap-1.5">
            <span>{maxAccuracy}%</span>
            <Award className="w-3.5 h-3.5 text-[#f2b84b]" />
          </div>
        </div>

        <div className="bg-[#102126] border border-[#23444a]/70 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9db4b8]">
            Lowest Run
          </div>
          <div className="text-2xl font-black text-[#9db4b8] mt-1">
            {minAccuracy}%
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 sm:h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            onMouseMove={(e) => {
              if (e && e.activeTooltipIndex !== undefined) {
                setActivePointIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActivePointIndex(null)}
          >
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#28d4c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#28d4c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#1a353c" 
              vertical={false} 
            />

            <XAxis 
              dataKey="sessionLabel" 
              stroke="#527880"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#23444a' }}
            />

            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 25, 50, 75, 80, 100]}
              stroke="#527880"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#23444a' }}
              tickFormatter={(val) => `${val}%`}
            />

            {/* Target 80% Benchmark Reference Line */}
            <ReferenceLine 
              y={80} 
              stroke="#f2b84b" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              label={{
                value: 'GL 80% Target',
                position: 'insideTopRight',
                fill: '#f2b84b',
                fontSize: 10,
                fontWeight: 700
              }}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataPoint;
                  const isMastered = data.accuracy >= 80;
                  return (
                    <div className="bg-[#081316] border border-[#28d4c7]/50 rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[210px] pointer-events-none">
                      <div className="flex items-center justify-between gap-2 border-b border-[#23444a]/70 pb-2 mb-2">
                        <span className="text-xs font-bold text-[#28d4c7] uppercase">
                          {data.sessionLabel} • {data.mode.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#9db4b8]">
                          {data.date}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white truncate max-w-[220px] mb-2" title={data.name}>
                        {data.name}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-[#9db4b8]">Accuracy:</span>
                        <span className={`text-base font-black ${
                          isMastered ? 'text-[#8bd450]' : 'text-[#f2b84b]'
                        }`}>
                          {data.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-[#102126] rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            isMastered ? 'bg-[#8bd450]' : 'bg-[#f2b84b]'
                          }`}
                          style={{ width: `${data.accuracy}%` }}
                        />
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#23444a]/40 flex items-center justify-between text-[10px] text-[#9db4b8]">
                        <span>Score: {data.score} pts</span>
                        <span>{isMastered ? '✓ Target Met' : 'Needs Review'}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#28d4c7" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#accuracyGradient)"
              dot={{
                r: 3.5,
                fill: '#081316',
                stroke: '#28d4c7',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#28d4c7',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Session Inspector Footer */}
      {activePoint && (
        <div className="mt-4 pt-3 border-t border-[#23444a]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#9db4b8]">
            <Calendar className="w-3.5 h-3.5 text-[#28d4c7]" />
            <span className="font-semibold text-white">{activePoint.sessionLabel}:</span>
            <span className="truncate max-w-xs sm:max-w-md">{activePoint.name}</span>
            <span className="text-[#527880]">({activePoint.date})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#9db4b8]">Score: <strong className="text-white">{activePoint.score}</strong></span>
            <div className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
              activePoint.accuracy >= 80 
                ? 'bg-[#8bd450]/15 text-[#8bd450]' 
                : 'bg-[#f2b84b]/15 text-[#f2b84b]'
            }`}>
              {activePoint.accuracy >= 80 ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              {activePoint.accuracy}% Accuracy
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
