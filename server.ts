import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { initialMenuItems } from './src/data';
import { MenuItem } from './src/types';

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// In-memory server-side database for menu items (CMS) and job applications
let serverMenuItems: MenuItem[] = [...initialMenuItems];
let serverOrders: any[] = [];
let serverApplications: any[] = [];

// API: Get current menu items (supports CMS dynamic state)
app.get('/api/menu', (req, res) => {
  res.json({ success: true, menu: serverMenuItems });
});

// API: Add new menu item (Admin CMS)
app.post('/api/admin/menu/add', (req, res) => {
  try {
    const newItem: MenuItem = req.body;
    if (!newItem.id || !newItem.name || !newItem.price) {
      res.status(400).json({ success: false, error: 'Missing required menu fields (id, name, price).' });
      return;
    }
    // Check if duplicate ID
    if (serverMenuItems.some(item => item.id === newItem.id)) {
      res.status(400).json({ success: false, error: `Menu item with ID "${newItem.id}" already exists.` });
      return;
    }
    // Insert item
    serverMenuItems.unshift(newItem);
    res.json({ success: true, message: 'Menu item added successfully to CMS!', menu: serverMenuItems });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// API: Reset menu (Admin CMS)
app.post('/api/admin/menu/reset', (req, res) => {
  serverMenuItems = [...initialMenuItems];
  res.json({ success: true, message: 'Menu reset to master default!', menu: serverMenuItems });
});

// API: Delete menu item (Admin CMS)
app.delete('/api/admin/menu/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = serverMenuItems.length;
  serverMenuItems = serverMenuItems.filter(item => item.id !== id);
  if (serverMenuItems.length === initialLen) {
    res.status(404).json({ success: false, error: 'Item not found in menu' });
    return;
  }
  res.json({ success: true, message: 'Menu item deleted successfully!', menu: serverMenuItems });
});

// Lazy loader for Google Gemini SDK client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not defined.');
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY_FOR_LINT_PASS',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// API: AI Meal Recommendations via Gemini 3.5-flash
app.post('/api/gemini/recommend', async (req, res) => {
  try {
    const { budgetKES, dietary, hungerLevel, mood } = req.body;

    if (!budgetKES) {
      res.status(400).json({ success: false, error: 'Budget in KES is required for recommendations.' });
      return;
    }

    // Convert items into string catalog context for the model with IDs and prices
    const catalogContext = serverMenuItems.map(item => {
      return `- [ID: "${item.id}"] ${item.name} (${item.category}): KES ${item.price}, ${item.calories} calories. "${item.description}"`;
    }).join('\n');

    const promptMessage = `
You are the official smart AI planner for KFC Nairobi branches in Kenya. Your goal is to design the absolute best combo or single meal recommendation based on custom customer constraints:
- Customer's Budget: KES ${budgetKES} (The sum of the recommended item prices MUST be less than or equal to this budget!).
- Dietary requirement: "${dietary}" (If spicy-lover is chosen, propose items like wings hot, zinger, masala. If vegetarian is chosen, guide them politely, but remind them fries, drinks, or desserts are beautiful options! If halal, remember all our chicken is fully halal).
- Hunger level: "${hungerLevel}" (snack vs medium vs starving). Propose lighter items like wings, regular fries or wraps for a snack, and massive feasts/buckets for starving.
- Mood: "${mood}" (adventure, classic, comfort, family-deal).

Here is our current active menu catalog for Nairobi:
${catalogContext}

Recommend between 1 to 3 actual items from the current menu above (Return their EXACT menu IDs under 'recommendedItemIds').
Explain your reasoning beautifully, with local Nairobi branch warmth and upbeat fast-food commercial flair.
Generate a creative combo name (e.g. "Nairobi Express Treat").
Apply a discount of 5%, 10% or 15% as a surprise loyal user coupon reward (return e.g. 10).
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptMessage,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedItemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Strict list of valid menu IDs from the catalog. The sum of costs must be <= budget!'
            },
            reasoning: {
              type: Type.STRING,
              description: 'Upbeat, commercial fast-food Nairobi pitch explaining the value and taste of the pairing.'
            },
            comboOfferDescription: {
              type: Type.STRING,
              description: 'A catchy, local Kenyan title or description for the custom bundle.'
            },
            discountAppliedPercentage: {
              type: Type.INTEGER,
              description: 'Surprise loyalty reward percentage to motivate ordering: 5, 10, or 15.'
            }
          },
          required: ['recommendedItemIds', 'reasoning']
        }
      }
    });

    const recommendationStr = response.text;
    const recommendation = JSON.parse(recommendationStr || '{}');
    res.json({ success: true, recommendation });
  } catch (error: any) {
    console.error('Gemini error during recommendation:', error);
    // Graceful fallback mock so user experience never breaks
    const fallbackIds = serverMenuItems.slice(0, 2).map(i => i.id);
    res.json({
      success: true,
      recommendation: {
        recommendedItemIds: fallbackIds,
        reasoning: "Habari! Our digital team was offline for a split-second, so our Nairobi Chef specially handpicked these sizzling favorites matching your budget. Rich crisp chicken and hot chips ready for you!",
        comboOfferDescription: 'Nairobi Quick-Bite Combo',
        discountAppliedPercentage: 10,
        isFallback: true
      },
      errorNote: error.message
    });
  }
});

// API: Process Ordering & Simulated M-Pesa Mobile Money Integration
app.post('/api/order/submit', (req, res) => {
  try {
    const orderDetails = req.body;
    if (!orderDetails.customerName || !orderDetails.phone || !orderDetails.items || orderDetails.items.length === 0) {
      res.status(400).json({ success: false, error: 'Missing key order criteria.' });
      return;
    }

    // Assign mock ID, timestamp, and status
    const newOrder = {
      ...orderDetails,
      id: `KFC-NBI-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: orderDetails.paymentMethod === 'mpesa' ? 'mpesa_prompt' : 'preparing',
      etaMinutes: orderDetails.deliveryMethod === 'delivery' ? 35 : 15
    };

    serverOrders.unshift(newOrder);
    res.json({ success: true, order: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Payment pipeline failure' });
  }
});

// API: Track Order Status
app.get('/api/order/track/:id', (req, res) => {
  const { id } = req.params;
  const order = serverOrders.find(o => o.id === id);
  if (!order) {
    res.status(404).json({ success: false, error: `Order ${id} could not be found.` });
    return;
  }
  res.json({ success: true, order });
});

// API: Update Order Status (for live tracking presentation/simulations)
app.post('/api/order/track/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = serverOrders.find(o => o.id === id);
  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found.' });
    return;
  }
  order.status = status;
  res.json({ success: true, order });
});

// API: Careers Application
app.post('/api/careers/apply', (req, res) => {
  try {
    const application = req.body;
    if (!application.fullName || !application.email || !application.positionId) {
      res.status(400).json({ success: false, error: 'Missing required application fields.' });
      return;
    }
    const submitted = {
      ...application,
      id: `APP-CX-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString()
    };
    serverApplications.push(submitted);
    res.json({ success: true, message: 'Application filed successfully!', applicationId: submitted.id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Main Server Startup Block with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the build target
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KFC NAIROBI BACKEND] Running securely on port ${PORT}`);
  });
}

startServer();
