const path = require('path');
// Load env from server/.env regardless of where node is started
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());

// Flexible CORS: allow file:// (no origin), any localhost port, optional FRONTEND_ORIGIN, or allow-all in dev
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN; // e.g., https://yourdomain.com
const CORS_ALLOW_DEV_ALL = process.env.CORS_ALLOW_DEV_ALL === '1';
const DEBUG_CORS = process.env.DEBUG_CORS === '1';

const corsOptions = {
  origin: (origin, callback) => {
    if (DEBUG_CORS) console.log('[CORS] request origin:', origin);
    // Allow no-origin (curl, file://, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all in dev mode if explicitly enabled
    if (CORS_ALLOW_DEV_ALL) return callback(null, true);
    
    // Build allow list
    const allowList = [
      FRONTEND_ORIGIN,
      'http://localhost',
      'http://127.0.0.1',
      'https://localhost' // for local HTTPS testing
    ].filter(Boolean);
    
    // Check if origin matches any allowed base
    const allowed = allowList.some(base => origin.startsWith(base));
    
    if (allowed) {
      if (DEBUG_CORS) console.log('[CORS] Allowed origin:', origin);
      return callback(null, true);
    }
    
    // Log blocked origin for debugging
    console.warn('[CORS] Blocked origin:', origin);
    console.warn('[CORS] Allowed origins:', allowList);
    console.warn('[CORS] To allow this origin, set FRONTEND_ORIGIN=' + origin.split('/')[0] + '//' + origin.split('/')[2]);
    
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const KB_PATH = path.join(__dirname, 'kb.json');
let kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));

function buildSystemPrompt() {
  return `You are the friendly portfolio assistant for Hamza. Your goal is to help visitors quickly with clear, approachable answers based on the knowledge base.\n\nSTYLE GUIDELINES (strict):\n- Be warm and concise; avoid formal tone.\n- Start with a one-sentence summary that answers the question.\n- Use short paragraphs and simple dashes for bullet points (no Markdown formatting).\n- When listing, show at most 3 bullets (top picks).\n- Include relevant direct links (full URLs) on their own line, prefixed with labels like Demo:, Repo:, Docs:, or Link:.\n- For greetings like "hi/hello/hey", reply with a short welcome plus a 3-bullet menu (skills, projects, contact).\n- End with a short next-step question to keep the conversation going.\n- If you don't know, say so honestly and suggest contacting Hamza.\n- If contact is relevant, include: Email: ${kb.meta.contact_email}  |  Telegram: ${kb.meta?.social?.telegram ?? ''}  |  WhatsApp: ${kb.meta.phone}\n\nKnowledge Base:\n${JSON.stringify(kb, null, 2)}\n\nAnswer as Hamza. Default length: ~4–8 lines unless the user asks for more. Keep it plain text (no Markdown/emojis).`;
}

