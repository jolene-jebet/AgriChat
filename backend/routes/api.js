/**
 * API Routes for AgriChat
 * Handles all REST endpoints for conversations and messages
 */

const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');
const Message = require('../models/message');

// Middleware for input validation
const validateConversationInput = (req, res, next) => {
  const { title } = req.body;
  
  if (title && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({
      error: 'Invalid title. Title must be a non-empty string.'
    });
  }
  
  next();
};

const validateMessageInput = (req, res, next) => {
  const { content, type } = req.body;
  
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid content. Content must be a non-empty string.'
    });
  }
  
  if (!type || !['user', 'ai', 'error'].includes(type)) {
    return res.status(400).json({
      error: 'Invalid type. Type must be one of: user, ai, error.'
    });
  }
  
  next();
};

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const db = require('../config/database');
    const health = await db.healthCheck();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: health
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// ===== CONVERSATION ENDPOINTS =====

// Create new conversation
router.post('/conversations', validateConversationInput, async (req, res) => {
  try {
    const { title = 'New Conversation' } = req.body;
    const userId = req.body.user_id || null; // For future authentication
    
    const conversation = await Conversation.create(title, userId);
    
    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Get all conversations
router.get('/conversations', async (req, res) => {
  try {
    const { limit = 50, offset = 0, user_id } = req.query;
    const userId = user_id || null;
    
    const conversations = await Conversation.findAll(
      userId, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    res.json({
      success: true,
      data: conversations,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: conversations.length
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
});

// Get specific conversation
router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    const conversation = await Conversation.findById(parseInt(id));
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation'
    });
  }
});

// Update conversation title
router.put('/conversations/:id', validateConversationInput, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    const success = await Conversation.updateTitle(parseInt(id), title);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Conversation title updated successfully'
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update conversation'
    });
  }
});

// Delete conversation
router.delete('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    const success = await Conversation.delete(parseInt(id));
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation'
    });
  }
});

// Search conversations
router.get('/conversations/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20, user_id } = req.query;
    const userId = user_id || null;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const conversations = await Conversation.search(
      query.trim(), 
      userId, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: conversations,
      query: query.trim(),
      count: conversations.length
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search conversations'
    });
  }
});

// ===== MESSAGE ENDPOINTS =====

// Add message to conversation
router.post('/conversations/:id/messages', validateMessageInput, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    // Verify conversation exists
    const conversation = await Conversation.findById(parseInt(id));
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    const message = await Message.create(parseInt(id), content.trim(), type);
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create message'
    });
  }
});

// Get messages for conversation
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    // Verify conversation exists
    const conversation = await Conversation.findById(parseInt(id));
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    const messages = await Message.findByConversationId(
      parseInt(id), 
      parseInt(limit), 
      parseInt(offset)
    );
    
    res.json({
      success: true,
      data: messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: messages.length
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// Get recent messages for conversation
router.get('/conversations/:id/messages/recent', async (req, res) => {
  try {
    const { id } = req.params;
    const { count = 50 } = req.query;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    // Verify conversation exists
    const conversation = await Conversation.findById(parseInt(id));
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    const messages = await Message.getRecentMessages(parseInt(id), parseInt(count));
    
    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent messages'
    });
  }
});

// ===== STATISTICS ENDPOINTS =====

// Get conversation statistics
router.get('/conversations/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }
    
    // Verify conversation exists
    const conversation = await Conversation.findById(parseInt(id));
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    const [convStats, msgStats] = await Promise.all([
      Conversation.getStats(parseInt(id)),
      Message.getStats(parseInt(id))
    ]);
    
    res.json({
      success: true,
      data: {
        conversation: convStats,
        messages: msgStats
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const { user_id } = req.query;
    const userId = user_id || null;
    
    const [convStats, msgStats] = await Promise.all([
      Conversation.getStats(userId),
      Message.getStats()
    ]);
    
    res.json({
      success: true,
      data: {
        conversations: convStats,
        messages: msgStats
      }
    });
  } catch (error) {
    console.error('Error fetching overall statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

module.exports = router;
