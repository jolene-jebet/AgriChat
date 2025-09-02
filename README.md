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
bashgit clone <repository-url>
cd agrichat

Install dependencies:
bashnpm install

Set up the database:
bash# Create database
mysql -u root -p
CREATE DATABASE agrichat;

# Import schema
mysql -u root -p agrichat < database/schema.sql

Configure environment variables:
bashcp .env.example .env
# Edit .env with your configuration

Start the server:
bash# Development mode
npm run dev

# Production mode
npm start

Access the application:
Open your browser and navigate to http://localhost:3000


## 🎨 Design System

### Color Palette

```css
--primary-green: #96b43a    /* Primary brand color */
--dark-ink: #313131         /* Text and dark elements */
--soft-mist: #E1EBE2        /* Light accent */
--paper-white: #fdfdfd      /* Background */
--pure-white: #ffffff       /* Cards and highlights */
```

### Typography

- **Font Family**: Figtree (Google Fonts)
- **Scale**: 12px to 48px with consistent ratios
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **Scale**: 4px to 96px with consistent 4px increments
- **Components**: Consistent padding and margins
- **Responsive**: Adapts to different screen sizes

## 📱 Responsive Design

AgriChat is built mobile-first and works on all devices:

- **Mobile**: 320px and up
- **Tablet**: 768px and up  
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## 🧪 Testing

### Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check this README and inline code comments
- **Community**: Join our discussions for help and ideas

## 🎯 Roadmap

- [ ] Voice input/output
- [ ] Image recognition for plant diseases
- [ ] Weather integration
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Progressive Web App (PWA)
- [ ] Advanced analytics
- [ ] Integration with IoT devices

---

**Made with 🌱 for farmers worldwide**

*AgriChat - Your AI Farming Assistant*
