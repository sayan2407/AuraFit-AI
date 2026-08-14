import React, { useState } from 'react';
import { DailyWorkoutPlan, ExerciseItem } from '../types';
import { ExerciseVisualizer } from './ExerciseVisualizer';
import { Play, Check, Eye, Timer, Award, Dumbbell, Sparkles, RefreshCw } from 'lucide-react';

interface WorkoutPlanViewProps {
  weeklyWorkouts: DailyWorkoutPlan[];
  completedExerciseIds: string[];
  onToggleExerciseComplete: (exerciseId: string) => void;
  onRegeneratePlan?: () => void;
  isGenerating?: boolean;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  weeklyWorkouts,
  completedExerciseIds,
  onToggleExerciseComplete,
  onRegeneratePlan,
  isGenerating = false,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [activeVisualizerExercise, setActiveVisualizerExercise] = useState<ExerciseItem | null>(null);

  // Rest Timer state
  const [activeTimerSec, setActiveTimerSec] = useState<number | null>(null);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);

  const activeDay = weeklyWorkouts[selectedDayIdx] || weeklyWorkouts[0];

  const startRestTimer = (seconds: number) => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setActiveTimerSec(seconds);

    const id = setInterval(() => {
      setActiveTimerSec((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(id);
          // Play subtle browser sound or alert
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch (e) {
            // Audio context fallback
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerIntervalId(id);
  };

  const stopTimer = () => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setActiveTimerSec(null);
  };

  const totalCompletedInDay = activeDay?.exercises?.filter((ex) => completedExerciseIds.includes(ex.id)).length || 0;
  const progressPercent = activeDay?.exercises?.length ? Math.round((totalCompletedInDay / activeDay.exercises.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Active Rest Timer Bar */}
      {activeTimerSec !== null && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161B22] border-2 border-emerald-500 rounded-3xl p-4 text-slate-100 shadow-2xl flex items-center space-x-4 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
            <Timer className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Rest Timer Running</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{activeTimerSec}s</div>
          </div>
          <button
            onClick={stopTimer}
            className="px-3.5 py-1.5 rounded-xl bg-[#0D1117] hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800"
          >
            Skip
          </button>
        </div>
      )}

      {/* Top Banner & Day Selector */}
      <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Dumbbell className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Weekly Workout Plan</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customized exercise routine with targeted muscles, form guides, and physiological benefits.
            </p>
          </div>

          {onRegeneratePlan && (
            <button
              onClick={onRegeneratePlan}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-2xl bg-[#0D1117] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate AI Plan</span>
            </button>
          )}
        </div>

        {/* Days Pill Selector */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
          {weeklyWorkouts.map((day, idx) => {
            const isSelected = idx === selectedDayIdx;
            const completedCount = day.exercises.filter((ex) => completedExerciseIds.includes(ex.id)).length;
            const isDone = day.exercises.length > 0 && completedCount === day.exercises.length;

            return (
              <button
                key={day.dayNumber || idx}
                onClick={() => setSelectedDayIdx(idx)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all min-w-[125px] ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20'
                    : 'bg-[#0D1117] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs opacity-90">
                  <span>{day.dayName}</span>
                  {isDone && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                </div>
                <div className="text-sm font-extrabold mt-0.5 truncate">{day.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY WORKOUT DETAILS */}
      {activeDay && (
        <div className="space-y-6">
          {/* Day Title Card */}
          <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {activeDay.dayName} Focus
                </span>
                {activeDay.isRestDay && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Rest & Recovery Day
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-white mt-1">{activeDay.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Target Area: {activeDay.targetArea}</p>
            </div>

            {/* Daily Completion Progress */}
            {!activeDay.isRestDay && (
              <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800 min-w-[200px]">
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-slate-400">Day Progress</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-1.5">
                  {totalCompletedInDay} of {activeDay.exercises.length} Exercises Done
                </div>
              </div>
            )}
          </div>

          {/* EXERCISE CARDS GRID */}
          <div className="space-y-4">
            {activeDay.exercises.map((ex, idx) => {
              const isCompleted = completedExerciseIds.includes(ex.id);

              return (
                <div
                  key={ex.id || idx}
                  className={`bg-[#161B22] border rounded-3xl p-6 text-slate-100 transition-all shadow-md ${
                    isCompleted
                      ? 'border-emerald-500/50 bg-emerald-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onToggleExerciseComplete(ex.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-600 hover:border-slate-400 text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <h4 className={`text-lg font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {idx + 1}. {ex.name}
                        </h4>

                        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {ex.targetMuscle}
                        </span>
                      </div>

                      {/* Why You Will Do This */}
                      <div className="bg-[#0D1117] p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-emerald-400 font-semibold">Why you will do this: </strong>
                        {ex.why}
                      </div>

                      {/* Form Tips */}
                      {ex.formTips && ex.formTips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">Key Form Tips:</span>
                          {ex.formTips.map((tip, tIdx) => (
                            <span key={tIdx} className="bg-[#0D1117] border border-slate-800 px-2.5 py-1 rounded-xl text-slate-300">
                              • {tip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Stats & Controls */}
                    <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="bg-[#0D1117] px-3.5 py-2 rounded-2xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Sets</span>
                          <span className="font-extrabold text-emerald-400">{ex.sets}</span>
                        </div>

                        <div className="bg-[#0D1117] px-3.5 py-2 rounded-2xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Reps</span>
                          <span className="font-extrabold text-cyan-400">{ex.reps}</span>
                        </div>
                      </div>

                      {/* Rest Timer Button */}
                      <button
                        onClick={() => startRestTimer(ex.restSeconds || 60)}
                        className="px-3.5 py-2 rounded-2xl bg-[#0D1117] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-300 flex items-center space-x-1.5 transition-all"
                      >
                        <Timer className="w-3.5 h-3.5" />
                        <span>Rest ({ex.restSeconds || 60}s)</span>
                      </button>

                      {/* In-App Video Tutorial & Form Modal Launch Button */}
                      <button
                        onClick={() => setActiveVisualizerExercise(ex)}
                        className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm group"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Watch Video & Form</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: EXERCISE FORM VISUALIZER */}
      {activeVisualizerExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8">
            <ExerciseVisualizer
              exercise={activeVisualizerExercise}
              onClose={() => setActiveVisualizerExercise(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
