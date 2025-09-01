/**
 * Chat Management for AgriChat
 * Handles chat functionality, message management, and user interactions
 */

class ChatManager {
  constructor(apiManager) {
    this.apiManager = apiManager;
    this.messages = [];
    this.isProcessing = false;
    this.chatContainer = null;
    this.inputElement = null;
    this.sendButton = null;
    this.charCountElement = null;
    
    // Initialize chat
    this.init();
  }

  /**
   * Initialize chat functionality
   */
  init() {
    this.chatContainer = $('#chatMessages');
    this.inputElement = $('#chatInput');
    this.sendButton = $('#sendBtn');
    this.charCountElement = $('#charCount');
    
    if (!this.chatContainer || !this.inputElement) {
      console.error('Chat elements not found');
      return;
    }

    this.bindEvents();
    this.loadChatHistory();
    this.updateCharacterCount();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submission
    const chatForm = $('#chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Input events
    if (this.inputElement) {
      this.inputElement.addEventListener('input', () => this.updateCharacterCount());
      this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Send button
    if (this.sendButton) {
      this.sendButton.addEventListener('click', (e) => this.handleSubmit(e));
    }

    // Suggested questions
    const questionChips = $$('.question-chip');
    questionChips.forEach(chip => {
      chip.addEventListener('click', () => this.handleSuggestedQuestion(chip));
    });

    // Auto-resize textarea
    if (this.inputElement) {
      this.inputElement.addEventListener('input', () => this.autoResizeTextarea());
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isProcessing) return;
    
    const message = this.inputElement.value.trim();
    if (!AgriChatUtils.ValidationUtils.isValidMessage(message)) {
      AgriChatUtils.NotificationUtils.warning('Please enter a valid message (3-1000 characters)');
      return;
    }

    await this.sendMessage(message);
  }

  /**
   * Handle key down events
   */
  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  }

  /**
   * Handle suggested question clicks
   */
  handleSuggestedQuestion(chip) {
    const question = chip.dataset.question;
    if (question) {
      this.inputElement.value = question;
      this.updateCharacterCount();
      this.inputElement.focus();
    }
  }

  /**
   * Send a message
   */
  async sendMessage(content) {
    if (this.isProcessing) return;

    // Add user message
    const userMessage = this.addMessage(content, 'user');
    this.clearInput();
    this.scrollToBottom();

    // Show typing indicator
    const typingIndicator = this.showTypingIndicator();

    try {
      this.isProcessing = true;
      this.updateSendButton(true);

      // Get AI response
      const response = await this.apiManager.getAgriculturalAdvice(content);
      
      // Remove typing indicator
      this.hideTypingIndicator(typingIndicator);
      
      // Add AI response
      this.addMessage(response, 'ai');
      
      // Save to history
      this.saveChatHistory();
      
    } catch (error) {
      this.hideTypingIndicator(typingIndicator);
      this.handleError(error);
    } finally {
      this.isProcessing = false;
      this.updateSendButton(false);
      this.scrollToBottom();
    }
  }

  /**
   * Add a message to the chat
   */
  addMessage(content, type) {
    const messageId = Date.now() + Math.random();
    const timestamp = new Date();
    
    const message = {
      id: messageId,
      content: AgriChatUtils.StringUtils.sanitize(content),
      type: type,
      timestamp: timestamp
    };

    this.messages.push(message);
    
    const messageElement = this.createMessageElement(message);
    this.chatContainer.appendChild(messageElement);
    
    // Animate message
    AgriChatUtils.AnimationUtils.slideIn(messageElement, 'up', 300);
    
    return message;
  }

  /**
   * Create message element
   */
  createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${message.type}`;
    messageDiv.dataset.messageId = message.id;

    const contentDiv = document.createElement('div');
    contentDiv.textContent = message.content;
    messageDiv.appendChild(contentDiv);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = AgriChatUtils.TimeUtils.formatTime(message.timestamp);
    messageDiv.appendChild(timeDiv);

    // Add copy functionality for AI messages
    if (message.type === 'ai') {
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      copyButton.innerHTML = '📋';
      copyButton.title = 'Copy message';
      copyButton.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.7;
        font-size: 12px;
        padding: 4px;
        border-radius: 4px;
        transition: opacity 0.2s;
      `;
      
      copyButton.addEventListener('click', () => this.copyMessage(message.content));
      copyButton.addEventListener('mouseenter', () => copyButton.style.opacity = '1');
      copyButton.addEventListener('mouseleave', () => copyButton.style.opacity = '0.7');
      
      messageDiv.style.position = 'relative';
      messageDiv.appendChild(copyButton);
    }

