import React, { useState } from 'react';
import { UserProfile, Gender, WeightUnit, HeightUnit, FitnessGoal, WorkoutLocation } from '../types';
import { Sparkles, Check, ChevronRight, Scale, Activity, Globe, HeartHandshake, Dumbbell, ShieldCheck } from 'lucide-react';
import { calculateMacros } from '../data/defaultPlans';

interface ProfileQuestionnaireProps {
  initialProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile, generateAiPlan: boolean) => void;
  isGenerating?: boolean;
}

const CULTURES = [
  'Bengali',
  'Assamese',
  'Bihari',
  'North Indian',
  'South Indian',
  'Punjabi',
  'Maharashtrian',
  'Western',
  'Middle Eastern',
  'East Asian',
  'Global'
];

const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Jain',
  'Sikh',
  'Buddhist',
  'Non-religious / Any'
];

const DIETARY_TYPES = [
  'Non-Vegetarian',
  'Vegetarian',
  'Eggitarian',
  'Halal Non-Veg Only',
  'Sattvic Vegetarian (No Onion/Garlic)',
  'Jain Vegetarian (No Root Veg)',
  'Vegan (Plant-Based)'
];

const EQUIPMENT_OPTIONS = [
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'barbell', label: 'Barbell & Plates' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'pullup_bar', label: 'Pull-Up Bar' },
  { id: 'bench', label: 'Workout Bench' },
  { id: 'cable_machine', label: 'Cable Machine' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'full_gym', label: 'Full Commercial Gym Setup' },
  { id: 'none', label: 'No Equipment (Bodyweight Only)' }
];

