import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase JSON limit for base64 meal photo uploads
app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

// API Route 1: Generate Full Fitness & Meal Plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server environment' });
    }

    const prompt = `
You are an expert Certified Personal Trainer, Clinical Sports Nutritionist, and Cultural Cuisine Specialist.
Generate a complete, highly personalized 7-Day Workout Routine and 7-Day Meal Plan for a user with the following profile:

- Gender: ${profile.gender}
- Age: ${profile.age} years
- Weight: ${profile.weight} ${profile.weightUnit}
- Height: ${profile.height} ${profile.heightUnit}
- Fitness Goal: ${profile.goal} (bulking / cutting / maintenance)
- Location: ${profile.location === 'gym' ? 'Regular Gym Goer' : 'Home Workout Only'}
- Equipment Available: ${Array.isArray(profile.equipment) && profile.equipment.length > 0 ? profile.equipment.join(', ') : 'Bodyweight only'}
- Cultural Cuisine Preference: ${profile.culture} (e.g. Bengali, Assamese, Bihari, North Indian, South Indian, etc.)
- Religious & Dietary Restrictions: ${profile.religion} / ${profile.dietaryType} (e.g. Hindu Sattvic/Veg, Muslim Halal, Jain no-root veg, Vegan, Eggitarian, etc.)

CRITICAL GUIDELINES:
1. MEAL PLAN: Must strictly match the requested Cultural cuisine (${profile.culture}) and Religious dietary preference (${profile.religion} / ${profile.dietaryType}).
   - If Bengali: include authentic options like Shorshe Maach, Musur Dal, Chira Doi, Muri with Chana, Dimer Jhol, Chanar Dalna, etc.
   - If Bihari: include Sattu protein drink, Litti Chokha, Dehati Chicken, Makhana, Dal Pitthi, etc.
   - If Assamese: include Masor Tenga, Mati Mahor Dal, Pitika, Jolpan, etc.
   - If Jain: NO root vegetables (onions, garlic, potatoes).
   - If Muslim: Strictly Halal meat/chicken options.
   - Calculate exact accurate calories, protein (g), carbs (g), fats (g), and fiber (g) per meal appropriate for their goal (${profile.goal}).

2. WORKOUT PLAN: 7 days (including rest/active recovery days).
   - Tailored specifically to whether they go to Gym or Home, and their available equipment (${profile.equipment?.join(', ')}).
   - For every exercise, include:
     * exercise name
     * targetMuscle (e.g., Chest, Lats, Quads, Biceps, Core, Deltoids)
     * why (Detailed scientific explanation of why to do this exercise and its physiological benefits)
     * sets (number, e.g. 3 or 4)
     * reps (string, e.g. "8-12" or "12-15" or "45 sec")
     * restSeconds (number)
     * formTips (array of 2-3 actionable form technique tips)
     * visualKey (choose closest from: "bench_press", "push_ups", "squats", "deadlifts", "pull_ups", "dumbbell_rows", "shoulder_press", "bicep_curls", "planks", "lunges")

Return valid JSON with two main top-level keys: "weeklyWorkouts" (array of 7 day workout objects) and "weeklyMeals" (array of 7 day meal objects).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklyWorkouts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING },
                  title: { type: Type.STRING },
                  targetArea: { type: Type.STRING },
                  isRestDay: { type: Type.BOOLEAN },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        targetMuscle: { type: Type.STRING },
                        why: { type: Type.STRING },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.STRING },
                        restSeconds: { type: Type.INTEGER },
                        formTips: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        visualKey: { type: Type.STRING }
                      },
                      required: ['id', 'name', 'targetMuscle', 'why', 'sets', 'reps', 'restSeconds', 'formTips', 'visualKey']
                    }
                  }
                },
                required: ['dayNumber', 'dayName', 'title', 'targetArea', 'exercises']
              }
            },
            weeklyMeals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING },
                  totalCalories: { type: Type.INTEGER },
                  totalProtein: { type: Type.INTEGER },
                  totalCarbs: { type: Type.INTEGER },
                  totalFats: { type: Type.INTEGER },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        mealType: { type: Type.STRING },
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        calories: { type: Type.INTEGER },
                        protein: { type: Type.INTEGER },
                        carbs: { type: Type.INTEGER },
                        fats: { type: Type.INTEGER },
                        fiber: { type: Type.INTEGER }
                      },
                      required: ['id', 'mealType', 'name', 'description', 'calories', 'protein', 'carbs', 'fats', 'fiber']
                    }
                  }
                },
                required: ['dayNumber', 'dayName', 'meals', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFats']
              }
            }
          },
          required: ['weeklyWorkouts', 'weeklyMeals']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return res.json(data);
  } catch (error: any) {
    console.error('Error generating fitness plan:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate plan' });
  }
});

// API Route 2: AI Coach Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, profile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    const systemInstruction = `
You are "AuraFit Coach", an elite, empathetic, scientifically grounded AI Personal Fitness Coach and Sports Nutritionist.
User's Profile Context:
- Gender: ${profile?.gender || 'N/A'}, Age: ${profile?.age || 'N/A'}
- Goal: ${profile?.goal || 'General Fitness'} (${profile?.weight || ''} ${profile?.weightUnit || ''})
- Routine: ${profile?.location === 'gym' ? 'Gym regularly' : 'Home workout'}
- Culture: ${profile?.culture || 'General'}, Religion/Diet: ${profile?.religion || 'General'} / ${profile?.dietaryType || 'General'}

