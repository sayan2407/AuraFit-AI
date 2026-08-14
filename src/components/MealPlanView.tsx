import React, { useState } from 'react';
import { DailyMealPlan, MealItem, UserProfile } from '../types';
import { Utensils, Check, Flame, Globe, Sparkles, RefreshCw, Plus, X, Loader2, Info } from 'lucide-react';

interface MealPlanViewProps {
  weeklyMeals: DailyMealPlan[];
  completedMealIds: string[];
  onToggleMealComplete: (mealId: string) => void;
  onAddCustomMeal?: (dayIdx: number, newMeal: MealItem) => void;
  profile: UserProfile | null;
  onRegeneratePlan?: () => void;
  isGenerating?: boolean;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({
  weeklyMeals,
  completedMealIds,
  onToggleMealComplete,
  onAddCustomMeal,
  profile,
  onRegeneratePlan,
  isGenerating = false,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  // Custom Food Modal state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [customPortion, setCustomPortion] = useState('1 serving');
  const [customMealType, setCustomMealType] = useState('Custom Snack');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  const activeDay = weeklyMeals[selectedDayIdx] || weeklyMeals[0];

  // Calculate actual consumed macros for selected day
  const consumedMeals = activeDay?.meals?.filter((m) => completedMealIds.includes(m.id)) || [];
  const consumedCalories = consumedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const consumedProtein = consumedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const consumedCarbs = consumedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const consumedFats = consumedMeals.reduce((acc, m) => acc + (m.fats || 0), 0);

  const targetCal = activeDay?.totalCalories || 2200;
  const targetProt = activeDay?.totalProtein || 140;
  const targetCarb = activeDay?.totalCarbs || 250;
  const targetFat = activeDay?.totalFats || 65;

  const handleCalculateAndAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodName.trim()) return;

    setIsCalculating(true);
    setCalcError(null);

    try {
      const res = await fetch('/api/calculate-custom-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: customFoodName.trim(),
          portion: customPortion,
          mealType: customMealType,
          profile
        })
      });

      if (res.ok) {
        const calculatedMeal: MealItem = await res.json();
        if (onAddCustomMeal) {
          onAddCustomMeal(selectedDayIdx, calculatedMeal);
        }
        setCustomFoodName('');
        setIsCustomModalOpen(false);
      } else {
        setCalcError('Failed to calculate macros. Please try again.');
      }
    } catch (err) {
      console.error('Error calculating custom food:', err);
      setCalcError('Connection error calculating macros.');
    } finally {
      setIsCalculating(false);
    }
  };

  const getMealTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'lunch':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'evening snack':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'dinner':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Day Selector */}
      <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Utensils className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Cultural & Religious Meal Planner</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Culturally tailored nutrition ({profile?.culture || 'Bengali'} Cuisine • {profile?.religion || 'Hindu'} / {profile?.dietaryType || 'Diet'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Custom Food / Log Mine</span>
            </button>

            {onRegeneratePlan && (
              <button
                onClick={onRegeneratePlan}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-2xl bg-[#0D1117] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Meal Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Days Pill Selector */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
          {weeklyMeals.map((day, idx) => {
            const isSelected = idx === selectedDayIdx;
            const dayConsumedCount = day.meals.filter((m) => completedMealIds.includes(m.id)).length;
            const isAllEaten = day.meals.length > 0 && dayConsumedCount === day.meals.length;

            return (
              <button
                key={day.dayNumber || idx}
                onClick={() => setSelectedDayIdx(idx)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all min-w-[115px] ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20'
                    : 'bg-[#0D1117] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs opacity-90">
                  <span>{day.dayName}</span>
                  {isAllEaten && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                </div>
                <div className="text-xs font-extrabold mt-0.5">{day.totalCalories} kcal</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAILY MACRO PROGRESS SUMMARY BAR */}
      {activeDay && (
        <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-white">
              {activeDay.dayName} Daily Nutrition Tracker
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Logged {consumedMeals.length} of {activeDay.meals.length} Meals
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Calories Progress */}
            <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Calories</span>
                <span className="font-bold text-emerald-400">{consumedCalories} / {targetCal} kcal</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((consumedCalories / targetCal) * 100))}%` }}
                />
              </div>
            </div>

            {/* Protein Progress */}
            <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Protein</span>
                <span className="font-bold text-amber-400">{consumedProtein} / {targetProt}g</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((consumedProtein / targetProt) * 100))}%` }}
                />
              </div>
            </div>

            {/* Carbs Progress */}
            <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Carbs</span>
                <span className="font-bold text-cyan-400">{consumedCarbs} / {targetCarb}g</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((consumedCarbs / targetCarb) * 100))}%` }}
                />
              </div>
            </div>

            {/* Fats Progress */}
            <div className="bg-[#0D1117] p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Fats</span>
                <span className="font-bold text-rose-400">{consumedFats} / {targetFat}g</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((consumedFats / targetFat) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEALS LIST */}
      {activeDay && (
        <div className="space-y-4">
          {activeDay.meals.map((meal, idx) => {
            const isEaten = completedMealIds.includes(meal.id);

            return (
              <div
                key={meal.id || idx}
                className={`bg-[#161B22] border rounded-3xl p-6 text-slate-100 transition-all shadow-md ${
                  isEaten
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Meal Details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleMealComplete(meal.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                          isEaten
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 hover:border-slate-400 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase border ${getMealTypeBadgeColor(meal.mealType)}`}>
                        {meal.mealType}
                      </span>

                      {meal.isCustom ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Custom Logged Food</span>
                        </span>
                      ) : profile?.culture ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0D1117] text-slate-300 border border-slate-800 flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>{profile.culture} Style</span>
                        </span>
                      ) : null}
                    </div>

                    <h4 className={`text-lg font-extrabold ${isEaten ? 'line-through text-slate-400' : 'text-white'}`}>
                      {meal.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0D1117] p-3.5 rounded-2xl border border-slate-800">
                      {meal.description}
                    </p>
                  </div>

                  {/* Right Macro Specs */}
                  <div className="flex flex-col items-end justify-between gap-3 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 min-w-[190px]">
                    <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-lg">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>{meal.calories} kcal</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs w-full bg-[#0D1117] p-2.5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Protein</span>
                        <strong className="text-amber-400 font-bold">{meal.protein}g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Carbs</span>
                        <strong className="text-cyan-400 font-bold">{meal.carbs}g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fats</span>
                        <strong className="text-rose-400 font-bold">{meal.fats}g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fiber</span>
                        <strong className="text-emerald-400 font-bold">{meal.fiber || 5}g</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleMealComplete(meal.id)}
                      className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                        isEaten
                          ? 'bg-[#0D1117] text-emerald-400 border border-slate-800'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEaten ? 'Logged as Eaten' : 'Log Meal Eaten'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOM FOOD / EXTRA MEAL MODAL */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Log Custom Food or Dish</h3>
                  <p className="text-xs text-slate-400">AI will calculate calories & macros automatically</p>
                </div>
              </div>

              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCalculateAndAddCustom} className="space-y-4">
              {/* Quick Preset Pills */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Quick Indian / Regional Examples
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '2 Roti + 1 Bowl Tadka Dal',
                    '1 Bowl Chicken Biryani',
                    '1 Slice Cheese Pizza',
                    '2 Boiled Eggs & Toast',
                    '1 Glass Sattu Protein Drink',
                    'Whey Protein Shake + Almonds'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomFoodName(preset)}
                      className="px-2.5 py-1 rounded-xl bg-[#0D1117] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all text-left"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase text-slate-300">
                  Food Name / Eaten Item <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Chapatis + 1 Bowl Chana Masala or 1 Protein Bar"
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Grid: Portion & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold uppercase text-slate-300">Portion / Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 bowl, 200g, 2 pieces"
                    value={customPortion}
                    onChange={(e) => setCustomPortion(e.target.value)}
                    className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold uppercase text-slate-300">Meal Category</label>
                  <select
                    value={customMealType}
                    onChange={(e) => setCustomMealType(e.target.value)}
                    className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Evening Snack">Evening Snack</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Custom Extra">Custom Extra Dish</option>
                  </select>
                </div>
              </div>

              {calcError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs">
                  {calcError}
                </div>
              )}

              <div className="bg-[#0D1117] p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
                <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Adding this custom food will calculate calories, protein, carbs, fats, and fiber using AI and automatically log it into {activeDay?.dayName || 'today'}'s nutrition summary.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-[#0D1117] hover:bg-slate-800 border border-slate-800 font-extrabold text-xs text-slate-300 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCalculating || !customFoodName.trim()}
                  className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Calculating Macros...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Calculate & Add Meal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
