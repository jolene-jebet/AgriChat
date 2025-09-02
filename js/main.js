/**
 * Main Application Entry Point for AgriChat
 * Initializes the application and coordinates between different modules
 */

class AgriChatApp {
  constructor() {
    this.apiManager = null;
    this.chatManager = null;
    this.uiManager = null;
    this.isInitialized = false;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🌱 Initializing AgriChat...');
      
      // Show loading overlay
      this.showLoadingOverlay('Initializing AgriChat...');
      
      // Initialize core components
      await this.initializeComponents();
      
      // Initialize page-specific functionality
      this.initializePageFeatures();
      
      // Set up global error handling
      this.setupErrorHandling();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('✅ AgriChat initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize AgriChat:', error);
      this.handleInitializationError(error);
    } finally {
      this.hideLoadingOverlay();
    }
  }

  /**
   * Initialize core components
   */
  async initializeComponents() {
    // Initialize API Manager with hardcoded API key
    this.apiManager = window.AgriChatAPI;
    
    // REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY
    const API_KEY = 'AIzaSyD2m7CM-fKAuIVY5dckykAUGNhte5h8tzU';
    
    // You can also check if there's a saved token, but use the hardcoded one as default
    const savedToken = AgriChatUtils.Storage.get('agrichat_api_token');
    const apiKey = savedToken || API_KEY;
    
    this.apiManager.initialize(apiKey);
    
    // Store the API key for future use (optional)
    if (!savedToken) {
      AgriChatUtils.Storage.set('agrichat_api_token', API_KEY);
    }
    
    // Initialize UI Manager
    this.uiManager = new UIManager();
    this.uiManager.initializeAll();
    
    // Initialize Chat Manager (only on chat page)
    if (window.location.pathname.includes('chat.html')) {
      this.chatManager = new ChatManager(this.apiManager);
    }
  }

  /**
   * Initialize page-specific features
   */
  initializePageFeatures() {
    const currentPage = this.getCurrentPage();
    
    switch (currentPage) {
      case 'index':
        this.initializeLandingPage();
        break;
      case 'chat':
        this.initializeChatPage();
        break;
      case 'about':
        this.initializeAboutPage();
        break;
      default:
        console.log('Unknown page, using default initialization');
    }
  }

  /**
   * Initialize landing page features
   */
  initializeLandingPage() {
    console.log('Initializing landing page features...');
    
    // Add scroll animations
    this.initScrollAnimations();
    
    // Add feature card interactions
    this.initFeatureCards();
    
    // Add CTA button tracking
    this.initCTATracking();
  }

  /**
   * Initialize chat page features
   */
  initializeChatPage() {
    console.log('Initializing chat page features...');
    
    // Chat manager is already initialized in initializeComponents
    if (this.chatManager) {
      console.log('Chat manager ready');
    }
    
    // Initialize chat sidebar
    if (window.ChatSidebar) {
      this.chatSidebar = new ChatSidebar();
      console.log('Chat sidebar initialized');
    }
    
    // Add keyboard shortcuts info
    this.showKeyboardShortcuts();
  }

  /**
   * Initialize about page features
   */
  initializeAboutPage() {
    console.log('Initializing about page features...');
    
    // Add scroll animations
    this.initScrollAnimations();
    
    // Add team member interactions
    this.initTeamCards();
  }

  /**
   * Get current page name
   */
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('chat.html')) return 'chat';
    if (path.includes('about.html')) return 'about';
    return 'index';
  }

  /**
   * Initialize scroll animations
   */
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animatedElements = $$('.feature-card, .card, .team-member');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  /**
   * Initialize feature card interactions
   */
  initFeatureCards() {
    const featureCards = $$('.feature-card');
    
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  /**
   * Initialize CTA button tracking
   */
  initCTATracking() {
    const ctaButtons = $$('a[href*="chat.html"]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('CTA clicked:', button.textContent.trim());
        // Here you could add analytics tracking
      });
    });
  }

  /**
   * Initialize team card interactions
   */
  initTeamCards() {
    const teamCards = $$('.team-member');
    
    teamCards.forEach(card => {
      card.addEventListener('click', () => {
        const name = card.querySelector('.team-name')?.textContent;
        if (name) {
          AgriChatUtils.NotificationUtils.info(`Learn more about ${name}`);
        }
      });
    });
  }

  /**
   * Show keyboard shortcuts info
   */
  showKeyboardShortcuts() {
    // Add keyboard shortcuts info to chat page
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'keyboard-shortcuts';
    shortcutsInfo.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--dark-ink);
        color: var(--pure-white);
        padding: 12px;
        border-radius: 8px;
        font-size: 12px;
        opacity: 0.8;
        z-index: 1000;
        max-width: 200px;
      ">
        <strong>Keyboard Shortcuts:</strong><br>
        <kbd>Ctrl/Cmd + K</kbd> - Focus chat<br>
        <kbd>Enter</kbd> - Send message<br>
        <kbd>Shift + Enter</kbd> - New line
      </div>
    `;
    
    document.body.appendChild(shortcutsInfo);
    
    // Hide after 5 seconds
    setTimeout(() => {
      AgriChatUtils.AnimationUtils.fadeOut(shortcutsInfo, 1000);
    }, 5000);
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      AgriChatUtils.ErrorUtils.logError(event.reason, 'unhandledrejection');
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      AgriChatUtils.ErrorUtils.logError(event.error, 'global');
    });
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    const errorMessage = 'Failed to initialize AgriChat. Please refresh the page.';
    
    // Show error notification
    AgriChatUtils.NotificationUtils.error(errorMessage);
    
    // Log error
    AgriChatUtils.ErrorUtils.logError(error, 'initialization');
    
    // Show fallback UI
    this.showFallbackUI();
  }

  /**
   * Show fallback UI when initialization fails
   */
  showFallbackUI() {
    const fallbackHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--pure-white);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        text-align: center;
        z-index: 10000;
      ">
        <h2 style="color: var(--error); margin-bottom: 1rem;">⚠️ Initialization Error</h2>
        <p style="margin-bottom: 1.5rem;">AgriChat failed to load properly. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          Refresh Page
        </button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', fallbackHTML);
  }

  /**
   * Show loading overlay
   */
  showLoadingOverlay(message = 'Loading...') {
    if (this.uiManager) {
      this.uiManager.showLoadingOverlay(message);
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoadingOverlay() {
    if (this.uiManager) {
      this.uiManager.hideLoadingOverlay();
    }
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      currentPage: this.getCurrentPage(),
      apiStatus: this.apiManager ? this.apiManager.getStatus() : null,
      chatStats: this.chatManager ? this.chatManager.getStats() : null
    };
  }

  /**
   * Public API for external access
   */
  getAPI() {
    return this.apiManager;
  }

  getChat() {
    return this.chatManager;
  }

  getUI() {
    return this.uiManager;
  }
}

// Initialize the application
window.AgriChat = new AgriChatApp();

// Make it globally accessible
window.AgriChatApp = AgriChatApp;

// Add some global utility functions
window.AgriChatUtils = window.AgriChatUtils || {};

// Global function to get app status (useful for debugging)
window.getAgriChatStatus = () => {
  return window.AgriChat ? window.AgriChat.getStatus() : { error: 'App not initialized' };
};

// Global function to clear all data (useful for testing)
window.clearAgriChatData = () => {
  if (window.AgriChat && window.AgriChat.getChat()) {
    window.AgriChat.getChat().clearChatHistory();
  }
  AgriChatUtils.Storage.remove('agrichat_api_token');
  AgriChatUtils.Storage.remove('agrichat_seen_api_modal');
  AgriChatUtils.Storage.remove('agrichat_theme');
  console.log('All AgriChat data cleared');
};

// Console welcome message
console.log(`
🌱 Welcome to AgriChat!
=====================
Your AI-powered farming assistant is ready.

Available commands:
- getAgriChatStatus() - Get app status
- clearAgriChatData() - Clear all stored data

For support, visit: https://github.com/jolene-jebet/AgriChat.git
`);

// Performance monitoring
if (window.performance && window.performance.mark) {
  window.performance.mark('agrichat-init-start');
  
  window.addEventListener('load', () => {
    window.performance.mark('agrichat-init-end');
    window.performance.measure('agrichat-init', 'agrichat-init-start', 'agrichat-init-end');
    
    const measure = window.performance.getEntriesByName('agrichat-init')[0];
    console.log(`🚀 AgriChat loaded in ${measure.duration.toFixed(2)}ms`);
  });
}