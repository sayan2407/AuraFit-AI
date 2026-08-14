import React, { useState } from 'react';
import { EXERCISE_VISUALS_DATABASE, ExerciseVisualDefinition, getYoutubeVideoForExercise } from '../data/exerciseVisuals';
import { AlertTriangle, CheckCircle, Target, Sparkles, Activity, HelpCircle, Youtube, ExternalLink, RefreshCw, Volume2, ShieldCheck } from 'lucide-react';
import { ExerciseItem } from '../types';

interface ExerciseVisualizerProps {
  exercise: ExerciseItem;
  onClose?: () => void;
}

export const ExerciseVisualizer: React.FC<ExerciseVisualizerProps> = ({ exercise, onClose }) => {
  // Resolve the best YouTube video tutorial intelligently
  const resolved = getYoutubeVideoForExercise(exercise.name, exercise.visualKey);
  const visualDef: ExerciseVisualDefinition = 
    EXERCISE_VISUALS_DATABASE[exercise.visualKey] || 
    EXERCISE_VISUALS_DATABASE[resolved.defaultVisualKey] || 
    EXERCISE_VISUALS_DATABASE['push_ups'];

  const activeVideoId = exercise.youtubeVideoId || visualDef.youtubeVideoId || resolved.videoId;
  const [currentVideoId, setCurrentVideoId] = useState<string>(activeVideoId);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);

  // Alternative quick-switch video options for varied trainer perspectives
  const alternativeVideos = [
    { label: 'Primary Form Tutorial', id: activeVideoId, title: visualDef.videoTitle || resolved.title },
    { label: 'Alternative Angle / Variations', id: resolved.videoId !== activeVideoId ? resolved.videoId : 'IODxDxX7oi4', title: 'Technique Breakdown' },
  ].filter((v, idx, arr) => arr.findIndex((t) => t.id === v.id) === idx);

  return (
    <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-6 max-w-3xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {visualDef.bodyPart.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
              <Youtube className="w-3.5 h-3.5 text-rose-500" />
              <span>In-App Video Form Tutorial</span>
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1.5">{exercise.name}</h3>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-bold"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* IN-APP YOUTUBE VIDEO EMBED PLAYER (NO REDIRECT) */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Youtube className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Exercise Video Demonstration
              </span>
              <span className="text-[11px] text-slate-400">
                Playing directly inside app • No redirection
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Embedded Player</span>
            </span>
          </div>
        </div>

        {/* Video Frame Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
          <iframe
            key={currentVideoId}
            src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?rel=0&modestbranding=1&autoplay=0&iv_load_policy=3&playsinline=1`}
            title={exercise.name + ' form tutorial'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-2xl border-0"
            onLoad={() => setIsVideoLoading(false)}
          />
        </div>

        {/* Video Subtitle & Quick Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-300 font-medium truncate">
              {visualDef.videoTitle || `${exercise.name} Proper Technique & Form Guide`}
            </span>
          </div>

          {alternativeVideos.length > 1 && (
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span className="text-[11px] text-slate-500">Video Source:</span>
              {alternativeVideos.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => setCurrentVideoId(alt.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                    currentVideoId === alt.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#161B22] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {alt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WHY YOU WILL DO THIS EXERCISE BANNER */}
      <div className="bg-[#0D1117] border border-emerald-500/30 rounded-2xl p-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Why You Will Do This Exercise:</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed font-normal">
          {exercise.why || visualDef.description}
        </p>
      </div>

      {/* MUSCLE TARGETING BADGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center space-x-1 mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Targeting Primary Muscle</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visualDef.primaryMuscles.map((m) => (
              <span key={m} className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Secondary Assisting Muscles</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visualDef.secondaryMuscles.map((m) => (
              <span key={m} className="px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 font-semibold text-xs border border-cyan-500/30">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* EXECUTION STEPS & COMMON MISTAKES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Correct Execution */}
        <div className="bg-[#0D1117] p-4.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>How To Perform Correctly</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed font-normal">
            {visualDef.executionSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Mistakes to Avoid */}
        <div className="bg-[#0D1117] p-4.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-rose-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Mistakes To Avoid</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed font-normal">
            {visualDef.commonMistakes.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
