# AgriChat - AI Farming Assistant 🌱

AgriChat is an AI-powered farming assistant that provides expert agricultural advice 24/7. Built with modern web technologies, it offers personalized farming insights powered by artificial intelligence.

## 🚀 Features

- **AI-Powered Chat**: Get instant agricultural advice from an AI trained on farming best practices
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Responses**: Fast, accurate answers to your farming questions
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG 2.1 AA compliant design

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: Gemini Flash 2.0 API key
- **Design**: Custom CSS with CSS Grid and Flexbox
- **Fonts**: Figtree (Google Fonts)
- **Icons**: Emoji-based icons for universal compatibility

## 📁 Project Structure

```
agrichat/
├── index.html                 # Landing page
├── chat.html                 # Main chat interface
├── about.html                # About page
├── styles/
│   ├── reset.css             # CSS reset/normalize
│   ├── variables.css         # CSS custom properties
│   ├── components.css        # Reusable components
│   ├── layout.css           # Layout utilities
│   └── pages.css            # Page-specific styles
├── js/
│   ├── main.js              # Core application logic
│   ├── chat.js              # Chat functionality
│   ├── api.js               # Gemini 2.0 API integration
│   ├── ui.js                # UI interactions
│   └── utils.js             # Utility functions
├── assets/
│   ├── icons/               # SVG icons
│   ├── images/              # Images and illustrations
│   └── favicon/             # Favicon files
├── data/
│   └── crops.json           # Sample crop data
└── docs-prompts/
    └── build_plan.txt       # Development build plan of the front end
    └── mysql_intergration_instructions.txt       # Development build plan of the backend
```

## 🚀 Quick Start

Installation

Clone the repository:
```
bash
```
```
git clone https://github.com/jolene-jebet/AgriChat.git
```
```
cd agrichat
```

Install dependencies:
```
bash
```
```
npm install
```

Set up the database:
```
bash# Create database
```
```
mysql -u root -p
````
```
CREATE DATABASE agrichat;
```

# Import schema
```
mysql -u root -p agrichat < database/schema.sql
```

Configure environment variables:
```
bash
```
```
cp .env.example .env
```
# Edit .env with your configuration

Start the server:
```
bash# Development mode
```
```
npm run dev
```

# Production mode
npm start

Access the application:
Open your browser and navigate to
```
http://localhost:3000
```


---

**Made with 🌱 for farmers worldwide**

*AgriChat - Your AI Farming Assistant*
