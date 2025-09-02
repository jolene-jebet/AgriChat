/**
 * UI Management for AgriChat
 * Handles user interface interactions, modals, and visual feedback
 */

class UIManager {
  constructor() {
    this.apiModal = null;
    this.loadingOverlay = null;
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize UI components
   */
  init() {
    this.apiModal = $('#apiModal');
    this.loadingOverlay = $('#loadingOverlay');
    
    this.bindEvents();
    // Remove the API configuration check
    // this.checkApiConfiguration();
    this.isInitialized = true;
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // API Modal events - keeping for potential future use but won't show automatically
    const saveApiTokenBtn = $('#saveApiToken');
    const skipApiTokenBtn = $('#skipApiToken');
    const apiTokenInput = $('#apiToken');

    if (saveApiTokenBtn) {
      saveApiTokenBtn.addEventListener('click', () => this.handleSaveApiToken());
    }

    if (skipApiTokenBtn) {
      skipApiTokenBtn.addEventListener('click', () => this.handleSkipApiToken());
    }

    if (apiTokenInput) {
      apiTokenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSaveApiToken();
        }
      });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = $$('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });

    // Mobile menu toggle (if needed)
    this.initMobileMenu();

    // Theme toggle (if implemented)
    this.initThemeToggle();
  }

  /**
   * REMOVED: checkApiConfiguration method
   * The modal will no longer show automatically
   */

  /**
   * Show API configuration modal (only if manually called)
   */
  showApiModal() {
    if (!this.apiModal) return;
    
    this.apiModal.classList.remove('hidden');
    this.apiModal.style.display = 'flex';
    
    // Focus on input
    const apiTokenInput = $('#apiToken');
    if (apiTokenInput) {
      setTimeout(() => apiTokenInput.focus(), 100);
    }
    
    // Mark as seen
    AgriChatUtils.Storage.set('agrichat_seen_api_modal', true);
  }

  /**
   * Hide API configuration modal
   */
  hideApiModal() {
    if (!this.apiModal) return;
    
    AgriChatUtils.AnimationUtils.fadeOut(this.apiModal, 300);
  }

  /**
   * Handle save API token
   */
  handleSaveApiToken() {
    const apiTokenInput = $('#apiToken');
    if (!apiTokenInput) return;
    
    const token = apiTokenInput.value.trim();
    
    if (token && AgriChatUtils.ValidationUtils.isValidApiToken(token)) {
      AgriChatUtils.Storage.set('agrichat_api_token', token);
      AgriChatUtils.NotificationUtils.success('API token saved successfully!');
      
      // Reinitialize API with new token
      if (window.AgriChatAPI) {
        window.AgriChatAPI.initialize(token);
      }
      
      this.hideApiModal();
    } else {
      AgriChatUtils.NotificationUtils.error('Please enter a valid Gemini API token');
      apiTokenInput.focus();
    }
  }

  /**
   * Handle skip API token
   */
  handleSkipApiToken() {
    AgriChatUtils.Storage.set('agrichat_seen_api_modal', true);
    this.hideApiModal();
    AgriChatUtils.NotificationUtils.info('Demo mode activated. You can add an API token later in settings.');
  }

  /**
   * Show loading overlay
   */
  showLoadingOverlay(message = 'Loading...') {
    if (!this.loadingOverlay) return;
    
    const messageElement = this.loadingOverlay.querySelector('p');
    if (messageElement) {
      messageElement.textContent = message;
    }
    
    this.loadingOverlay.classList.remove('hidden');
    this.loadingOverlay.style.display = 'flex';
  }

  /**
   * Hide loading overlay
   */
  hideLoadingOverlay() {
    if (!this.loadingOverlay) return;
    
    AgriChatUtils.AnimationUtils.fadeOut(this.loadingOverlay, 300);
  }