export const ProfileQuestionnaire: React.FC<ProfileQuestionnaireProps> = ({
  initialProfile,
  onSaveProfile,
  isGenerating = false,
}) => {
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'M');
  const [age, setAge] = useState<number>(initialProfile?.age || 24);
  const [weight, setWeight] = useState<number>(initialProfile?.weight || 68);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialProfile?.weightUnit || 'kg');
  const [height, setHeight] = useState<number>(initialProfile?.height || 173);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(initialProfile?.heightUnit || 'cm');
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.goal || 'bulking');
  const [location, setLocation] = useState<WorkoutLocation>(initialProfile?.location || 'gym');
  const [equipment, setEquipment] = useState<string[]>(
    initialProfile?.equipment || ['dumbbells', 'pullup_bar']
  );
  const [culture, setCulture] = useState<string>(initialProfile?.culture || 'Bengali');
  const [religion, setReligion] = useState<string>(initialProfile?.religion || 'Hindu');
  const [dietaryType, setDietaryType] = useState<string>(
    initialProfile?.dietaryType || 'Non-Vegetarian'
  );

  // Live estimated stats
  const previewProfile: UserProfile = {
    gender,
    age,
    weight,
    weightUnit,
    height,
    heightUnit,
    goal,
    location,
    equipment,
    culture,
    religion,
    dietaryType
  };

  const calculated = calculateMacros(previewProfile);

  const toggleEquipment = (eqId: string) => {
    if (eqId === 'none') {
      setEquipment(['none']);
      return;
    }
    let updated = equipment.filter((e) => e !== 'none');
    if (updated.includes(eqId)) {
      updated = updated.filter((e) => e !== eqId);
    } else {
      updated.push(eqId);
    }
    if (updated.length === 0) updated = ['none'];
    setEquipment(updated);
  };

  const handleSubmit = (e: React.FormEvent, generateAi: boolean) => {
    e.preventDefault();
    const finalProfile: UserProfile = {
      ...previewProfile,
      targetCalories: calculated.targetCalories,
      targetProtein: calculated.proteinGrams,
      targetCarbs: calculated.carbGrams,
      targetFats: calculated.fatGrams,
      tdee: calculated.tdee,
      bmi: calculated.bmi,
      createdAt: new Date().toISOString()
    };
    onSaveProfile(finalProfile, generateAi);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner Header */}
      <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 mb-8 text-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Fitness & Cultural Diet Profile</h2>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
          Answer a few quick questions to generate your tailored 7-day workout routine and culturally authentic meal plan (Bengali, Assamese, Bihari, Indian & Global options).
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
        {/* SECTION 1: Personal Stats */}
        <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">1. Basic Physical Metrics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['M', 'F', 'Other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2.5 rounded-2xl text-sm font-semibold border transition-all ${
                      gender === g
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md shadow-emerald-500/20'
                        : 'bg-[#0D1117] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Age (Years)
              </label>
              <input
                type="number"
                min={12}
                max={95}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-4 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Weight
                </label>
                <div className="flex items-center space-x-1 bg-[#0D1117] rounded-xl p-1 text-xs border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`px-2 py-0.5 rounded-lg ${
                      weightUnit === 'kg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-2 py-0.5 rounded-lg ${
                      weightUnit === 'lbs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                min={25}
                max={300}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-4 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Height */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Height
                </label>
                <div className="flex items-center space-x-1 bg-[#0D1117] rounded-xl p-1 text-xs border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-2 py-0.5 rounded-lg ${
                      heightUnit === 'cm' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft')}
                    className={`px-2 py-0.5 rounded-lg ${
                      heightUnit === 'ft' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    ft
                  </button>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                min={100}
                max={250}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-4 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Fitness Goal & Location */}
        <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">2. Primary Goal & Workout Setting</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Fitness Goal
              </label>
              <div className="space-y-2">
                {[
                  { id: 'bulking', title: 'Muscle Building / Bulking', desc: 'Caloric surplus for hypertrophy & mass' },
                  { id: 'cutting', title: 'Fat Loss / Cutting', desc: 'Caloric deficit for lean muscle retention & fat burn' },
                  { id: 'maintenance', title: 'Maintenance & Toning', desc: 'Recomposition, athletic stamina & vitality' }
                ].map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setGoal(g.id as FitnessGoal)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                      goal === g.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-[#0D1117] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                      goal === g.id ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'
                    }`}>
                      {goal === g.id && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{g.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{g.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gym vs Home */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Routine / Location
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div
                  onClick={() => setLocation('gym')}
                  className={`p-4 rounded-2xl border cursor-pointer text-center transition-all ${
                    location === 'gym'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Dumbbell className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <div className="text-sm font-semibold">Regular Gym Goer</div>
                  <div className="text-[11px] text-slate-400 mt-1">Full access to machines & free weights</div>
                </div>

                <div
                  onClick={() => setLocation('home')}
                  className={`p-4 rounded-2xl border cursor-pointer text-center transition-all ${
                    location === 'home'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <div className="text-sm font-semibold">Home Workouts Only</div>
                  <div className="text-[11px] text-slate-400 mt-1">Bodyweight or basic home equipment</div>
                </div>
              </div>

              {/* Equipment Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Available Equipment
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {EQUIPMENT_OPTIONS.map((eq) => {
                    const checked = equipment.includes(eq.id);
                    return (
                      <div
                        key={eq.id}
                        onClick={() => toggleEquipment(eq.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center space-x-2 transition-all ${
                          checked
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-medium'
                            : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          checked ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
                        </div>
                        <span>{eq.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Cultural & Religious Dietary Tailoring */}
        <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">3. Cultural & Religious Dietary Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Culture */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Culture / Region Cuisine
              </label>
              <select
                value={culture}
                onChange={(e) => setCulture(e.target.value)}
                className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500 text-sm"
              >
                {CULTURES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Generates culturally authentic dish names (e.g., Bengali Shorshe Maach, Assamese Tenga, Bihari Sattu/Litti).
              </p>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Religion
              </label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500 text-sm"
              >
                {RELIGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Ensures strict compliance with religious dietary laws (Halal, Sattvic, Kosher, etc.).
              </p>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Dietary Restriction Type
              </label>
              <select
                value={dietaryType}
                onChange={(e) => setDietaryType(e.target.value)}
                className="w-full bg-[#0D1117] border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500 text-sm"
              >
                {DIETARY_TYPES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Filters ingredient types (Paneer, Tofu, Chicken, Fish, Eggs, Lentils).
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Live Estimated Macro Targets Preview */}
        <div className="bg-[#161B22] border border-emerald-500/30 rounded-3xl p-6 text-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <h4 className="font-semibold text-slate-200">Your Calculated Target Nutrition Overview</h4>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              BMI: {calculated.bmi}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-[#0D1117] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Calories</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{calculated.targetCalories} <span className="text-xs text-slate-400 font-normal">kcal</span></div>
            </div>
            <div className="bg-[#0D1117] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Protein</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{calculated.proteinGrams}g</div>
            </div>
            <div className="bg-[#0D1117] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Carbohydrates</div>
              <div className="text-xl font-bold text-cyan-400 mt-1">{calculated.carbGrams}g</div>
            </div>
            <div className="bg-[#0D1117] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Fats</div>
              <div className="text-xl font-bold text-rose-400 mt-1">{calculated.fatGrams}g</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#161B22] hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all border border-slate-800"
          >
            Save Profile Only
          </button>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Generating Customized Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Customized Workout & Meal Plan</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
