/**
 * Message Model for AgriChat
 * Handles database operations for messages
 */

const db = require('../config/database');

class Message {
  /**
   * Create a new message
   */
  static async create(conversationId, content, type) {
    try {
      const sql = `
        INSERT INTO messages (conversation_id, content, type, timestamp) 
        VALUES (?, ?, ?, NOW())
      `;
      
      const result = await db.query(sql, [conversationId, content, type]);
      
      // Update conversation's updated_at timestamp
      await this.updateConversationTimestamp(conversationId);
      
      return {
        id: result.insertId,
        conversation_id: conversationId,
        content,
        type,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  /**
   * Get message by ID
   */
  static async findById(id) {
    try {
      const sql = 'SELECT * FROM messages WHERE id = ?';
      return await db.queryOne(sql, [id]);
    } catch (error) {
      console.error('Error finding message:', error);
      throw error;
    }
  }

  /**
   * Get all messages for a conversation
   */
  static async findByConversationId(conversationId, limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT * FROM messages 
        WHERE conversation_id = ? 
        ORDER BY timestamp ASC 
        LIMIT ? OFFSET ?
      `;
      
      return await db.query(sql, [conversationId, limit, offset]);
    } catch (error) {
      console.error('Error finding messages by conversation:', error);
      throw error;
    }
  }

  /**
   * Get recent messages for a conversation
   */
  static async getRecentMessages(conversationId, count = 50) {
    try {
      const sql = `
        SELECT * FROM messages 
        WHERE conversation_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
      `;
      
      const messages = await db.query(sql, [conversationId, count]);
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }

  /**
   * Update message content
   */
  static async update(id, content) {
    try {
      const sql = `
        UPDATE messages 
        SET content = ? 
        WHERE id = ?
      `;
      
      const result = await db.query(sql, [content, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  /**
   * Delete message
   */
  static async delete(id) {
    try {
      const sql = 'DELETE FROM messages WHERE id = ?';
      const result = await db.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Delete all messages in a conversation
   */
  static async deleteByConversationId(conversationId) {
    try {
      const sql = 'DELETE FROM messages WHERE conversation_id = ?';
      const result = await db.query(sql, [conversationId]);
      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting messages by conversation:', error);
      throw error;
    }
  }

  /**
   * Get message statistics
   */
  static async getStats(conversationId = null) {
    try {
      let sql = `
        SELECT 
          COUNT(*) as total_messages,
          COUNT(CASE WHEN type = 'user' THEN 1 END) as user_messages,
          COUNT(CASE WHEN type = 'ai' THEN 1 END) as ai_messages,
          COUNT(CASE WHEN type = 'error' THEN 1 END) as error_messages,
          AVG(LENGTH(content)) as avg_message_length,
          MIN(timestamp) as first_message_time,
          MAX(timestamp) as last_message_time
        FROM messages
      `;
      
      const params = [];
      
      if (conversationId) {
        sql += ' WHERE conversation_id = ?';
        params.push(conversationId);
      }
      
      return await db.queryOne(sql, params);
    } catch (error) {
      console.error('Error getting message stats:', error);
      throw error;
    }
  }

  /**
   * Search messages by content
   */
  static async search(query, conversationId = null, limit = 50) {
    try {
      let sql = `
        SELECT m.*, c.title as conversation_title
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE m.content LIKE ?
      `;
      
      const params = [`%${query}%`];
      
      if (conversationId) {
        sql += ' AND m.conversation_id = ?';
        params.push(conversationId);
      }
      
      sql += ' ORDER BY m.timestamp DESC LIMIT ?';
      params.push(limit);
      
      return await db.query(sql, params);
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  /**
   * Update conversation timestamp when message is added
   */
  static async updateConversationTimestamp(conversationId) {
    try {
      const sql = `
        UPDATE conversations 
        SET updated_at = NOW() 
        WHERE id = ?
      `;
      
      await db.query(sql, [conversationId]);
    } catch (error) {
      console.error('Error updating conversation timestamp:', error);
      // Don't throw error here as it's not critical
    }
  }

  /**
   * Get message count for a conversation
   */
  static async getCount(conversationId) {
    try {
      const sql = 'SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?';
      const result = await db.queryOne(sql, [conversationId]);
      return result.count;
    } catch (error) {
      console.error('Error getting message count:', error);
      throw error;
    }
  }
}

module.exports = Message;
