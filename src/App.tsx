import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileQuestionnaire } from './components/ProfileQuestionnaire';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { MealPlanView } from './components/MealPlanView';
import { AICoachChat } from './components/AICoachChat';
import { TrackerView } from './components/TrackerView';
import { UserProfile, DailyWorkoutPlan, DailyMealPlan, ChatMessage, LoggedMealAnalysis, WeightLogEntry } from './types';
import { getDefaultWorkoutPlan, getDefaultMealPlan, calculateMacros } from './data/defaultPlans';
import { Sparkles, Utensils, Dumbbell, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'chat' | 'tracker' | 'profile'>('plan');
  const [planSubTab, setPlanSubTab] = useState<'workout' | 'meal'>('workout');

  // Local Storage States
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('aurafit_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default initial Bengali / Hindu profile matching prompt
    return {
      gender: 'M',
      age: 24,
      weight: 68,
      weightUnit: 'kg',
      height: 173,
      heightUnit: 'cm',
      goal: 'bulking',
      location: 'gym',
      equipment: ['dumbbells', 'pullup_bar', 'barbell'],
      culture: 'Bengali',
      religion: 'Hindu',
      dietaryType: 'Non-Vegetarian'
    };
  });

  const [weeklyWorkouts, setWeeklyWorkouts] = useState<DailyWorkoutPlan[]>(() => {
    const saved = localStorage.getItem('aurafit_workouts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return getDefaultWorkoutPlan(
      profile || {
        gender: 'M', age: 24, weight: 68, weightUnit: 'kg', height: 173, heightUnit: 'cm',
        goal: 'bulking', location: 'gym', equipment: ['dumbbells'], culture: 'Bengali', religion: 'Hindu', dietaryType: 'Non-Vegetarian'
      }
    );
  });

  const [weeklyMeals, setWeeklyMeals] = useState<DailyMealPlan[]>(() => {
    const saved = localStorage.getItem('aurafit_meals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return getDefaultMealPlan(
      profile || {
        gender: 'M', age: 24, weight: 68, weightUnit: 'kg', height: 173, heightUnit: 'cm',
        goal: 'bulking', location: 'gym', equipment: ['dumbbells'], culture: 'Bengali', religion: 'Hindu', dietaryType: 'Non-Vegetarian'
      }
    );
  });

  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('aurafit_completed_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedMealIds, setCompletedMealIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('aurafit_completed_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aurafit_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'coach',
        text: 'Hello! I am your AuraFit AI Coach. I can help you customize exercises, suggest Bengali/Assamese/Bihari/Indian meals, or scan meal photos to calculate exact macros. How can I assist your fitness journey today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [loggedMealAnalyses, setLoggedMealAnalyses] = useState<LoggedMealAnalysis[]>(() => {
    const saved = localStorage.getItem('aurafit_scanned_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [weightHistory, setWeightHistory] = useState<WeightLogEntry[]>(() => {
    const saved = localStorage.getItem('aurafit_weight_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { date: '1 Week Ago', weight: (profile?.weight || 68) - 0.8, unit: profile?.weightUnit || 'kg' },
      { date: 'Today', weight: profile?.weight || 68, unit: profile?.weightUnit || 'kg' }
    ];
  });

  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    if (profile) localStorage.setItem('aurafit_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('aurafit_workouts', JSON.stringify(weeklyWorkouts));
  }, [weeklyWorkouts]);

  useEffect(() => {
    localStorage.setItem('aurafit_meals', JSON.stringify(weeklyMeals));
  }, [weeklyMeals]);

  useEffect(() => {
    localStorage.setItem('aurafit_completed_exercises', JSON.stringify(completedExerciseIds));
  }, [completedExerciseIds]);

  useEffect(() => {
    localStorage.setItem('aurafit_completed_meals', JSON.stringify(completedMealIds));
  }, [completedMealIds]);

  useEffect(() => {
    localStorage.setItem('aurafit_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('aurafit_scanned_meals', JSON.stringify(loggedMealAnalyses));
  }, [loggedMealAnalyses]);

  useEffect(() => {
    localStorage.setItem('aurafit_weight_history', JSON.stringify(weightHistory));
  }, [weightHistory]);

  // Generate full plan using backend Gemini
  const handleGeneratePlan = async (userProf: UserProfile, shouldGenerateAi: boolean) => {
    setProfile(userProf);

    if (!shouldGenerateAi) {
      setActiveTab('plan');
      return;
    }

    setIsGeneratingPlan(true);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProf }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.weeklyWorkouts && data.weeklyWorkouts.length > 0) {
          setWeeklyWorkouts(data.weeklyWorkouts);
        }
        if (data.weeklyMeals && data.weeklyMeals.length > 0) {
          setWeeklyMeals(data.weeklyMeals);
        }
      } else {
        // Fallback to client smart template generator if API fails
        setWeeklyWorkouts(getDefaultWorkoutPlan(userProf));
        setWeeklyMeals(getDefaultMealPlan(userProf));
      }
    } catch (e) {
      console.error('Failed to generate AI plan:', e);
      setWeeklyWorkouts(getDefaultWorkoutPlan(userProf));
      setWeeklyMeals(getDefaultMealPlan(userProf));
    } finally {
      setIsGeneratingPlan(false);
      setActiveTab('plan');
    }
  };

  // Toggle Exercise Complete
  const handleToggleExerciseComplete = (exId: string) => {
    setCompletedExerciseIds((prev) =>
      prev.includes(exId) ? prev.filter((id) => id !== exId) : [...prev, exId]
    );
  };

  // Toggle Meal Complete
  const handleToggleMealComplete = (mealId: string) => {
    setCompletedMealIds((prev) =>
      prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  // Add Custom User Meal with AI calculated macros
  const handleAddCustomMeal = (dayIdx: number, customMeal: any) => {
    setWeeklyMeals((prev) => {
      const updated = [...prev];
      if (updated[dayIdx]) {
        const existingMeals = updated[dayIdx].meals || [];
        updated[dayIdx] = {
          ...updated[dayIdx],
          meals: [...existingMeals, customMeal],
        };
      }
      return updated;
    });
    // Auto-mark as eaten so macros immediately update
    setCompletedMealIds((prev) => [...prev, customMeal.id]);
  };

  // Add Weight Entry
  const handleAddWeightEntry = (weightVal: number) => {
    const entry: WeightLogEntry = {
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      weight: weightVal,
      unit: profile?.weightUnit || 'kg'
    };
    setWeightHistory((prev) => [...prev, entry]);
    if (profile) {
      setProfile({ ...profile, weight: weightVal });
    }
  };

  // Send Chat message & handle meal picture analysis
  const handleSendMessage = async (text: string, imageBase64?: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imageBase64
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsSendingChat(true);

    try {
      let analysisResult: LoggedMealAnalysis | undefined = undefined;

      // If an image was attached, scan nutrients first
      if (imageBase64) {
        const analyzeRes = await fetch('/api/analyze-meal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64, profile })
        });

        if (analyzeRes.ok) {
          const analysis = await analyzeRes.json();
          analysisResult = {
            id: `scan_${Date.now()}`,
            date: new Date().toLocaleDateString(),
            imageUrl: imageBase64,
            ...analysis
          };
        }
      }

      // Get Chat Response
      const updatedMessagesForApi = [...chatMessages, userMsg].map((m) => ({ text: m.text }));
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessagesForApi, profile })
      });

      let coachText = "I've analyzed your request and updated your fitness guidance!";
      if (chatRes.ok) {
        const data = await chatRes.json();
        coachText = data.text || coachText;
      }

      const coachMsg: ChatMessage = {
        id: `msg_coach_${Date.now()}`,
        sender: 'coach',
        text: coachText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mealAnalysis: analysisResult
      };

      setChatMessages((prev) => [...prev, coachMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'coach',
        text: 'I am currently processing your fitness goal. Feel free to ask about exercises, meal recipes, or form technique!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleLogAnalyzedMeal = (analysis: LoggedMealAnalysis) => {
    setLoggedMealAnalyses((prev) => [analysis, ...prev]);
    alert(`Logged ${analysis.foodName} (${analysis.calories} kcal) to your local nutrition tracker!`);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to reset all saved local browser data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* TAB 1: PLAN VIEW (Workout & Meal Plans) */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Subtab Toggle (Workout Routine vs Meal Planner) */}
            <div className="flex items-center justify-between bg-[#161B22] border border-slate-800 p-2 rounded-3xl max-w-md mx-auto shadow-xl">
              <button
                onClick={() => setPlanSubTab('workout')}
                className={`flex-1 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all ${
                  planSubTab === 'workout'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>Workout Routine</span>
              </button>

              <button
                onClick={() => setPlanSubTab('meal')}
                className={`flex-1 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all ${
                  planSubTab === 'meal'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Meal Planner</span>
              </button>
            </div>

            {planSubTab === 'workout' ? (
              <WorkoutPlanView
                weeklyWorkouts={weeklyWorkouts}
                completedExerciseIds={completedExerciseIds}
                onToggleExerciseComplete={handleToggleExerciseComplete}
                onRegeneratePlan={() => profile && handleGeneratePlan(profile, true)}
                isGenerating={isGeneratingPlan}
              />
            ) : (
              <MealPlanView
                weeklyMeals={weeklyMeals}
                completedMealIds={completedMealIds}
                onToggleMealComplete={handleToggleMealComplete}
                onAddCustomMeal={handleAddCustomMeal}
                profile={profile}
                onRegeneratePlan={() => profile && handleGeneratePlan(profile, true)}
                isGenerating={isGeneratingPlan}
              />
            )}
          </div>
        )}

        {/* TAB 2: AI COACH CHAT */}
        {activeTab === 'chat' && (
          <AICoachChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onLogAnalyzedMeal={handleLogAnalyzedMeal}
            profile={profile}
            isSending={isSendingChat}
          />
        )}

        {/* TAB 3: TRACKER & PROGRESS */}
        {activeTab === 'tracker' && (
          <TrackerView
            profile={profile}
            completedExerciseIds={completedExerciseIds}
            completedMealIds={completedMealIds}
            loggedMealAnalyses={loggedMealAnalyses}
            weightHistory={weightHistory}
            onAddWeightEntry={handleAddWeightEntry}
            onClearData={handleClearData}
          />
        )}

        {/* TAB 4: PROFILE & QUESTIONNAIRE */}
        {activeTab === 'profile' && (
          <ProfileQuestionnaire
            initialProfile={profile}
            onSaveProfile={handleGeneratePlan}
            isGenerating={isGeneratingPlan}
          />
        )}
      </main>
    </div>
  );
}
