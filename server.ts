import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients, type, recipeType } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const isSurprise = type === 'surprise';
    
    const prompt = `
      You are an expert Ninja Creami chef. 
      ${isSurprise 
        ? 'Generate 1 amazing, creative, and completely random Ninja Creami recipe. Ignore the provided ingredients, just surprise me with something delicious and unique.' 
        : `Generate 3 delicious Ninja Creami recipes using ONLY or PRIMARILY these ingredients: ${ingredients.join(', ')}.`
      }
      ${recipeType ? `CRITICAL INSTRUCTION: Make sure these recipes are specifically designed for the '${recipeType}' function/style.` : ''}
      
      Respond strictly in JSON format containing an array of recipe objects. Do not include markdown formatting like \`\`\`json.
      
      Schema for each recipe:
      {
        "id": "generate a unique string",
        "name": "Creative Name",
        "type": "Ice Cream | Sorbet | Gelato | Smoothie Bowl | Frozen Yogurt | Frappé | Milkshake",
        "difficulty": "Fácil | Media | Difícil",
        "time": "e.g., 5 min prep, 24h freeze",
        "ingredients": ["exact ingredient 1 with amount", "exact ingredient 2 with amount"],
        "instructions": ["step 1", "step 2"],
        "program": "The specific Ninja Creami button to press (e.g., Lite Ice Cream, Sorbet)",
        "respins": number of recommended re-spins (0-2),
        "mixins": ["optional mixin 1"] or [],
        "tips": "Pro tip for this recipe",
        "macros": {
          "calories": number,
          "protein": "e.g., 10g",
          "carbs": "e.g., 20g",
          "fats": "e.g., 5g"
        },
        "tags": ["Alto en proteína", "Vegano", "Sin azúcar", "Keto", "Bajo en calorías", "Para niños", "Fitness", "Gourmet"] (pick relevant ones)
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });

    let text = response.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }
    
    // Clean up potential markdown formatting from Gemini
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.substring(7);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
    }
    if (text.endsWith('```')) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();
    
    const recipes = JSON.parse(text);
    res.json({ recipes: Array.isArray(recipes) ? recipes : [recipes] });

  } catch (error: any) {
    console.error('Error generating recipes:', error.message || error);
    res.status(500).json({ error: 'Failed to generate recipes', details: error.message || String(error) });
  }
});

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