Instructions:
1. Provide encouraging, expert advice regarding workout form, recovery, muscle targeting, weight plateaus, and regional cultural meal alternatives (Bengali, Assamese, Bihari, Indian, Western, etc.).
2. Keep responses concise, clear, structured with bullet points or key takeaways.
3. If user asks to substitute a meal or exercise, suggest specific alternatives that match their goal and culture!
`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Send the last message
    const lastUserMessage = messages[messages.length - 1]?.text || 'Hello coach!';
    const response = await chat.sendMessage({ message: lastUserMessage });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in AI Coach Chat:', error);
    return res.status(500).json({ error: error?.message || 'Chat failed' });
  }
});

// API Route 3: Multimodal Meal Photo Nutrient Analyzer
app.post('/api/analyze-meal', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', profile } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 photo data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    // Clean up base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64
      }
    };

    const textPrompt = `
Analyze this meal photo in detail as a sports nutritionist.
Identify all visible food items and dishes (including cultural Indian/Bengali/Bihari/Assamese/Global items if present).

Context:
User Goal: ${profile?.goal || 'maintenance'}
User Culture & Diet: ${profile?.culture || 'General'}, ${profile?.dietaryType || 'General'}

Provide:
1. A concise single food title/name for this meal.
2. An array of identified food items detected in the image.
3. Estimated total Calories.
4. Estimated Protein in grams.
5. Estimated Carbohydrates in grams.
6. Estimated Fats in grams.
7. Estimated Fiber in grams.
8. Health Rating out of 10.
9. A 1-sentence Verdict (e.g. "Excellent high-protein post-workout meal with clean complex carbs.").
10. Actionable fitness Advice specific to their goal (${profile?.goal || 'maintenance'}).

Return strictly JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [imagePart, { text: textPrompt }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            itemsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            calories: { type: Type.INTEGER },
            protein: { type: Type.INTEGER },
            carbs: { type: Type.INTEGER },
            fats: { type: Type.INTEGER },
            fiber: { type: Type.INTEGER },
            healthRating: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ['foodName', 'itemsDetected', 'calories', 'protein', 'carbs', 'fats', 'fiber', 'healthRating', 'verdict', 'advice']
        }
      }
    });

    const analysis = JSON.parse(response.text || '{}');
    return res.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing meal image:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze meal image' });
  }
});

// API Route 4: Custom Food Macro Calculator
app.post('/api/calculate-custom-meal', async (req, res) => {
  try {
    const { foodName, mealType = 'Custom Snack', portion = '1 serving', profile } = req.body;
    if (!foodName) {
      return res.status(400).json({ error: 'foodName is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const approxCal = 320;
      return res.json({
        id: `custom_${Date.now()}`,
        name: foodName,
        mealType: mealType,
        description: `Custom logged food item (${portion}). Estimated nutritional profile.`,
        calories: approxCal,
        protein: 16,
        carbs: 45,
        fats: 9,
        fiber: 4,
        isCustom: true
      });
    }

    const prompt = `
You are an expert Clinical Sports Nutritionist and Macro Specialist.
Calculate the precise nutritional breakdown for this custom eaten food/dish:
- Food Name / Item: "${foodName}"
- Portion / Quantity: "${portion}"
- Meal Category: "${mealType}"
- User Culture Context: ${profile?.culture || 'General'}
- User Dietary Goal: ${profile?.goal || 'General Fitness'}

Provide an accurate, realistic nutritional calculation for calories, protein (g), carbs (g), fats (g), and fiber (g).

Return strictly JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            mealType: { type: Type.STRING },
            description: { type: Type.STRING },
            calories: { type: Type.INTEGER },
            protein: { type: Type.INTEGER },
            carbs: { type: Type.INTEGER },
            fats: { type: Type.INTEGER },
            fiber: { type: Type.INTEGER },
            isCustom: { type: Type.BOOLEAN }
          },
          required: ['name', 'mealType', 'description', 'calories', 'protein', 'carbs', 'fats', 'fiber']
        }
      }
    });

    const calculatedMeal = JSON.parse(response.text || '{}');
    if (!calculatedMeal.id) calculatedMeal.id = `custom_${Date.now()}`;
    calculatedMeal.isCustom = true;

    return res.json(calculatedMeal);
  } catch (error: any) {
    console.error('Error calculating custom meal:', error);
    const approxCal = 300;
    return res.json({
      id: `custom_${Date.now()}`,
      name: req.body.foodName || 'Custom Dish',
      mealType: req.body.mealType || 'Custom Snack',
      description: `Custom logged dish. Estimated macro profile.`,
      calories: approxCal,
      protein: 15,
      carbs: 40,
      fats: 9,
      fiber: 4,
      isCustom: true
    });
  }
});

// Export app for serverless platforms like Vercel
export default app;
export { app };

// Configure Vite middleware or Static Server for local/container dev & production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Fitness Coach server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the standalone listener if not running in Vercel serverless environment
if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
  startServer();
}

