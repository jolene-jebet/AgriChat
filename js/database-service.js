/**
 * Database Service for AgriChat Frontend
 * Handles communication with the backend API for conversations and messages
 */

class DatabaseService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.currentConversationId = null;
    this.isConnected = false;
    
    // Test connection on initialization
    this.testConnection();
  }

  /**
   * Test connection to backend
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      if (response.ok) {
        this.isConnected = true;
        console.log('✅ Connected to AgriChat backend');
      } else {
        this.isConnected = false;
        console.warn('⚠️ Backend connection failed');
      }
    } catch (error) {
      this.isConnected = false;
      console.warn('⚠️ Backend not available, falling back to localStorage');
    }
  }

  /**
   * Check if backend is available
   */
  isBackendAvailable() {
    return this.isConnected;
  }

  /**
   * Create a new conversation
   */
  async createConversation(title = 'New Conversation') {
    if (!this.isBackendAvailable()) {
      // Fallback to localStorage
      return this.createLocalConversation(title);
    }

    try {
      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      this.currentConversationId = result.data.id;
      
      return {
        success: true,
        conversation: result.data
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Fallback to localStorage
      return this.createLocalConversation(title);
    }
  }

  /**
   * Get all conversations
   */
  async getConversations(limit = 50, offset = 0) {
    if (!this.isBackendAvailable()) {
      return this.getLocalConversations();
    }

    try {
      const response = await fetch(
        `${this.baseURL}/conversations?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        conversations: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to localStorage
      return this.getLocalConversations();
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId, limit = 100, offset = 0) {
    if (!this.isBackendAvailable()) {
      return this.getLocalMessages(conversationId);
    }

    try {
      const response = await fetch(
        `${this.baseURL}/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        messages: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to localStorage
      return this.getLocalMessages(conversationId);
    }
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(conversationId, content, type) {
    if (!this.isBackendAvailable()) {
      return this.addLocalMessage(conversationId, content, type);
    }

    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, type })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: result.data
      };
    } catch (error) {
      console.error('Error adding message:', error);
      // Fallback to localStorage
      return this.addLocalMessage(conversationId, content, type);
    }
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId, title) {
    if (!this.isBackendAvailable()) {
      return this.updateLocalConversationTitle(conversationId, title);
    }

    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating conversation title:', error);
      // Fallback to localStorage
      return this.updateLocalConversationTitle(conversationId, title);
    }
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId) {
    if (!this.isBackendAvailable()) {
      return this.deleteLocalConversation(conversationId);
    }

    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      // Fallback to localStorage
      return this.deleteLocalConversation(conversationId);
    }
  }

  /**
   * Search conversations
   */
  async searchConversations(query, limit = 20) {
    if (!this.isBackendAvailable()) {
      return this.searchLocalConversations(query);
    }

    try {
      const response = await fetch(
        `${this.baseURL}/conversations/search/${encodeURIComponent(query)}?limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        conversations: result.data,
        query: result.query,
        count: result.count
      };
    } catch (error) {
      console.error('Error searching conversations:', error);
      // Fallback to localStorage
      return this.searchLocalConversations(query);
    }
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(conversationId) {
    if (!this.isBackendAvailable()) {
      return this.getLocalConversationStats(conversationId);
    }

    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        stats: result.data
      };
    } catch (error) {
      console.error('Error fetching conversation stats:', error);
      // Fallback to localStorage
      return this.getLocalConversationStats(conversationId);
    }
  }

  // ===== LOCAL STORAGE FALLBACK METHODS =====

  /**
   * Create local conversation (fallback)
   */
  createLocalConversation(title) {
    const conversation = {
      id: Date.now() + Math.random(),
      title,
      created_at: new Date(),
      updated_at: new Date(),
      message_count: 0
    };

    const conversations = this.getLocalConversations().conversations;
    conversations.unshift(conversation);
    localStorage.setItem('agrichat_conversations', JSON.stringify(conversations));

    return { success: true, conversation };
  }

  /**
   * Get local conversations (fallback)
   */
  getLocalConversations() {
    const conversations = JSON.parse(localStorage.getItem('agrichat_conversations') || '[]');
    return { success: true, conversations };
  }

  /**
   * Get local messages (fallback)
   */
  getLocalMessages(conversationId) {
    const messages = JSON.parse(localStorage.getItem(`agrichat_messages_${conversationId}`) || '[]');
    return { success: true, messages };
  }

  /**
   * Add local message (fallback)
   */
  addLocalMessage(conversationId, content, type) {
    const message = {
      id: Date.now() + Math.random(),
      conversation_id: conversationId,
      content,
      type,
      timestamp: new Date()
    };

    const messages = this.getLocalMessages(conversationId).messages;
    messages.push(message);
    localStorage.setItem(`agrichat_messages_${conversationId}`, JSON.stringify(messages));

    // Update conversation timestamp
    this.updateLocalConversationTimestamp(conversationId);

    return { success: true, message };
  }

  /**
   * Update local conversation title (fallback)
   */
  updateLocalConversationTitle(conversationId, title) {
    const conversations = this.getLocalConversations().conversations;
    const conversation = conversations.find(c => c.id == conversationId);
    
    if (conversation) {
      conversation.title = title;
      conversation.updated_at = new Date();
      localStorage.setItem('agrichat_conversations', JSON.stringify(conversations));
      return { success: true };
    }
    
    return { success: false };
  }

  /**
   * Delete local conversation (fallback)
   */
  deleteLocalConversation(conversationId) {
    const conversations = this.getLocalConversations().conversations;
    const filtered = conversations.filter(c => c.id != conversationId);
    localStorage.setItem('agrichat_conversations', JSON.stringify(filtered));
    
    // Also delete messages
    localStorage.removeItem(`agrichat_messages_${conversationId}`);
    
    return { success: true };
  }

  /**
   * Search local conversations (fallback)
   */
  searchLocalConversations(query) {
    const conversations = this.getLocalConversations().conversations;
    const filtered = conversations.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase())
    );
    
    return { success: true, conversations: filtered, query, count: filtered.length };
  }

  /**
   * Get local conversation stats (fallback)
   */
  getLocalConversationStats(conversationId) {
    const messages = this.getLocalMessages(conversationId).messages;
    const userMessages = messages.filter(m => m.type === 'user').length;
    const aiMessages = messages.filter(m => m.type === 'ai').length;
    const errorMessages = messages.filter(m => m.type === 'error').length;
    
    return {
      success: true,
      stats: {
        conversation: { message_count: messages.length },
        messages: {
          total_messages: messages.length,
          user_messages: userMessages,
          ai_messages: aiMessages,
          error_messages: errorMessages
        }
      }
    };
  }

  /**
   * Update local conversation timestamp (fallback)
   */
  updateLocalConversationTimestamp(conversationId) {
    const conversations = this.getLocalConversations().conversations;
    const conversation = conversations.find(c => c.id == conversationId);
    
    if (conversation) {
      conversation.updated_at = new Date();
      conversation.message_count = (conversation.message_count || 0) + 1;
      localStorage.setItem('agrichat_conversations', JSON.stringify(conversations));
    }
  }

  /**
   * Set current conversation ID
   */
  setCurrentConversation(conversationId) {
    this.currentConversationId = conversationId;
  }

  /**
   * Get current conversation ID
   */
  getCurrentConversation() {
    return this.currentConversationId;
  }

  /**
   * Clear all local data
   */
  clearLocalData() {
    localStorage.removeItem('agrichat_conversations');
    
    // Get all conversation IDs and remove their messages
    const conversations = this.getLocalConversations().conversations;
    conversations.forEach(conv => {
      localStorage.removeItem(`agrichat_messages_${conv.id}`);
    });
    
    localStorage.removeItem('agrichat_conversations');
  }
}

// Create global instance
window.AgriChatDatabase = new DatabaseService();
