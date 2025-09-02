/**
 * Utility Functions for AgriChat
 * Common helper functions used across the application
 */

// DOM Utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Create the main AgriChatUtils object
window.AgriChatUtils = {};

// Local Storage Utilities
const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  }
};

// Add Storage to AgriChatUtils
window.AgriChatUtils.Storage = Storage;

// Date/Time Utilities
const TimeUtils = {
 formatTime(date = new Date()) {
    try {
      // Convert to Date object if it's not already
      let dateObj;
      
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else {
        // If it's null, undefined, or invalid type, use current time
        dateObj = new Date();
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date in formatTime, using current time:', date);
        dateObj = new Date();
      }
      
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error in formatTime:', error);
      // Fallback to current time
      return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  },

  ormatDate(date = new Date()) {
    try {
      let dateObj;
      
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else {
        dateObj = new Date();
      }
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date in formatDate, using current date:', date);
        dateObj = new Date();
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error in formatDate:', error);
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },

  getRelativeTime(date) {
    try {
      let dateObj;
      
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else {
        return 'Unknown time';
      }
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid time';
      }
      
      const now = new Date();
      const diff = now - dateObj;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return this.formatDate(dateObj);
    } catch (error) {
      console.error('Error in getRelativeTime:', error);
      return 'Unknown time';
    }
  }
};

// String Utilities
const StringUtils = {
  truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  sanitize(text) {
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim();
  },

  isValidInput(text) {
    return text && text.trim().length > 0 && text.length <= 1000;
  }
};

// Animation Utilities
const AnimationUtils = {
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = progress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  },

  fadeOut(element, duration = 300) {
    let start = performance.now();
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = initialOpacity * (1 - progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    }
    
    requestAnimationFrame(animate);
  },

  slideIn(element, direction = 'up', duration = 300) {
    const directions = {
      up: { from: 'translateY(20px)', to: 'translateY(0)' },
      down: { from: 'translateY(-20px)', to: 'translateY(0)' },
      left: { from: 'translateX(20px)', to: 'translateX(0)' },
      right: { from: 'translateX(-20px)', to: 'translateX(0)' }
    };

    const transform = directions[direction] || directions.up;
    
    element.style.transform = transform.from;
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.transform = transform.to;
      element.style.opacity = progress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }
};

// Validation Utilities
// In js/utils.js, find this function and replace it:
const ValidationUtils = {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // OLD: isValidApiToken(token) { return token && token.startsWith('hf_') && token.length > 20; }
  // NEW:
  isValidApiToken(token) {
    return token && token.startsWith('AIza') && token.length > 30;
  },

  isValidMessage(message) {
    return StringUtils.isValidInput(message) && message.length >= 3;
  }
};

// Error Handling Utilities
const ErrorUtils = {
  createError(message, code = 'UNKNOWN_ERROR') {
    return {
      message,
      code,
      timestamp: new Date().toISOString()
    };
  },

  logError(error, context = '') {
    console.error(`[AgriChat Error${context ? ` - ${context}` : ''}]:`, error);
    
    // In production, you might want to send this to an error tracking service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error,
        fatal: false
      });
    }
  },

  handleApiError(error) {
    if (error.status === 401) {
      return 'Invalid API token. Please check your Gemini token.';
    } else if (error.status === 429) {
      return 'Rate limit exceeded. Please wait a moment before trying again.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else if (error.message.includes('network')) {
      return 'Network error. Please check your internet connection.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }
};

// Debounce Utility
const DebounceUtils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Copy to Clipboard Utility
const ClipboardUtils = {
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      ErrorUtils.logError(error, 'copyToClipboard');
      return false;
    }
  }
};

// Notification Utilities
const NotificationUtils = {
  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });

    // Set background color based on type
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#96b43a'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);

    return notification;
  },

  success(message) {
    return this.show(message, 'success');
  },

  error(message) {
    return this.show(message, 'error', 5000);
  },

  warning(message) {
    return this.show(message, 'warning');
  },

  info(message) {
    return this.show(message, 'info');
  }
};

// Export utilities for use in other modules
window.AgriChatUtils = {
  $,
  $$,
  Storage,
  TimeUtils,
  StringUtils,
  AnimationUtils,
  ValidationUtils,
  ErrorUtils,
  DebounceUtils,
  ClipboardUtils,
  NotificationUtils
};
