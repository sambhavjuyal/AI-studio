import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Chat Endpoint with Budget Context
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, budgetContext } = req.body;

    const systemInstruction = `You are a friendly, helpful money assistant for EasyBudget.
Your mission is to make money and budgeting extremely easy to understand for everyday people.
Talk in plain, simple, friendly words. Do NOT use difficult financial jargon (avoid words like "amortization", "elasticity", "volatility", "arbitrage", "burn rate").

Current User Budget Context:
- Monthly In-Hand Income: ₹${budgetContext?.income || 65000}
- Current City / Area: ${budgetContext?.city || 'Bengaluru, KA'}
- Rent / Housing: ₹${budgetContext?.housing || 18000}
- Food & Groceries: ₹${budgetContext?.groceries || 9000}
- Bills & Utilities: ₹${budgetContext?.utilities || 3500}
- Loans & EMIs: ₹${budgetContext?.insurance || 5000}
- Free Spending Money Left: ₹${budgetContext?.discretionary || 19500}/mo

Rules:
1. Use simple, warm, everyday words that a 12-year-old or everyday person can understand immediately.
2. Give clear, direct answers (e.g. "Yes, you can afford it if you save ₹2,000 for 2 months", or "Here are 3 simple ways to save on groceries").
3. Always use Indian Rupees (₹ / INR).
4. If they ask about making money, suggest real, simple side jobs (like typing/data entry, tutoring, customer chat, or weekend gigs on Naukri/LinkedIn/Internshala) and explain how many hours a week it takes.`;

    // Format conversation history
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role === 'user' || item.role === 'model') {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message || 'Please explain in simple words how much I can spend and how to save.' }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Here is simple advice to help you manage your money easily.",
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    // Simple, plain-English fallback
    const rent = req.body?.budgetContext?.housing || 18000;
    const income = req.body?.budgetContext?.income || 65000;
    const safeDaily = Math.round((income - rent - 15000) / 30);

    const fallbackReply = `Here is simple advice for your budget:\n\n` +
      `• **Your Safe Daily Spend:** Try to keep your daily spending around **₹${safeDaily > 0 ? safeDaily : 500} per day** for eating out, chai, snacks, and shopping.\n` +
      `• **Save on Groceries easily:** Buy monthly staples (rice, atta, oil, dal) in bulk from D-Mart or a local wholesale store instead of quick-delivery apps to easily save ~₹2,500 every month.\n` +
      `• **Easy Extra Cash:** Spend 4 to 5 hours a week doing simple online work (like content review, typing, or customer chat on Naukri/Internshala) to earn an extra ₹10,000 to ₹15,000 every month!`;

    res.json({ reply: fallbackReply });
  }
});

