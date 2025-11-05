// chat-widget.js
(function () {
  // 1. DOM element selection
  const widget = document.getElementById('hamza-chat');
  const toggle = document.getElementById('chat-toggle');
  const chatLog = document.getElementById('chat-log');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const clearBtn = document.getElementById('chat-clear');

  // Production API URL - can be overridden via window.CHAT_API_URL or URL param ?api=...
  const PRODUCTION_API_URL = 'https://port-back-pa9x.onrender.com/api/chat';
  const API_URL = (typeof window !== 'undefined' && window.CHAT_API_URL) 
    ? window.CHAT_API_URL 
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3000/api/chat'
      : PRODUCTION_API_URL;

  const STORAGE_KEY = 'hamza_chat_history_v1';

  if (!widget || !toggle || !chatLog || !input || !sendBtn) return;

  // Helper functions
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function linkifyAndFormat(text) {
    // escape first
    let safe = escapeHtml(text);
    // linkify http/https and mailto
    const urlRegex = /(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
    safe = safe.replace(urlRegex, function(u){
      // basic safety: only allow http(s) or mailto
      if (/^(https?:\/\/|mailto:)/i.test(u)) {
        return `<a href="${u}" target="_blank" rel="noopener">${u}</a>`;
      }
      return u;
    });
    // newlines to <br>
    safe = safe.replace(/\n/g, '<br>');
    return safe;
  }

  function appendMessage(who, text) {
    const msg = document.createElement('div');
    msg.className = 'message ' + (who === 'user' ? 'user' : 'bot');
    const content = linkifyAndFormat(text);
    msg.innerHTML = `<div class="bubble">${content}</div>`;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.slice(-100); // keep it light
    } catch (e) { return []; }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-100)));
    } catch (e) { /* ignore quota errors */ }
  }

  function renderHistory() {
    chatLog.innerHTML = '';
    history.forEach(m => appendMessage(m.who, m.text));
  }

  // 2. Load history
  let history = loadHistory();

  // 3. Render history
  renderHistory();

  // 4. Set up event listeners
  toggle.addEventListener('click', () => {
    const isOpen = widget.classList.toggle('chat-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      input.focus();
      // If fresh conversation, show a friendly greeting
      if (history.length === 0 && chatLog.childElementCount === 0) {
        const greet = "Hi there! I'm Hamza. How can I help today?\n\n - Learn about my skills\n - Explore recent projects\n - Get my contact details\n\nYou can ask me anything.";
        appendMessage('bot', greet);
        history.push({ who: 'bot', text: greet });
        saveHistory(history);
      }
    }
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    
    // Show user message
    appendMessage('user', text);
    history.push({ who: 'user', text });
    saveHistory(history);
    input.value = '';
    
    // Show thinking indicator
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message bot';
    thinkingMsg.innerHTML = '<div class="bubble">Thinking...</div>';
    chatLog.appendChild(thinkingMsg);
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      console.log('[chat] Using API:', API_URL);
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      // Remove thinking message
      thinkingMsg.remove();

      if (!resp.ok) {
        const bodyText = await resp.text().catch(()=>'');
        console.error('[chat] HTTP error', resp.status, bodyText);
        let errorMsg = `Sorry, I couldn't process your request.`;
        if (resp.status === 500) {
          errorMsg = 'Server error. Please try again later or check if the backend is running.';
        } else if (resp.status === 404) {
          errorMsg = 'API endpoint not found. Please check the server configuration.';
        } else if (resp.status === 503) {
          errorMsg = 'Service temporarily unavailable. Please try again in a moment.';
        }
        appendMessage('bot', errorMsg);
        return;
      }

      const data = await resp.json();
      
      if (data.reply) {
        appendMessage('bot', data.reply);
        history.push({ who: 'bot', text: String(data.reply) });
        saveHistory(history);
      } else if (data.error) {
        appendMessage('bot', `Sorry, there was an error: ${data.error}. Please try again.`);
      } else {
        appendMessage('bot', 'Sorry, something went wrong. Please try again later.');
      }
    } catch (err) {
      // Remove thinking message
      thinkingMsg.remove();
      
      console.error('[chat] Network error:', err);
      let errorMsg = 'Network error. Please check:';
      errorMsg += '\n - Is the backend server running?';
      errorMsg += '\n - Is the API URL correct?';
      errorMsg += '\n - Check browser console for CORS errors';
      appendMessage('bot', errorMsg);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      history = [];
      saveHistory(history);
      renderHistory();
    });
  }
})();
