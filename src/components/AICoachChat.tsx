import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LoggedMealAnalysis, UserProfile } from '../types';
import { Send, Camera, Image, Sparkles, Bot, User, Flame, Check, Plus, RefreshCw, HelpCircle } from 'lucide-react';

interface AICoachChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string) => Promise<void>;
  onLogAnalyzedMeal: (analysis: LoggedMealAnalysis) => void;
  profile: UserProfile | null;
  isSending: boolean;
}

// Sample base64 or photo placeholders for instant one-click testing
const SAMPLE_MEAL_PHOTOS = [
  {
    name: 'Bengali Shorshe Maach & Rice',
    culture: 'Bengali',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    analysis: {
      foodName: 'Bengali Shorshe Maach (Mustard Fish) & Boiled Rice',
      itemsDetected: ['Rohu Fish In Mustard Gravy', 'Steamed Rice', 'Yellow Lentil Dal', 'Cucumber Salad'],
      calories: 520,
      protein: 38,
      carbs: 62,
      fats: 14,
      fiber: 6,
      healthRating: 9,
      verdict: 'Outstanding balanced meal packed with lean protein, omega-3 fatty acids, and clean complex carbs.',
      advice: 'Ideal post-workout recovery lunch for bulking or lean muscle building.'
    }
  },
  {
    name: 'Bihari Sattu Litti & Chokha',
    culture: 'Bihari',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
    analysis: {
      foodName: 'Bihari Baked Sattu Litti with Baingan Chokha',
      itemsDetected: ['Roasted Wheat Litti Stuffed with Sattu', 'Smokey Eggplant Chokha', 'Green Chili Chutney'],
      calories: 460,
      protein: 22,
      carbs: 74,
      fats: 8,
      fiber: 12,
      healthRating: 9,
      verdict: 'High-fiber, low-GI ancient superfood meal rich in plant protein and gut-healthy fiber.',
      advice: 'Great sustained energy meal for endurance or active training days.'
    }
  },
  {
    name: 'Chicken Breast & Brown Rice Bowl',
    culture: 'Fitness Standard',
    url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop&q=80',
    analysis: {
      foodName: 'Grilled Herb Chicken Breast with Brown Rice & Steamed Broccoli',
      itemsDetected: ['Skinless Chicken Breast', 'Long Grain Brown Rice', 'Steamed Broccoli Florets', 'Olive Oil Drizzle'],
      calories: 510,
      protein: 48,
      carbs: 52,
      fats: 11,
      fiber: 7,
      healthRating: 10,
      verdict: 'Classic bodybuilding gold-standard meal with maximal protein density.',
      advice: 'Perfect macro ratio for cutting or clean lean mass.'
    }
  }
];

