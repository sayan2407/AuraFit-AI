import React from 'react';
import { Dumbbell, Utensils, MessageSquareText, LineChart, User, Flame, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'plan' | 'chat' | 'tracker' | 'profile';
  setActiveTab: (tab: 'plan' | 'chat' | 'tracker' | 'profile') => void;
  profile: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, profile }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#161B22]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('plan')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-slate-950 font-extrabold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  AuraFit AI
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Coach
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Personalized Workouts & Cultural Meal Planner</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'plan'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden md:inline">Workout & Meals</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === 'chat'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span className="hidden md:inline">AI Coach Chat</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span className="hidden md:inline">Logs & Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Profile</span>
            </button>
          </nav>

          {/* Quick Stats Badge */}
          {profile && (
            <div className="hidden lg:flex items-center space-x-3 bg-[#0D1117] px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{profile.goal.toUpperCase()}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="text-slate-300 font-semibold">
                {profile.culture} Cuisine
              </div>
              <span className="text-slate-700">|</span>
              <div className="text-emerald-400 font-semibold capitalize">
                {profile.location === 'gym' ? 'Gym Goer' : 'Home Routine'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