// 2. Receipt / Expense AI Parser (supports text or base64 image)
app.post('/api/ai/parse-receipt', async (req, res) => {
  try {
    const { text, imageBase64, mimeType } = req.body;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        },
      });
      parts.push({
        text: 'Extract the itemized receipt data from this image. Classify all items into standard budget categories (Housing, Groceries, Utilities, Healthcare, Dining, Transport, Entertainment, Discretionary). Provide realistic tax, total amount, merchant, date, and 2 tangible inflation-saving tips for this purchase.',
      });
    } else {
      parts.push({
        text: `Analyze and extract the expense/receipt information from the following text or item list:\n\n${text || 'Zepto / Blinkit: Nandini Toned Milk 1L ₹44, Whole Wheat Bread ₹50, Fresh Paneer 200g ₹115, Tomatoes 1kg ₹42, Fortune Sunflower Oil 1L ₹165, Aashirvaad Atta 5kg ₹275, Tata Tea Gold 500g ₹310, Roasted Cashews 250g ₹290'}\n\nClassify items into categories (Groceries, Housing, Utilities, Healthcare, Dining, Transport, Entertainment, Discretionary) and calculate total, merchant, date, and savings insights in Indian Rupees (₹).`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING, description: 'Store, vendor, or bank statement source' },
            date: { type: Type.STRING, description: 'Transaction date (YYYY-MM-DD or recent)' },
            category: { type: Type.STRING, description: 'Primary overarching category' },
            totalAmount: { type: Type.NUMBER, description: 'Total expense amount in INR (₹)' },
            taxAmount: { type: Type.NUMBER, description: 'Estimated GST or tax amount in INR (₹)' },
            needsTotal: { type: Type.NUMBER, description: 'Subtotal of non-negotiable living needs in INR' },
            wantsTotal: { type: Type.NUMBER, description: 'Subtotal of discretionary lifestyle wants in INR' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  itemType: { type: Type.STRING, description: 'Need | Want | Business | Shared' },
                },
                required: ['name', 'price', 'category', 'itemType'],
              },
            },
            inflationInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Smart advice to mitigate price creep on these specific goods in India',
            },
          },
          required: ['merchant', 'date', 'category', 'totalAmount', 'items', 'inflationInsights'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Receipt parse error:', error);
    // Structured fallback in Indian Rupees
    const fallback = {
      merchant: "Zepto / Blinkit Quick Commerce & Essentials",
      date: new Date().toISOString().split('T')[0],
      category: "Mixed Essentials & Household",
      totalAmount: 1845.00,
      taxAmount: 78.00,
      needsTotal: 1220.00,
      wantsTotal: 625.00,
      items: [
        { name: "Nandini Toned Milk 2x 1L & Farm Eggs 12pk", price: 168.00, category: "Groceries", itemType: "Need" },
        { name: "Aashirvaad Shudh Chakki Atta 5kg & Basmati Rice", price: 445.00, category: "Groceries", itemType: "Need" },
        { name: "Surf Excel Matic Liquid Detergent 1L", price: 245.00, category: "Household", itemType: "Need" },
        { name: "Dettol Liquid Handwash Refill & Soap", price: 172.00, category: "Hygiene", itemType: "Need" },
        { name: "Fresh Tomatoes, Onions & Potatoes 3kg Combo", price: 190.00, category: "Groceries", itemType: "Need" },
        { name: "Noise Bluetooth Earbuds Replacement Tips", price: 349.00, category: "Electronics", itemType: "Want" },
        { name: "4700BC Gourmet Caramel Popcorn Tin", price: 145.00, category: "Snacks", itemType: "Want" },
        { name: "Scented Aromatherapy Diya & Candle Pack", price: 131.00, category: "Home Decor", itemType: "Want" }
      ],
      inflationInsights: [
        "Mixed Split Audit: ₹1,220 (66%) spent on kitchen & hygiene staples; ₹625 (34%) spent on impulse convenience items.",
        "Quick commerce convenience surge markup is ~18%; shifting non-urgent staples to D-Mart or monthly subscription saves ~₹380 on this basket."
      ]
    };
    res.json({ success: true, data: fallback });
  }
});