export const AICoachChat: React.FC<AICoachChatProps> = ({
  messages,
  onSendMessage,
  onLogAnalyzedMeal,
  profile,
  isSending,
}) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || isSending) return;

    const userText = input;
    const userImg = selectedImage;
    setInput('');
    setSelectedImage(null);

    await onSendMessage(userText, userImg || undefined);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSamplePhotoSelect = (sample: typeof SAMPLE_MEAL_PHOTOS[0]) => {
    const mockAnalysis: LoggedMealAnalysis = {
      id: `sample_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      imageUrl: sample.url,
      ...sample.analysis
    };

    // Inject mock message directly
    onSendMessage(`📸 Analyzing meal photo: ${sample.name}`, undefined);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-[#161B22] border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0D1117] p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Bot className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">AuraFit AI Coach</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Personalized for {profile?.culture || 'Bengali'} Cuisine & {profile?.goal || 'Fitness Goal'}
            </p>
          </div>
        </div>

        <div className="text-xs bg-[#161B22] px-3.5 py-1.5 rounded-2xl border border-slate-800 text-slate-300 font-medium">
          Powered by Gemini AI
        </div>
      </div>

      {/* QUICK PRESET CHIPS */}
      <div className="bg-[#0D1117]/80 border-b border-slate-800 p-2.5 px-4 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-slate-400 font-semibold flex-shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ask Coach:</span>
        </span>

        {[
          `Suggest a post-workout ${profile?.culture || 'Bengali'} snack`,
          'How do I fix knee alignment during squats?',
          'What high protein meal can I eat in a Jain diet?',
          'Explain progressive overload technique'
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => onSendMessage(chip, undefined)}
            className="flex-shrink-0 bg-[#161B22] hover:bg-slate-800 text-slate-300 px-3.5 py-1.5 rounded-full border border-slate-800 transition-all text-xs font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* SAMPLE MEAL PHOTO SCANNER TILE BANNER */}
      <div className="bg-[#0D1117] p-3 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-300">Instant Meal Photo Nutrient Scanner:</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {SAMPLE_MEAL_PHOTOS.map((sample) => (
            <button
              key={sample.name}
              onClick={() => handleSamplePhotoSelect(sample)}
              className="px-3 py-1 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center space-x-1 transition-all flex-shrink-0"
            >
              <span>📸 {sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bot className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-200">Welcome to your AI Fitness Coach!</h4>
            <p className="text-xs max-w-md text-slate-400">
              Ask any fitness question, request meal substitutions tailored to your culture ({profile?.culture || 'Bengali'}), or upload a meal photo to calculate exact calories and macros.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isCoach ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                isCoach ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
              }`}>
                {isCoach ? <Bot className="w-5 h-5 stroke-[2.5]" /> : <User className="w-5 h-5 stroke-[2.5]" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-3xl p-4 text-xs sm:text-sm space-y-2 shadow-md ${
                isCoach
                  ? 'bg-[#0D1117] text-slate-100 border border-slate-800 rounded-tl-none'
                  : 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
              }`}>
                {/* Uploaded Image preview if present */}
                {msg.imageUrl && (
                  <div className="rounded-2xl overflow-hidden max-h-48 mb-2 border border-slate-700">
                    <img src={msg.imageUrl} alt="Uploaded meal" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Text Content */}
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {/* MEAL ANALYSIS RESULT CARD IF PRESENT */}
                {msg.mealAnalysis && (
                  <div className="mt-3 bg-[#161B22] border border-emerald-500/40 rounded-2xl p-4 text-slate-100 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-emerald-400 text-sm">{msg.mealAnalysis.foodName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Score: {msg.mealAnalysis.healthRating}/10
                      </span>
                    </div>

                    <div className="text-slate-300">
                      <strong>Items Detected: </strong>
                      {msg.mealAnalysis.itemsDetected?.join(', ')}
                    </div>

                    {/* Macro Breakdown Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center bg-[#0D1117] p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Calories</span>
                        <strong className="text-emerald-400 font-bold">{msg.mealAnalysis.calories} kcal</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Protein</span>
                        <strong className="text-amber-400 font-bold">{msg.mealAnalysis.protein}g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Carbs</span>
                        <strong className="text-cyan-400 font-bold">{msg.mealAnalysis.carbs}g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Fats</span>
                        <strong className="text-rose-400 font-bold">{msg.mealAnalysis.fats}g</strong>
                      </div>
                    </div>

                    <p className="text-slate-300 italic">{msg.mealAnalysis.verdict}</p>

                    <button
                      onClick={() => onLogAnalyzedMeal(msg.mealAnalysis!)}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl flex items-center justify-center space-x-1 transition-all mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Today's Macro Tracker Log</span>
                    </button>
                  </div>
                )}

                <div className={`text-[10px] ${isCoach ? 'text-slate-400' : 'text-slate-900'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>AI Coach is analyzing and typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FORM AREA */}
      <form onSubmit={handleSend} className="bg-[#0D1117] p-3.5 border-t border-slate-800 space-y-2">
        {/* Image Attachment Preview */}
        {selectedImage && (
          <div className="flex items-center justify-between bg-[#161B22] p-2.5 rounded-2xl border border-emerald-500/40 text-xs text-slate-200">
            <div className="flex items-center space-x-2">
              <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded-xl object-cover" />
              <span>Meal photo attached for nutrient analysis 📸</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-[#161B22] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center space-x-1"
            title="Upload Meal Photo for Nutrient Analysis"
          >
            <Camera className="w-5 h-5 text-emerald-400" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Coach a question or upload meal photo..."
            className="flex-1 bg-[#161B22] border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 placeholder-slate-500 font-medium"
          />

          <button
            type="submit"
            disabled={isSending || (!input.trim() && !selectedImage)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
