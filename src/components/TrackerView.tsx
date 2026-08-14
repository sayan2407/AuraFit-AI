import React, { useState } from 'react';
import { UserProfile, LoggedMealAnalysis, WeightLogEntry } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { GlassWater, Plus, Trash2, LineChart as ChartIcon, Award, Scale, CheckCircle, Calendar } from 'lucide-react';

interface TrackerViewProps {
  profile: UserProfile | null;
  completedExerciseIds: string[];
  completedMealIds: string[];
  loggedMealAnalyses: LoggedMealAnalysis[];
  weightHistory: WeightLogEntry[];
  onAddWeightEntry: (weight: number) => void;
  onClearData: () => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  profile,
  completedExerciseIds,
  completedMealIds,
  loggedMealAnalyses,
  weightHistory,
  onAddWeightEntry,
  onClearData,
}) => {
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [newWeightInput, setNewWeightInput] = useState<string>('');

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 0) {
      onAddWeightEntry(val);
      setNewWeightInput('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ChartIcon className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Logs, Analytics & Local Storage</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            All your activity, weight logs, and meal scans are securely saved in your local browser storage.
          </p>
        </div>

        <button
          onClick={onClearData}
          className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition-all self-start md:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset Saved Browser Data</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161B22] border border-slate-800 p-5 rounded-3xl text-slate-100 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase">Exercises Completed</div>
          <div className="text-3xl font-black text-emerald-400">{completedExerciseIds.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">Saved in browser</div>
        </div>

        <div className="bg-[#161B22] border border-slate-800 p-5 rounded-3xl text-slate-100 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase">Meals Eaten & Scanned</div>
          <div className="text-3xl font-black text-amber-400">{completedMealIds.length + loggedMealAnalyses.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">Tracked nutrition</div>
        </div>

        <div className="bg-[#161B22] border border-slate-800 p-5 rounded-3xl text-slate-100 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase">Current Weight</div>
          <div className="text-3xl font-black text-cyan-400">
            {profile?.weight} <span className="text-sm font-normal">{profile?.weightUnit}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Goal: {profile?.goal}</div>
        </div>

        <div className="bg-[#161B22] border border-slate-800 p-5 rounded-3xl text-slate-100 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase">Hydration Today</div>
          <div className="text-3xl font-black text-blue-400">{waterGlasses * 250} ml</div>
          <div className="text-[11px] text-slate-500 font-medium">{waterGlasses} of 8 glasses</div>
        </div>
      </div>

      {/* WATER HYDRATION TRACKER */}
      <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <GlassWater className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg text-white">Daily Water Hydration Tracker</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Target: 2,000 ml (8 Glasses)</span>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isFilled = idx < waterGlasses;
            return (
              <button
                key={idx}
                onClick={() => setWaterGlasses(idx + 1)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center space-y-1 min-w-[70px] ${
                  isFilled
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : 'bg-[#0D1117] border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <GlassWater className="w-6 h-6" />
                <span className="text-[10px] font-extrabold">250ml</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WEIGHT PROGRESS CHART */}
      <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">Weight Log Progress Chart</h3>
          </div>

          <form onSubmit={handleAddWeight} className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              placeholder={`Log weight (${profile?.weightUnit || 'kg'})...`}
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              className="bg-[#0D1117] border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          </form>
        </div>

        {weightHistory.length > 0 ? (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightHistory}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: '#334155', borderRadius: '16px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 font-medium">
            No weight entries logged yet. Add your first entry above to start tracking progress.
          </div>
        )}
      </div>

      {/* SCANNED MEALS HISTORY */}
      {loggedMealAnalyses.length > 0 && (
        <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
          <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3">
            Scanned Meal Photos History
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loggedMealAnalyses.map((item) => (
              <div key={item.id} className="bg-[#0D1117] border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-400 text-sm">{item.foodName}</span>
                  <span className="text-slate-500 font-medium">{item.date}</span>
                </div>

                <div className="flex items-center space-x-3 text-slate-300 font-medium">
                  <span>🔥 {item.calories} kcal</span>
                  <span>💪 {item.protein}g P</span>
                  <span>🌾 {item.carbs}g C</span>
                  <span>🥑 {item.fats}g F</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
