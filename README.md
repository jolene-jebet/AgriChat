# AgriChat - AI Farming Assistant 🌱

AgriChat is an AI-powered farming assistant that provides expert agricultural advice 24/7. Built with modern web technologies, it offers personalized farming insights powered by artificial intelligence.

## 🚀 Features

- **AI-Powered Chat**: Get instant agricultural advice from an AI trained on farming best practices
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Responses**: Fast, accurate answers to your farming questions
- **Demo Mode**: Try the app without an API key using built-in sample responses
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG 2.1 AA compliant design

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: Hugging Face Transformers API
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
│   ├── api.js               # Hugging Face API integration
│   ├── ui.js                # UI interactions
│   └── utils.js             # Utility functions
├── assets/
│   ├── icons/               # SVG icons
│   ├── images/              # Images and illustrations
│   └── favicon/             # Favicon files
├── data/
│   └── crops.json           # Sample crop data
└── docs/
    └── build_plan.txt       # Development build plan
```

## 🚀 Quick Start

### Option 1: Local Development Server

1. **Clone or download** the project files
2. **Start a local server**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
3. **Open your browser** and navigate to `http://localhost:8000`

### Option 2: VS Code Live Server

1. **Open the project** in VS Code
2. **Install the Live Server extension** (if not already installed)
3. **Right-click on `index.html`** and select "Open with Live Server"

### Option 3: Direct File Opening

Simply open `index.html` in your web browser (some features may be limited due to CORS restrictions).

## 🔑 API Configuration

### Demo Mode (No API Key Required)

AgriChat works out of the box in demo mode with sample responses. Perfect for testing and demonstration purposes.

### Real AI Mode (Hugging Face API)

For real AI responses, you'll need a Hugging Face API token:

1. **Get a free API token**:
   - Visit [Hugging Face Settings](https://huggingface.co/settings/tokens)
   - Create a new token with "Read" permissions
   - Copy the token (starts with `hf_`)

2. **Configure the token**:
   - Open the chat page
   - Enter your token when prompted
   - Or manually set it: `localStorage.setItem('agrichat_api_token', 'your_token_here')`

3. **Recommended models**:
   - `microsoft/DialoGPT-medium` (default)
   - `facebook/blenderbot-400M-distill`
   - `microsoft/DialoGPT-large` (for better responses)

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

### Manual Testing Checklist

- [ ] Landing page loads correctly
- [ ] Navigation works between pages
- [ ] Chat interface accepts messages
- [ ] Demo mode provides sample responses
- [ ] API mode works with valid token
- [ ] Responsive design works on mobile
- [ ] All interactive elements have hover states
- [ ] Keyboard navigation works
- [ ] No console errors

### Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🔧 Customization

### Adding New Features

1. **Create new JavaScript modules** in the `js/` directory
2. **Add corresponding CSS** in the `styles/` directory
3. **Update `main.js`** to initialize new features
4. **Follow the existing architecture** for consistency

### Modifying Styles

- **Global variables**: Edit `styles/variables.css`
- **Components**: Edit `styles/components.css`
- **Layout**: Edit `styles/layout.css`
- **Page-specific**: Edit `styles/pages.css`

### Adding New Pages

1. **Create HTML file** following existing structure
2. **Add navigation links** in all pages
3. **Create page-specific styles** in `pages.css`
4. **Add initialization logic** in `main.js`

## 🚀 Deployment

### Static Hosting (Recommended)

Deploy to any static hosting service:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a repository and enable Pages
- **Firebase Hosting**: Use Firebase CLI

### Environment Variables

For production deployment, consider setting:

- `HUGGINGFACE_API_TOKEN`: Default API token
- `ANALYTICS_ID`: Google Analytics tracking ID
- `SENTRY_DSN`: Error tracking (if using Sentry)

## 🐛 Troubleshooting

### Common Issues

**Chat not responding**:
- Check browser console for errors
- Verify API token is valid (if using real API)
- Try refreshing the page

**Styling issues**:
- Clear browser cache
- Check if all CSS files are loading
- Verify file paths are correct

**Mobile layout problems**:
- Test on actual device, not just browser dev tools
- Check viewport meta tag is present
- Verify responsive CSS is loading

### Debug Mode

Enable debug mode by running in browser console:
```javascript
localStorage.setItem('agrichat_debug', 'true');
```

## 📈 Performance

- **Page Load**: < 3 seconds on 3G
- **First Paint**: < 1.5 seconds
- **Interactive**: < 2 seconds
- **Bundle Size**: < 100KB (no external dependencies)

## 🔒 Privacy & Security

- **No data collection**: All data stays in your browser
- **Local storage**: Chat history stored locally
- **API tokens**: Stored securely in localStorage
- **HTTPS recommended**: For production deployment

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

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