  /**
   * Handle smooth scrolling for anchor links
   */
  handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href.startsWith('#')) return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Initialize mobile menu
   */
  initMobileMenu() {
    // Create mobile menu toggle if needed
    const nav = $('.nav');
    if (!nav) return;
    
    // Check if we need a mobile menu
    const navMenu = $('.nav-menu');
    if (!navMenu) return;
    
    // Add mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.cssText = `
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--dark-ink);
    `;
    
    // Insert before nav menu
    navMenu.parentNode.insertBefore(mobileToggle, navMenu);
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
    
    // Show/hide mobile toggle based on screen size
    const checkMobileMenu = () => {
      if (window.innerWidth <= 768) {
        mobileToggle.style.display = 'block';
        navMenu.style.display = navMenu.classList.contains('mobile-open') ? 'flex' : 'none';
      } else {
        mobileToggle.style.display = 'none';
        navMenu.style.display = 'flex';
        navMenu.classList.remove('mobile-open');
      }
    };
    
    window.addEventListener('resize', AgriChatUtils.DebounceUtils.debounce(checkMobileMenu, 250));
    checkMobileMenu();
  }

  /**
   * Initialize theme toggle
   */
  initThemeToggle() {
    // Check for saved theme preference
    const savedTheme = AgriChatUtils.Storage.get('agrichat_theme', 'light');
    this.setTheme(savedTheme);
    
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.title = `Switch to ${savedTheme === 'dark' ? 'light' : 'dark'} mode`;
    themeToggle.style.cssText = `
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    `;
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
      themeToggle.title = `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`;
    });
    
    // Add to navigation
    const navMenu = $('.nav-menu');
    if (navMenu) {
      const themeItem = document.createElement('li');
      themeItem.appendChild(themeToggle);
      navMenu.appendChild(themeItem);
    }
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AgriChatUtils.Storage.set('agrichat_theme', theme);
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info', duration = 3000) {
    return AgriChatUtils.NotificationUtils.show(message, type, duration);
  }

  /**
   * Show success notification
   */
  showSuccess(message) {
    return this.showNotification(message, 'success');
  }

  /**
   * Show error notification
   */
  showError(message) {
    return this.showNotification(message, 'error', 5000);
  }

  /**
   * Show warning notification
   */
  showWarning(message) {
    return this.showNotification(message, 'warning');
  }

  /**
   * Show info notification
   */
  showInfo(message) {
    return this.showNotification(message, 'info');
  }

  /**
   * Update page title
   */
  updatePageTitle(title) {
    document.title = title;
  }

  /**
   * Show/hide element
   */
  toggleElement(element, show) {
    if (!element) return;
    
    if (show) {
      element.classList.remove('hidden');
      element.style.display = '';
    } else {
      element.classList.add('hidden');
      element.style.display = 'none';
    }
  }

  /**
   * Add loading state to button
   */
  setButtonLoading(button, isLoading, loadingText = 'Loading...') {
    if (!button) return;
    
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.innerHTML = `<div class="loading-spinner" style="width: 16px; height: 16px; margin-right: 8px;"></div>${loadingText}`;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K to focus chat input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatInput = $('#chatInput');
        if (chatInput) {
          chatInput.focus();
        }
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        this.hideApiModal();
      }
    });
  }

  /**
   * Initialize tooltips
   */
  initTooltips() {
    const tooltipElements = $$('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      const tooltipText = element.dataset.tooltip;
      
      element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
          position: absolute;
          background: var(--dark-ink);
          color: var(--pure-white);
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1000;
          pointer-events: none;
          white-space: nowrap;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        element._tooltip = tooltip;
      });
      
      element.addEventListener('mouseleave', () => {
        if (element._tooltip) {
          element._tooltip.remove();
          delete element._tooltip;
        }
      });
    });
  }

  /**
   * Initialize all UI features
   */
  initializeAll() {
    this.initKeyboardShortcuts();
    this.initTooltips();
    
    // Add any other initialization here
    console.log('UI Manager initialized');
  }
}

// Export for use in main.js
window.UIManager = UIManager;