    return messageDiv;
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    this.chatContainer.appendChild(typingDiv);
    this.scrollToBottom();
    
    return typingDiv;
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator(typingElement) {
    if (typingElement && typingElement.parentNode) {
      AgriChatUtils.AnimationUtils.fadeOut(typingElement, 200);
    }
  }

  /**
   * Copy message to clipboard
   */
  async copyMessage(content) {
    const success = await AgriChatUtils.ClipboardUtils.copyToClipboard(content);
    if (success) {
      AgriChatUtils.NotificationUtils.success('Message copied to clipboard!');
    } else {
      AgriChatUtils.NotificationUtils.error('Failed to copy message');
    }
  }

  /**
   * Handle errors
   */
  handleError(error) {
    console.error('Chat error:', error);
    
    const errorMessage = AgriChatUtils.ErrorUtils.handleApiError(error);
    this.addMessage(errorMessage, 'error');
    
    AgriChatUtils.NotificationUtils.error('Failed to get response. Please try again.');
  }

  /**
   * Clear input
   */
  clearInput() {
    if (this.inputElement) {
      this.inputElement.value = '';
      this.updateCharacterCount();
      this.autoResizeTextarea();
    }
  }

  /**
   * Update character count
   */
  updateCharacterCount() {
    if (!this.charCountElement || !this.inputElement) return;
    
    const count = this.inputElement.value.length;
    const maxLength = 1000;
    
    this.charCountElement.textContent = `${count}/${maxLength}`;
    
    // Change color based on count
    if (count > maxLength * 0.9) {
      this.charCountElement.style.color = 'var(--error)';
    } else if (count > maxLength * 0.7) {
      this.charCountElement.style.color = 'var(--warning)';
    } else {
      this.charCountElement.style.color = 'var(--dark-ink)';
    }
  }

  /**
   * Auto-resize textarea
   */
  autoResizeTextarea() {
    if (!this.inputElement) return;
    
    this.inputElement.style.height = 'auto';
    const scrollHeight = this.inputElement.scrollHeight;
    const maxHeight = 120; // Max height in pixels
    
    this.inputElement.style.height = Math.min(scrollHeight, maxHeight) + 'px';
  }

  /**
   * Update send button state
   */
  updateSendButton(isProcessing) {
    if (!this.sendButton) return;
    
    this.sendButton.disabled = isProcessing;
    
    if (isProcessing) {
      this.sendButton.innerHTML = '<div class="loading-spinner" style="width: 16px; height: 16px;"></div>';
    } else {
      this.sendButton.innerHTML = '<span>📤</span>';
    }
  }

  /**
   * Scroll to bottom of chat
   */
  scrollToBottom() {
    if (this.chatContainer) {
      setTimeout(() => {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
      }, 100);
    }
  }

  /**
   * Save chat history to localStorage
   */
  saveChatHistory() {
    const history = this.messages.slice(-50); // Keep last 50 messages
    AgriChatUtils.Storage.set('agrichat_history', history);
  }

  /**
   * Load chat history from localStorage
   */
  loadChatHistory() {
    const history = AgriChatUtils.Storage.get('agrichat_history', []);
    
    if (history.length > 0) {
      // Clear existing messages (except welcome message)
      const existingMessages = $$('.message');
      existingMessages.forEach(msg => {
        if (!msg.classList.contains('message--ai') || !msg.textContent.includes('Welcome to AgriChat')) {
          msg.remove();
        }
      });
      
      // Load history
      history.forEach(message => {
        this.messages.push(message);
        const messageElement = this.createMessageElement(message);
        this.chatContainer.appendChild(messageElement);
      });
      
      this.scrollToBottom();
    }
  }

  /**
   * Clear chat history
   */
  clearChatHistory() {
    this.messages = [];
    AgriChatUtils.Storage.remove('agrichat_history');
    
    // Clear chat container except welcome message
    const messages = $$('.message');
    messages.forEach(msg => {
      if (!msg.textContent.includes('Welcome to AgriChat')) {
        msg.remove();
      }
    });
    
    AgriChatUtils.NotificationUtils.success('Chat history cleared');
  }

  /**
   * Get chat statistics
   */
  getStats() {
    const userMessages = this.messages.filter(m => m.type === 'user').length;
    const aiMessages = this.messages.filter(m => m.type === 'ai').length;
    
    return {
      totalMessages: this.messages.length,
      userMessages,
      aiMessages,
      isDemoMode: this.apiManager.isInDemoMode()
    };
  }
}

// Export for use in main.js
window.ChatManager = ChatManager;
