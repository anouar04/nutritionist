import { GoogleGenAI, Type } from "@google/genai";
import type { HistoryData, MealHistoryItem, PlanHistoryItem, NutritionalInfo, PersonalizedPlan, UserMetrics } from '../types';

// In a real application, this data would be in a database and associated with a user.
// We are using a simple in-memory object to simulate it for this demo.
let mockDb: HistoryData = {
  meals: [],
  plans: [],
};

// IMPORTANT: The API key is sourced from an environment variable for security.
// In your hosting environment, you must configure `process.env.API_KEY` with your Google AI API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Function to simulate network delay for mock DB operations
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls the Gemini API to analyze a meal image.
 */
export const analyzeMealImage = async (base64Image: string, mimeType: string): Promise<NutritionalInfo> => {
  try {
    const imagePart = {
      inlineData: { data: base64Image, mimeType: mimeType },
    };

    const textPart = {
      text: "Analyze the nutritional content of the meal in this image. Identify all food items, estimate the total macronutrients in grams (protein, carbohydrates, fat) and total calories. Also list the most significant vitamins and minerals with their estimated amounts (e.g., '150mg'). Provide a brief, encouraging summary of the meal's healthiness. Ensure your response strictly follows the provided JSON schema.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            macros: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbohydrates: { type: Type.NUMBER },
                fat: { type: Type.NUMBER }
              },
              required: ["calories", "protein", "carbohydrates", "fat"]
            },
            vitamins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, amount: { type: Type.STRING } },
                required: ["name", "amount"]
              },
            },
            minerals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, amount: { type: Type.STRING } },
                required: ["name", "amount"]
              },
            },
            summary: { type: Type.STRING }
          },
          required: ["foodItems", "macros", "vitamins", "minerals", "summary"]
        },
      },
    });

    const analysis = JSON.parse(response.text) as NutritionalInfo;
    
    // Save the analysis to the user's history.
    const newMealItem: MealHistoryItem = {
      id: `meal-${Date.now()}`,
      timestamp: Date.now(),
      nutritionalInfo: analysis,
      imageDataUrl: `data:${mimeType};base64,${base64Image}`,
    };
    mockDb.meals.unshift(newMealItem);

    return analysis;
  } catch (error) {
    console.error("Error analyzing meal image:", error);
    throw new Error("Failed to analyze meal. The AI model may be temporarily unavailable or the API key may be invalid.");
  }
};

/**
 * Calls the Gemini API to generate a personalized plan.
 */
export const generatePersonalizedPlan = async (metrics: UserMetrics, goal: string): Promise<PersonalizedPlan> => {
  try {
    const prompt = `
      As an expert AI nutritionist and personal trainer, create a personalized plan for a user with the following details:
      - Metrics: Height ${metrics.height}, Weight ${metrics.weight}, Age ${metrics.age}, Gender ${metrics.gender}, Activity Level: ${metrics.activityLevel}.
      - Primary Goal: "${goal}"

      Generate a comprehensive 7-day meal plan (Monday to Sunday) and a 7-day workout plan (Monday to Sunday).
      - The meal plan should include breakfast, lunch, dinner, and optional snacks for each day. Meals should be healthy and align with the user's goal.
      - The workout plan should be a mix of activities suitable for their goal and activity level. Include rest days.
      - Provide a brief, motivational summary of the overall plan.
      - Ensure your response strictly follows the provided JSON schema.
    `;

    const mealSchema = {
      type: Type.OBJECT,
      properties: {
        breakfast: { type: Type.STRING },
        lunch: { type: Type.STRING },
        dinner: { type: Type.STRING },
        snacks: { type: Type.STRING },
      },
      required: ["breakfast", "lunch", "dinner"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            mealPlan: {
              type: Type.OBJECT,
              properties: {
                Monday: mealSchema, Tuesday: mealSchema, Wednesday: mealSchema, Thursday: mealSchema,
                Friday: mealSchema, Saturday: mealSchema, Sunday: mealSchema,
              },
               required: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            workoutPlan: {
              type: Type.OBJECT,
              properties: {
                Monday: { type: Type.STRING }, Tuesday: { type: Type.STRING }, Wednesday: { type: Type.STRING },
                Thursday: { type: Type.STRING }, Friday: { type: Type.STRING }, Saturday: { type: Type.STRING },
                Sunday: { type: Type.STRING },
              },
               required: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
          },
          required: ["summary", "mealPlan", "workoutPlan"]
        },
      },
    });

    const plan = JSON.parse(response.text) as PersonalizedPlan;

    const newPlanItem: PlanHistoryItem = {
      id: `plan-${Date.now()}`,
      timestamp: Date.now(),
      plan: plan,
      metrics,
      goal,
    };
    mockDb.plans.unshift(newPlanItem);

    return plan;

  } catch (error) {
    console.error("Error generating personalized plan:", error);
    throw new Error("Failed to generate a plan. The AI model may be temporarily unavailable or the API key may be invalid.");
  }
};

/**
 * Fetches the user's history from the local cache.
 */
export const getHistory = async (): Promise<HistoryData> => {
  await sleep(500);
  // Return a copy to prevent direct mutation of the mock DB
  return JSON.parse(JSON.stringify(mockDb));
};

/**
 * Clears the user's history from the local cache.
 */
export const clearHistory = async (): Promise<void> => {
  await sleep(500);
  mockDb = { meals: [], plans: [] };
};
