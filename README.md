# Hamza Musema - Portfolio Website

A modern, responsive portfolio website featuring an AI-powered chat assistant. Built with HTML, CSS, JavaScript, and a Node.js backend powered by OpenRouter AI.

## 🌐 Live Demo

- **Portfolio**: https://hamzamussema.netlify.app
- **Backend API**: https://port-back-pa9x.onrender.com
- **Health Check**: https://port-back-pa9x.onrender.com/api/health

## ✨ Features

### Portfolio Website
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Beautiful animations, smooth scrolling, and intuitive navigation
- **Animated Background** - Dynamic canvas-based background effects
- **Contact Form** - Integrated with EmailJS for seamless communication
- **SEO Optimized** - Meta tags, structured data, and semantic HTML
- **Fast Performance** - Optimized assets and efficient loading

### AI Chat Assistant 🤖
- **Intelligent Responses** - Powered by OpenRouter API (GPT-4o-mini)
- **Modern UI** - Beautiful chat widget with animations and smooth interactions
- **Knowledge Base** - Comprehensive information about skills, projects, and experience
- **Real-time Communication** - Instant responses with typing indicators
- **Conversation History** - Local storage for chat history persistence
- **Mobile Responsive** - Optimized for mobile devices

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and animations
- **JavaScript (ES6+)** - Vanilla JS for interactivity
- **Font Awesome** - Icon library
- **Google Fonts (Inter)** - Typography
- **EmailJS** - Contact form integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **OpenRouter API** - AI chat integration
- **PostgreSQL** - Database (for knowledge base)
- **CORS** - Cross-origin resource sharing

### Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend API hosting
- **GitHub** - Version control and CI/CD

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript
│   └── config.js          # EmailJS configuration
├── chat-widget.css         # Chat widget styles
├── chat-widget.js          # Chat widget functionality
├── server/
│   ├── index.js           # Express backend server
│   ├── kb.json            # Knowledge base for AI
│   ├── kb.template.json   # KB template
│   ├── render.yaml        # Render deployment config
│   └── package.json       # Backend dependencies
├── netlify.toml           # Netlify configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- OpenRouter API key (or OpenAI API key)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hamza2679/portfolio.git
   cd portfolio
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   Create `server/.env` file:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=3000
   FRONTEND_ORIGIN=http://localhost:5500
   CORS_ALLOW_DEV_ALL=0
   DEBUG_CORS=0
   MOCK_AI=0
   ```
   
   > **Note**: Get your OpenRouter API key from https://openrouter.ai/keys

4. **Start the backend server**
   ```bash
   node index.js
   # or
   npm start
   ```
   
   The server will start on `http://localhost:3000`

5. **Open the frontend**
   - Option 1: Open `index.html` directly in your browser
   - Option 2: Use VS Code Live Server extension
   - Option 3: Use any static file server

### Mock Mode (Testing without API key)

To test the chat widget without an API key:

```bash
cd server
set MOCK_AI=1
node index.js
```

This will enable mock mode with basic responses based on the knowledge base.

## 🔧 Configuration

### EmailJS Setup

1. Create an account at https://www.emailjs.com/
2. Configure your service and template
3. Update `js/config.js`:
   ```javascript
   const EMAILJS_USER_ID = 'your_user_id';
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   ```

### AI Chat Knowledge Base

The chat assistant uses `server/kb.json` as its knowledge base. Update this file with your information:

- **meta**: Contact info, social links, location
- **bio**: Short and long bio descriptions
- **skills**: Technical skills organized by category
- **experience**: Work history and achievements
- **education**: Academic background
- **projects**: Detailed project information
- **interests**: Personal interests
- **faq**: Frequently asked questions

See `server/kb.template.json` for a template structure.

After updating `kb.json`, restart the backend server to load the new data.

### Chat Widget API URL

The chat widget automatically detects the environment:
- **Localhost**: Uses `http://localhost:3000/api/chat`
- **Production**: Uses `https://port-back-pa9x.onrender.com/api/chat`

To override manually, set `window.CHAT_API_URL` before loading `chat-widget.js`:
```html
<script>
  window.CHAT_API_URL = 'https://your-custom-api.com/api/chat';
</script>
<script src="chat-widget.js"></script>
```

