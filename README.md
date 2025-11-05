# Hamza Musema - Portfolio

## About Me
I'm Hamza Musema, a passionate Full Stack Developer with 5+ years of experience specializing in backend development, database management, and mobile development. I graduated with very great distinction in Computer Science and Engineering from Adama Science and Technology University.

## Skills & Expertise

### Backend Development
- **Node.js** & **Express.js** - Building robust RESTful APIs and microservices
- **Database Management** - Expert in PostgreSQL, SQL, and MongoDB
- **API Development** - RESTful APIs, authentication, and data validation

### Mobile Development
- **Flutter** & **Dart** - Cross-platform mobile application development
- **Mobile UI/UX** - Creating elegant and functional mobile interfaces

### Frontend Development
- **React.js** - Modern web application development
- **JavaScript/HTML/CSS** - Frontend technologies and responsive design

### Database Specialization
- **PostgreSQL** - Relational database design and optimization
- **MongoDB** - NoSQL database solutions
- **SQL** - Database querying and management

## Education
- **Bachelor of Computer Science and Engineering**
- **Adama Science and Technology University**
- Graduated with Very Great Distinction

## Projects
The portfolio showcases various projects including:
- Mobile applications built with Flutter
- Backend APIs using Node.js and Express
- Full-stack web applications with React
- Database-driven applications

## Contact
- **Email**: hamzamusema26@gmail.com
- **Phone**: +251940315799, +251703169491
- **LinkedIn**: [Hamza Musema](https://www.linkedin.com/in/hamza-musema-bb2b34230/)
- **GitHub**: [Hamza2679](https://github.com/Hamza2679)

## Portfolio Features
- Responsive design that works on all devices
- Modern UI with smooth animations
- Contact form with email integration
- SEO optimized
- Fast loading and performance optimized

## Technologies Used
- HTML5, CSS3, JavaScript
- Font Awesome for icons
- Google Fonts (Inter)
- EmailJS for contact form
- Responsive design principles

## Local Setup
1. Clone the repository
2. Open `index.html` directly in your browser or use a static server (e.g., VS Code Live Server)
3. The portfolio is ready to use!

### Contact Form (EmailJS)
- Configure your EmailJS public key, service ID, and template ID in `js/config.js`:
  - `EMAILJS_USER_ID`
  - `EMAILJS_SERVICE_ID`
  - `EMAILJS_TEMPLATE_ID`
- Optional: Set `EMAILJS_TO_EMAIL` if your template expects a dynamic recipient (use `{{to_email}}` in EmailJS template).

### Chat Assistant Backend
#### Enrich the knowledge base (what the chat knows about you)
The chat uses `server/kb.json` as its source of truth. To add more details about yourself (social media, skills, projects, experience, education, testimonials, FAQ), use the template file:

1) Copy the template and replace the live KB
```cmd
copy server\kb.template.json server\kb.json
```

2) Edit `server/kb.json` and fill in your information. Fields include:
- meta: owner, contact info, location, timezone, languages, availability, social links
- bio: short and long versions
- skills: grouped arrays (backend, frontend, mobile, databases, devops, cloud, other)
- experience: company/client roles, dates, impact, tech
- education: degree, institution, period, honors
- certifications: optional list with issuer, year, URL
- projects: name, category, summary, tech, links (demo/docs/repo), status, year
- testimonials: author, role, quote
- faq: common questions and answers

3) Restart the backend to reload the KB (if running locally):
```cmd
cd server
node index.js
```

The assistant will automatically incorporate the new data into responses.
This repo includes a tiny Node/Express backend under `server/` to power the chat widget.

1. Navigate to the server folder and install dependencies:
	- Windows CMD:
	  ```cmd
	  cd server
	  npm install
	  ```
2. Copy environment example to `.env` and set your OpenAI API key:
	- Create `server/.env` with `OPENAI_API_KEY=YOUR_KEY_HERE`
3. Start the server:
	- Windows CMD:
	  ```cmd
	  node index.js
	  ```
4. Ensure the chat widget points to your server by checking `API_URL` in `chat-widget.js` (defaults to `http://localhost:3000/api/chat`).

#### Quick test without an API key (Mock Mode)
If you don’t have an OpenAI key yet, you can run a mock mode that returns helpful canned replies:

```cmd
cd server
set MOCK_AI=1 && node index.js
```

Then visit:
- Health: http://localhost:3000/api/health
- Chat (example): POST http://localhost:3000/api/chat with `{ "message": "Tell me about your skills" }`

#### CORS tips (local and production)
- Local: the backend now accepts any localhost port and also allows file:// (no Origin header). If you’re using Live Server on ports like 5500/5501/5502, it will work out of the box.
- If you still hit CORS issues locally, you can force-allow all origins by starting with:

```cmd
set CORS_ALLOW_DEV_ALL=1 && node index.js
```

- Production: set `FRONTEND_ORIGIN` to your live site (e.g., `https://yourdomain.com`) so CORS is restricted appropriately.

When deployed, update `API_URL` in `chat-widget.js` to your production endpoint and update CORS origins in `server/index.js` accordingly.

### Deploy to Render (one option)
You can deploy the backend easily on Render.

Steps:
1. Push this repo to GitHub
2. In Render, create a new Web Service from the `server` folder, or include the included `server/render.yaml` by creating a Blueprint if you prefer.
3. Set environment variable `OPENAI_API_KEY`
	- Optional: `MOCK_AI=1` if you want to run without an OpenAI key
	- Recommended: set `FRONTEND_ORIGIN` to your portfolio domain once live
4. After deploy, update `API_URL` in `chat-widget.js` to the Render URL (e.g., `https://portfolio-chat-backend.onrender.com/api/chat`)
5. Add your production site origin to the CORS allowed list in `server/index.js`

## License
© 2022–2025 Hamza Musema. All rights reserved.