// Health endpoint for quick checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mock: !process.env.OPENROUTER_API_KEY || process.env.MOCK_AI === '1' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const systemPrompt = buildSystemPrompt();

    // Basic intent detection for greetings/help
    const textLc = String(userMessage).trim().toLowerCase();
    const isGreeting = /^(hi|hello|hey|selam|salaam|salam|ciao|hola|yo|sup)\b/.test(textLc);
    const isHelp = /^(help|menu|assist|assistance|what can you do|\?)\b/.test(textLc) || textLc === 'help' || textLc === 'menu';

    // Mock mode: if no API key or explicitly enabled
    if (!process.env.OPENROUTER_API_KEY || process.env.MOCK_AI === '1') {
      if (isGreeting || isHelp) {
        const reply = `Hi there! I’m Hamza. How can I help today?

 - Learn about my skills
 - Explore recent projects
 - Get my contact details

 Contact:
 Email: ${kb.meta.contact_email}
 Telegram: ${kb.meta?.social?.telegram || ''}
 WhatsApp: ${kb.meta.phone}

 Which one would you like to see?`;
        return res.json({ reply });
      }

      const short = (text, n = 160) => (text && text.length > n ? text.slice(0, n - 1) + '…' : text || '');
      const skillGroups = kb.skills || {};
      const topBackend = (skillGroups.backend || []).slice(0, 3).join(', ');
      const topMobile = (skillGroups.mobile || []).slice(0, 2).join(', ');
      const reply = `Here’s a quick answer about “${short(userMessage, 120)}”.

 - Top strengths: ${topBackend || 'Backend development'}; ${topMobile || 'Mobile (Flutter)'}

 Contact:
 Email: ${kb.meta.contact_email}
 Telegram: ${kb.meta?.social?.telegram || ''}
 WhatsApp: ${kb.meta.phone}

 What would you like to explore next? (skills, projects, or contact)`;
      return res.json({ reply });
    }

    try {
      const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
          'X-Title': 'Hamza Portfolio Chat'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 400,
          temperature: 0.2
        })
      });

      if (!openrouterResponse.ok) {
        const txt = await openrouterResponse.text();
        let errorDetail = 'Unknown error';
        try {
          const errorData = JSON.parse(txt);
          errorDetail = errorData.error?.message || txt;
        } catch {
          errorDetail = txt;
        }
        
        console.error('[OpenRouter API Error]', openrouterResponse.status, errorDetail);
        
        // Provide user-friendly error messages
        if (openrouterResponse.status === 401) {
          return res.status(500).json({ 
            error: 'OpenRouter API key is invalid or expired. Please check your configuration.',
            reply: 'I apologize, but there\'s an authentication issue with the AI service. Please contact Hamza directly for assistance.'
          });
        } else if (openrouterResponse.status === 429) {
          // Check if it's a quota issue vs rate limit
          const isQuotaExceeded = errorDetail.toLowerCase().includes('quota') || errorDetail.toLowerCase().includes('billing');
          const reply = isQuotaExceeded 
            ? 'I apologize, but the AI service quota has been exceeded. Please contact Hamza directly for assistance, or try again later once the quota is refreshed.'
            : 'I\'m receiving too many requests right now. Please try again in a moment, or contact Hamza directly.';
          
          return res.status(500).json({ 
            error: isQuotaExceeded ? 'OpenRouter API quota exceeded' : 'OpenRouter API rate limit exceeded',
            reply: reply
          });
        } else if (openrouterResponse.status === 500) {
          return res.status(500).json({ 
            error: 'OpenRouter API server error',
            reply: 'The AI service is temporarily unavailable. Please try again later or contact Hamza directly.'
          });
        }
        
        return res.status(500).json({ 
          error: 'OpenRouter API error',
          reply: 'I encountered an issue processing your request. Please try again or contact Hamza directly.'
        });
      }

      const data = await openrouterResponse.json();
      const botReply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't create a response.";

      res.json({ reply: botReply });
    } catch (openrouterErr) {
      console.error('[OpenRouter Request Error]', openrouterErr);
      return res.status(500).json({ 
        error: 'Failed to connect to OpenRouter API',
        reply: 'I couldn\'t connect to the AI service. Please check your internet connection and try again, or contact Hamza directly.'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

// Log OpenRouter status on startup
const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY;
const isMockMode = !hasOpenRouterKey || process.env.MOCK_AI === '1';

if (isMockMode) {
  console.warn('⚠️  WARNING: Running in MOCK MODE');
  console.warn('   OpenRouter API key not found or MOCK_AI=1 is set');
  console.warn('   Chat responses will be basic and not AI-powered');
  console.warn('   To enable OpenRouter:');
  console.warn('   1. Create a .env file in the server directory');
  console.warn('   2. Add: OPENROUTER_API_KEY=your_api_key_here');
  console.warn('   3. Get your key from: https://openrouter.ai/keys');
} else {
  console.log('✅ OpenRouter API configured');
  console.log('   Using model: openai/gpt-4o-mini');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server listening on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Chat API: http://localhost:${PORT}/api/chat`);
});
