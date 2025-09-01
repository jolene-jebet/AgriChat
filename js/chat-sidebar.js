/**
 * Chat Sidebar Management for AgriChat
 * Handles conversation history, sidebar toggle, and chat management
 */

class ChatSidebar {
  constructor() {
    this.sidebar = null;
    this.toggleBtn = null;
    this.newChatBtn = null;
    this.conversationsList = null;
    this.clearHistoryBtn = null;
    this.isOpen = false;
    
    this.init();
  }

  /**
   * Initialize sidebar
   */
  init() {
    this.sidebar = document.getElementById('chatSidebar');
    this.toggleBtn = document.getElementById('sidebarToggle');
    this.mobileToggleBtn = document.getElementById('sidebarToggleMobile');
    this.newChatBtn = document.getElementById('newChatBtn');
    this.conversationsList = document.getElementById('conversationsList');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

    if (!this.sidebar || !this.toggleBtn) {
      console.warn('Chat sidebar elements not found');
      return;
    }

    this.bindEvents();
    this.loadConversations();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Toggle sidebar
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Mobile toggle button
    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // New chat button
    if (this.newChatBtn) {
      this.newChatBtn.addEventListener('click', () => this.createNewChat());
    }

    // Clear history button
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.sidebar.contains(e.target) && !this.toggleBtn.contains(e.target)) {
        this.closeSidebar();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b': // Ctrl/Cmd + B to toggle sidebar
            e.preventDefault();
            this.toggleSidebar();
            break;
          case 'n': // Ctrl/Cmd + N for new chat
            e.preventDefault();
            this.createNewChat();
            break;
        }
      }
    });
  }

  /**
   * Toggle sidebar open/close
   */
  toggleSidebar() {
    if (this.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  /**
   * Open sidebar
   */
  openSidebar() {
    this.sidebar.classList.add('open');
    this.isOpen = true;
    this.toggleBtn.textContent = '✕';
    
    // Adjust main chat area
    const chatMain = document.querySelector('.chat-main');
    if (chatMain) {
      chatMain.classList.add('with-sidebar');
    }
  }

  /**
   * Close sidebar
   */
  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.isOpen = false;
    this.toggleBtn.textContent = '☰';
    
    // Adjust main chat area
    const chatMain = document.querySelector('.chat-main');
    if (chatMain) {
      chatMain.classList.remove('with-sidebar');
    }
  }

  /**
   * Load conversations from database or localStorage
   */
  async loadConversations() {
    try {
      let conversations = [];
      
      // Try to get from database first
      if (window.AgriChatDatabase && window.AgriChatDatabase.isBackendAvailable()) {
        const result = await window.AgriChatDatabase.getConversations();
        if (result.success) {
          conversations = result.conversations;
        }
      } else {
        // Fallback to localStorage
        const localConversations = JSON.parse(localStorage.getItem('agrichat_conversations') || '[]');
        conversations = localConversations;
      }

      this.renderConversations(conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Fallback to localStorage
      const localConversations = JSON.parse(localStorage.getItem('agrichat_conversations') || '[]');
      this.renderConversations(localConversations);
    }
  }

  /**
   * Render conversations list
   */
  renderConversations(conversations) {
    if (!this.conversationsList) return;

    this.conversationsList.innerHTML = '';

    if (conversations.length === 0) {
      this.conversationsList.innerHTML = `
        <div class="empty-state">
          <p>No conversations yet</p>
          <p class="text-sm opacity-60">Start chatting to see your history here</p>
        </div>
      `;
      return;
    }

    conversations.forEach(conversation => {
      const conversationElement = this.createConversationElement(conversation);
      this.conversationsList.appendChild(conversationElement);
    });
  }

  /**
   * Create conversation element
   */
  createConversationElement(conversation) {
    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.dataset.conversationId = conversation.id;

    const title = conversation.title || 'Untitled Conversation';
    const messageCount = conversation.message_count || 0;
    const updatedAt = conversation.updated_at || conversation.created_at || new Date();
    
    // Format the date
    const date = new Date(updatedAt);
    const isToday = date.toDateString() === new Date().toDateString();
    const timeString = isToday ? 
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) :
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    div.innerHTML = `
      <div class="conversation-title">${this.truncateText(title, 30)}</div>
      <div class="conversation-meta">
        ${messageCount} message${messageCount !== 1 ? 's' : ''} • ${timeString}
      </div>
    `;

    // Add click event
    div.addEventListener('click', () => this.loadConversation(conversation.id));

    return div;
  }

  /**
   * Create new chat
   */
  async createNewChat() {
    try {
      let conversationId = null;
      
      // Try to create in database first
      if (window.AgriChatDatabase && window.AgriChatDatabase.isBackendAvailable()) {
        const result = await window.AgriChatDatabase.createConversation('New Conversation');
        if (result.success) {
          conversationId = result.conversation.id;
        }
      } else {
        // Fallback to localStorage
        const conversation = {
          id: Date.now() + Math.random(),
          title: 'New Conversation',
          created_at: new Date(),
          updated_at: new Date(),
          message_count: 0
        };
        
        const conversations = JSON.parse(localStorage.getItem('agrichat_conversations') || '[]');
        conversations.unshift(conversation);
        localStorage.setItem('agrichat_conversations', JSON.stringify(conversations));
        
        conversationId = conversation.id;
      }

      if (conversationId) {
        // Clear current chat
        this.clearCurrentChat();
        
        // Set as current conversation
        if (window.AgriChatDatabase) {
          window.AgriChatDatabase.setCurrentConversation(conversationId);
        }
        
        // Reload conversations list
        this.loadConversations();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
          this.closeSidebar();
        }
        
        // Show success message
        if (window.AgriChatUtils && window.AgriChatUtils.NotificationUtils) {
          window.AgriChatUtils.NotificationUtils.success('New chat started!');
        }
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      if (window.AgriChatUtils && window.AgriChatUtils.NotificationUtils) {
        window.AgriChatUtils.NotificationUtils.error('Failed to create new chat');
      }
    }
  }

  /**
   * Load specific conversation
   */
  async loadConversation(conversationId) {
    try {
      // Set as current conversation
      if (window.AgriChatDatabase) {
        window.AgriChatDatabase.setCurrentConversation(conversationId);
      }

      // Load messages for this conversation
      let messages = [];
      
      if (window.AgriChatDatabase && window.AgriChatDatabase.isBackendAvailable()) {
        const result = await window.AgriChatDatabase.getMessages(conversationId);
        if (result.success) {
          messages = result.messages;
        }
      } else {
        // Fallback to localStorage
        messages = JSON.parse(localStorage.getItem(`agrichat_messages_${conversationId}`) || '[]');
      }

      // Clear current chat and load messages
      this.clearCurrentChat();
      this.loadMessagesToChat(messages);

      // Update active state in sidebar
      this.updateActiveConversation(conversationId);

      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        this.closeSidebar();
      }

    } catch (error) {
      console.error('Error loading conversation:', error);
      if (window.AgriChatUtils && window.AgriChatUtils.NotificationUtils) {
        window.AgriChatUtils.NotificationUtils.error('Failed to load conversation');
      }
    }
  }

  /**
   * Clear current chat
   */
  clearCurrentChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      // Keep only the welcome message
      const welcomeMessage = chatMessages.querySelector('.message--ai');
      chatMessages.innerHTML = '';
      if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage);
      }
    }
  }

  /**
   * Load messages to chat
   */
  loadMessagesToChat(messages) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages || !messages.length) return;

    messages.forEach(message => {
      const messageElement = this.createMessageElement(message);
      chatMessages.appendChild(messageElement);
    });

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Create message element
   */
  createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message message--${message.type}`;
    div.dataset.messageId = message.id;

    const contentDiv = document.createElement('div');
    contentDiv.textContent = message.content;
    div.appendChild(contentDiv);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    
    if (window.AgriChatUtils && window.AgriChatUtils.TimeUtils) {
      timeDiv.textContent = window.AgriChatUtils.TimeUtils.formatTime(message.timestamp);
    } else {
      timeDiv.textContent = new Date(message.timestamp).toLocaleTimeString();
    }
    
    div.appendChild(timeDiv);

    return div;
  }

  /**
   * Update active conversation in sidebar
   */
  updateActiveConversation(conversationId) {
    // Remove active class from all items
    const items = this.conversationsList.querySelectorAll('.conversation-item');
    items.forEach(item => item.classList.remove('active'));

    // Add active class to current conversation
    const activeItem = this.conversationsList.querySelector(`[data-conversation-id="${conversationId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  /**
   * Clear all chat history
   */
  async clearHistory() {
    if (!confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      return;
    }

    try {
      // Clear from database if available
      if (window.AgriChatDatabase && window.AgriChatDatabase.isBackendAvailable()) {
        // Get all conversations and delete them
        const result = await window.AgriChatDatabase.getConversations();
        if (result.success) {
          for (const conversation of result.conversations) {
            await window.AgriChatDatabase.deleteConversation(conversation.id);
          }
        }
      } else {
        // Clear localStorage
        window.AgriChatDatabase.clearLocalData();
      }

      // Clear current chat
      this.clearCurrentChat();
      
      // Reload conversations list
      this.loadConversations();
      
      // Show success message
      if (window.AgriChatUtils && window.AgriChatUtils.NotificationUtils) {
        window.AgriChatUtils.NotificationUtils.success('Chat history cleared successfully');
      }

    } catch (error) {
      console.error('Error clearing history:', error);
      if (window.AgriChatUtils && window.AgriChatUtils.NotificationUtils) {
        window.AgriChatUtils.NotificationUtils.error('Failed to clear history');
      }
    }
  }

  /**
   * Refresh conversations list
   */
  refresh() {
    this.loadConversations();
  }

  /**
   * Truncate text to specified length
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

// Create global instance
window.ChatSidebar = ChatSidebar;