## 🌍 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to https://dashboard.render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Set root directory to `server`
   - Build command: `npm install`
   - Start command: `node index.js`

3. **Configure Environment Variables**
   In Render dashboard → Environment tab:
   - `OPENROUTER_API_KEY` = Your OpenRouter API key
   - `FRONTEND_ORIGIN` = Your Netlify URL (e.g., `https://hamzamussema.netlify.app`)
   - `PORT` = `3000` (optional, Render auto-assigns)
   - `MOCK_AI` = `0` (or `1` for mock mode)

4. **Verify Deployment**
   - Health check: `https://your-app.onrender.com/api/health`
   - Should return: `{"status":"ok","mock":false}`

### Frontend Deployment (Netlify)

1. **Push code to GitHub** (if not already done)

2. **Deploy on Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Build settings:
     - Build command: (leave empty - static site)
     - Publish directory: `.` (root directory)
   - Click "Deploy site"

3. **Update CORS in Render**
   - After getting your Netlify URL
   - Update `FRONTEND_ORIGIN` in Render to your Netlify URL
   - Wait for redeploy (1-2 minutes)

4. **Verify Deployment**
   - Visit your Netlify URL
   - Test the chat widget
   - Check browser console for errors

### Using Render Blueprint (Alternative)

You can also use the included `server/render.yaml`:

1. Push code to GitHub
2. In Render, create a Blueprint
3. Render will automatically configure based on `render.yaml`

## 📝 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and mock mode status.

### Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "Tell me about your skills"
}
```

Response:
```json
{
  "reply": "I specialize in full-stack development..."
}
```

## 🎨 Customization

### Changing Colors
Edit CSS variables in `chat-widget.css`:
```css
:root {
  --chat-accent: #7ed957; /* Your accent color */
  --chat-bg: rgba(17, 17, 17, 0.95);
  /* ... */
}
```

### Modifying Chat Widget
- **Styles**: `chat-widget.css`
- **Functionality**: `chat-widget.js`
- **HTML Structure**: `index.html` (search for `hamza-chat`)

### Adding Projects
Update `server/kb.json` → `projects` array with your project details.

## 🐛 Troubleshooting

### Chat Widget Not Working

1. **Check Browser Console** (F12)
   - Look for CORS errors
   - Verify API URL is correct
   - Check network requests

2. **Verify Backend is Running**
   - Check Render dashboard for service status
   - Test health endpoint
   - Check Render logs for errors

3. **Check CORS Settings**
   - Ensure `FRONTEND_ORIGIN` is set correctly in Render
   - Should match your Netlify URL exactly (no trailing slash)

4. **Verify API Key**
   - Check `OPENROUTER_API_KEY` is set in Render
   - Verify key is valid and active

### Backend Not Responding

1. **Check Render Logs**
   - Go to Render dashboard → Your service → Logs
   - Look for startup errors or API errors

2. **Verify Dependencies**
   - Ensure `package.json` has all dependencies
   - Check `node_modules` are installed

3. **Environment Variables**
   - Verify all required env vars are set
   - Check for typos in variable names

See `TROUBLESHOOTING.md` for more detailed troubleshooting guide.

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

This is a personal portfolio project. If you find any bugs or have suggestions, feel free to open an issue or submit a pull request.

## 📄 License

© 2022–2025 Hamza Musema. All rights reserved.

## 📧 Contact

- **Email**: hamzamusema26@gmail.com
- **Phone**: +251940315799
- **LinkedIn**: [Hamza Musema](https://www.linkedin.com/in/hamza-musema)
- **GitHub**: [Hamza2679](https://github.com/Hamza2679)
- **Telegram**: [@The_dreamer1](https://t.me/The_dreamer1)
- **Portfolio**: https://hamzamussema.netlify.app

## 🙏 Acknowledgments

- OpenRouter for AI API
- Netlify for hosting
- Render for backend hosting
- EmailJS for contact form integration
- Font Awesome for icons
- Google Fonts for typography

---

**Made with ❤️ by Hamza Musema**