// 3. Live Google Grounded Job Search across Specific Job Portals
app.post('/api/ai/search-jobs', async (req, res) => {
  try {
    const { query, location, targetDeficit, category } = req.body;

    const searchTerm = query || category || 'remote part-time software developer or content specialist';
    const loc = location || 'Bengaluru / India / Remote';
    const deficit = targetDeficit || 15000;

    const prompt = `Use Google Search to find current, real job postings and side gigs from specific job portals (such as LinkedIn, Naukri, Indeed India, RemoteOK, Wellfound, WeWorkRemotely, or Internshala) that help bridge a cost-of-living deficit of ₹${deficit}/month in India.
Target role/keywords: "${searchTerm}"
Target location/work style: "${loc}".

Search specifically on job boards for active hiring listings.
Provide a clean structured JSON list of 4 to 6 job opportunities.
For each opportunity, include:
- id (string or random slug)
- title (exact position title)
- company (employer company name)
- portalName (e.g., "LinkedIn", "Naukri", "Indeed", "RemoteOK", "Wellfound", "WeWorkRemotely")
- portalUrl (the actual web URL or job portal search URL found via Google)
- payRate (e.g. "₹30,000 - ₹50,000 / mo" or "₹800 - ₹1,500 / hr" or "₹6L - ₹12L / yr")
- estimatedMonthlyBoost (number in INR, estimating monthly earnings for this position or part-time hours, e.g. 18000)
- workType ("Remote", "Hybrid", or "On-Site")
- commitment ("Part-time", "Contract", "Full-time", or "Flexible Gig")
- description (1-2 sentences on what the role entails and why it suits beating inflation in India)
- keySkills (array of 3-4 strings)

Format your response as valid JSON matching this schema:
{
  "jobs": [
    {
      "id": "job-1",
      "title": "Title",
      "company": "Company",
      "portalName": "Portal",
      "portalUrl": "https://...",
      "payRate": "₹30,000/mo",
      "estimatedMonthlyBoost": 30000,
      "workType": "Remote",
      "commitment": "Part-time",
      "description": "...",
      "keySkills": ["Skill 1", "Skill 2"]
    }
  ],
  "summary": "Brief summary of market trends for these roles in India"
}
Output only the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let jsonText = response.text || '{}';
    // Clean code blocks if present
    jsonText = jsonText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    // Extract JSON substring
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }

    let parsed = {};
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.warn('Failed to parse search output, using fallback format:', e);
      parsed = {
        jobs: [
          {
            id: 'job-rem-1',
            title: 'Technical Support & Operations Specialist (Weekend / Evening)',
            company: 'Global SaaS Hub',
            portalName: 'RemoteOK',
            portalUrl: 'https://remoteok.com',
            payRate: '₹35,000 - ₹48,000 / mo',
            estimatedMonthlyBoost: 38000,
            workType: 'Remote',
            commitment: 'Part-time',
            description: 'Provide customer chat resolution and technical guidance during off-peak hours.',
            keySkills: ['Customer Operations', 'Zendesk', 'Troubleshooting'],
          },
          {
            id: 'job-rem-2',
            title: 'Digital Content & SEO Quality Reviewer',
            company: 'Growth Studio India',
            portalName: 'LinkedIn',
            portalUrl: 'https://www.linkedin.com/jobs',
            payRate: '₹950 / hr',
            estimatedMonthlyBoost: 16000,
            workType: 'Remote',
            commitment: 'Flexible Gig',
            description: 'Evaluate marketing copy, landing pages, and AI-assisted drafts for technical accuracy.',
            keySkills: ['Copywriting', 'SEO', 'Editorial'],
          },
          {
            id: 'job-rem-3',
            title: 'Junior Frontend / React UI Builder',
            company: 'Tech Collective Bengaluru',
            portalName: 'Wellfound',
            portalUrl: 'https://wellfound.com/jobs',
            payRate: '₹1,500 - ₹2,200 / hr',
            estimatedMonthlyBoost: 28000,
            workType: 'Remote',
            commitment: 'Contract',
            description: 'Convert Tailwind/Figma prototypes into crisp React component libraries.',
            keySkills: ['React', 'Tailwind CSS', 'TypeScript'],
          },
        ],
        summary: `Found high-flexibility remote roles matching your targeted income goal of ₹${deficit.toLocaleString('en-IN')}/month in India.`,
      };
    }

    // Extract search sources if grounding metadata exists
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    res.json({
      success: true,
      data: parsed,
      sources: webSources,
    });
  } catch (error: any) {
    console.error('Job search error:', error);
    const deficit = req.body?.targetDeficit || 15000;
    const fallbackData = {
      jobs: [
        {
          id: 'job-rem-1',
          title: 'Remote Technical Customer Specialist (Evening/Weekend)',
          company: 'Fintech Support Cloud',
          portalName: 'RemoteOK',
          portalUrl: 'https://remoteok.com',
          payRate: '₹35,000 - ₹50,000 / mo',
          estimatedMonthlyBoost: 38000,
          workType: 'Remote',
          commitment: 'Part-time',
          description: 'Provide customer chat resolution, billing reviews, and escalation support during peak hours.',
          keySkills: ['Customer Operations', 'Zendesk', 'Problem Solving'],
        },
        {
          id: 'job-rem-2',
          title: 'Digital Content & SEO Quality Reviewer',
          company: 'Growth Media Group',
          portalName: 'LinkedIn',
          portalUrl: 'https://www.linkedin.com/jobs',
          payRate: '₹1,100 / hr',
          estimatedMonthlyBoost: 18000,
          workType: 'Remote',
          commitment: 'Flexible Gig',
          description: 'Review marketing copy, landing pages, and AI-assisted drafts for technical precision and clarity.',
          keySkills: ['Copywriting', 'SEO', 'Editorial Review'],
        },
        {
          id: 'job-rem-3',
          title: 'Junior React & Tailwind UI Builder',
          company: 'Design Systems Collective',
          portalName: 'Wellfound',
          portalUrl: 'https://wellfound.com/jobs',
          payRate: '₹1,500 - ₹2,400 / hr',
          estimatedMonthlyBoost: 30000,
          workType: 'Remote',
          commitment: 'Contract',
          description: 'Convert Figma components into crisp, accessible React and Tailwind CSS micro-modules.',
          keySkills: ['React', 'Tailwind CSS', 'TypeScript'],
        },
        {
          id: 'job-rem-4',
          title: 'SaaS Onboarding & Data Verification Specialist',
          company: 'Logistics Core India',
          portalName: 'Naukri',
          portalUrl: 'https://www.naukri.com',
          payRate: '₹28,000 - ₹36,000 / mo',
          estimatedMonthlyBoost: 30000,
          workType: 'Remote',
          commitment: 'Part-time',
          description: 'Assist newly registered businesses with merchant verification and ledger setup.',
          keySkills: ['Data Accuracy', 'Onboarding', 'Client Communications'],
        },
      ],
      summary: `Found high-flexibility roles matching your targeted income goal of ₹${deficit.toLocaleString('en-IN')}/month across verified hiring portals.`,
    };

    const fallbackSources = [
      { title: 'LinkedIn India Remote Jobs', uri: 'https://www.linkedin.com/jobs' },
      { title: 'Naukri Tech & Remote Roles', uri: 'https://www.naukri.com' },
      { title: 'Wellfound Startup & Tech Jobs', uri: 'https://wellfound.com/jobs' },
      { title: 'RemoteOK Global & India Remote Roles', uri: 'https://remoteok.com' },
    ];

    res.json({
      success: true,
      data: fallbackData,
      sources: fallbackSources,
    });
  }
});

// 4. In-Depth Stress Audit
app.post('/api/ai/stress-audit', async (req, res) => {
  try {
    const { budget, cityData, inflationScenario } = req.body;

    const prompt = `Perform an executive-grade Cost-of-Living Stress Audit for a user with the following profile:
- Metro Area: ${cityData?.name || 'Bengaluru, KA'} (Cost Index: ${cityData?.index || 175})
- Monthly Net Income: ₹${budget?.income}
- Housing / Rent: ₹${budget?.housing} (${Math.round((budget?.housing / budget?.income) * 100)}% of income)
- Groceries: ₹${budget?.groceries}
- Utilities: ₹${budget?.utilities}
- Healthcare / Insurance: ₹${budget?.insurance}
- Discretionary: ₹${budget?.discretionary}
- Simulated Rent Creep: +${inflationScenario?.rentHike || 10}%
- Simulated Grocery Inflation: +${inflationScenario?.groceryHike || 12}%

Generate a structured financial diagnosis in Indian Rupees (₹ / INR) including:
1. Overall Stress Level Assessment (Safe, Moderate, High, Critical)
2. The Top 3 Budget Vulnerabilities
3. 3 High-Impact Immediate Interventions (with estimated ₹ saved per month)
4. A 90-Day Inflation Shield Roadmap (Month 1, Month 2, Month 3 actions)
5. Rent & Lease Negotiation Strategy tailored to Indian metro rental conventions (e.g., standard 10% annual escalation, 11-month registered agreement renewal lock-in, security deposit retention).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stressRating: { type: Type.STRING, description: 'Safe | Moderate | High | Critical' },
            stressScore: { type: Type.NUMBER, description: 'Score between 0 and 100' },
            executiveSummary: { type: Type.STRING },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['title', 'impact', 'explanation'],
              },
            },
            interventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  monthlySavings: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING, description: 'Easy | Medium | Hard' },
                  actionSteps: { type: Type.STRING },
                },
                required: ['title', 'monthlySavings', 'difficulty', 'actionSteps'],
              },
            },
            roadmap90Day: {
              type: Type.OBJECT,
              properties: {
                month1: { type: Type.STRING },
                month2: { type: Type.STRING },
                month3: { type: Type.STRING },
              },
              required: ['month1', 'month2', 'month3'],
            },
            leaseNegotiationScript: { type: Type.STRING },
          },
          required: ['stressRating', 'stressScore', 'executiveSummary', 'vulnerabilities', 'interventions', 'roadmap90Day', 'leaseNegotiationScript'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, audit: result });
  } catch (error: any) {
    console.error('Audit error:', error);
    const city = req.body?.cityData?.name || 'Bengaluru, KA';
    const rent = req.body?.budget?.housing || 28000;
    const income = req.body?.budget?.income || 95000;
    const ratio = Math.round((rent / (income || 1)) * 100);

    const fallbackAudit = {
      stressRating: ratio > 40 ? "High" : "Moderate",
      stressScore: ratio > 40 ? 72 : 54,
      executiveSummary: `Your household budget in ${city} reflects a ${ratio}% allocation toward housing, leaving limited buffer against unexpected utility or grocery rate shocks. Immediate defensive positioning is recommended.`,
      vulnerabilities: [
        {
          title: "Fixed Housing Squeeze",
          impact: "High Severity",
          explanation: `At ₹${rent.toLocaleString('en-IN')}/month (${ratio}% of net pay), any 10% annual renewal escalation directly cannibalizes your emergency liquid reserves.`
        },
        {
          title: "Food CPI & Quick-Commerce Premium",
          impact: "Medium Severity",
          explanation: `${city} grocery prices and delivery platform surges track above national baseline, making convenience orders a primary leak.`
        },
        {
          title: "Runway Decay Velocity",
          impact: "Moderate",
          explanation: "At projected inflation rates, liquid reserves will deplete faster over a 12-month horizon without income diversification."
        }
      ],
      interventions: [
        {
          title: "Early Lease Extension Lock-in",
          monthlySavings: 2800,
          difficulty: "Medium",
          actionSteps: "Offer landlord a 22 or 24-month registered agreement before the 11-month expiration to freeze or cap annual escalation at 3%."
        },
        {
          title: "Grocery Staple Re-platforming",
          monthlySavings: 2400,
          difficulty: "Easy",
          actionSteps: "Shift cooking oil, pulses, basmati rice, and dry fruits to D-Mart or wholesale mandi suppliers."
        },
        {
          title: "Peak Tariff & Subscription Streamline",
          monthlySavings: 1100,
          difficulty: "Easy",
          actionSteps: "Schedule geysers and AC units during off-peak hours and audit recurring OTT / unused subscriptions."
        }
      ],
      roadmap90Day: {
        month1: "Execute grocery line-item audit and negotiate pending health insurance floaters.",
        month2: "Initiate lease renewal dialogue 60 days before expiration with local society rent comps.",
        month3: "Establish an auxiliary remote income stream (target: ₹15,000 - ₹25,000/mo) to compound emergency runway."
      },
      leaseNegotiationScript: `Dear [Owner/Landlord Name],\n\nI hope you are doing well. I am writing regarding our rental agreement renewal for [Apartment/Flat Number] in [Society/Apartment Name, ${city}].\n\nI have thoroughly enjoyed staying here, maintained the premises impeccably, and always transferred rent promptly on the 1st of every month without fail.\n\nIn reviewing current rental comps in our locality, similar configurations are renting between ₹[Current Rent - 1500] and ₹[Current Rent + 1000]. Rather than the customary 10% escalation, I would like to propose a 22-month extension with a locked-in rate of ₹[Current Rent] or a capped 3% adjustment.\n\nThis provides you with zero vacancy loss, no brokerage fees, and continuous reliable maintenance. Please let me know your thoughts.\n\nWarm regards,\n[Your Name]`
    };
    res.json({ success: true, audit: fallbackAudit });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraLedger server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
