/**
 * Conversation Model for AgriChat
 * Handles database operations for conversations
 */

const db = require('../config/database');

class Conversation {
  /**
   * Create a new conversation
   */
  static async create(title = 'New Conversation', userId = null) {
    try {
      const sql = `
        INSERT INTO conversations (title, user_id, created_at, updated_at) 
        VALUES (?, ?, NOW(), NOW())
      `;
      
      const result = await db.query(sql, [title, userId]);
      return {
        id: result.insertId,
        title,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID
   */
  static async findById(id) {
    try {
      const sql = `
        SELECT c.*, 
               COUNT(m.id) as message_count,
               MAX(m.timestamp) as last_message_time
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.id = ?
        GROUP BY c.id
      `;
      
      return await db.queryOne(sql, [id]);
    } catch (error) {
      console.error('Error finding conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations (with optional user filtering)
   */
  static async findAll(userId = null, limit = 50, offset = 0) {
    try {
      let sql = `
        SELECT c.*, 
               COUNT(m.id) as message_count,
               MAX(m.timestamp) as last_message_time
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
      `;
      
      const params = [];
      
      if (userId !== null) {
        sql += ' WHERE c.user_id = ?';
        params.push(userId);
      }
      
      sql += ' GROUP BY c.id ORDER BY c.updated_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      return await db.query(sql, params);
    } catch (error) {
      console.error('Error finding conversations:', error);
      throw error;
    }
  }

  /**
   * Update conversation title
   */
  static async updateTitle(id, title) {
    try {
      const sql = `
        UPDATE conversations 
        SET title = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      
      const result = await db.query(sql, [title, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  }

  /**
   * Delete conversation and all its messages
   */
  static async delete(id) {
    try {
      // Messages will be deleted automatically due to CASCADE
      const sql = 'DELETE FROM conversations WHERE id = ?';
      const result = await db.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation statistics
   */
  static async getStats(userId = null) {
    try {
      let sql = `
        SELECT 
          COUNT(DISTINCT c.id) as total_conversations,
          COUNT(m.id) as total_messages,
          COUNT(DISTINCT CASE WHEN m.type = 'user' THEN m.id END) as user_messages,
          COUNT(DISTINCT CASE WHEN m.type = 'ai' THEN m.id END) as ai_messages,
          AVG(CASE WHEN m.type = 'user' THEN LENGTH(m.content) END) as avg_user_message_length,
          AVG(CASE WHEN m.type = 'ai' THEN LENGTH(m.content) END) as avg_ai_message_length
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
      `;
      
      const params = [];
      
      if (userId !== null) {
        sql += ' WHERE c.user_id = ?';
        params.push(userId);
      }
      
      return await db.queryOne(sql, params);
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      throw error;
    }
  }

  /**
   * Search conversations by title or content
   */
  static async search(query, userId = null, limit = 20) {
    try {
      let sql = `
        SELECT DISTINCT c.*, 
               COUNT(m.id) as message_count,
               MAX(m.timestamp) as last_message_time
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE (c.title LIKE ? OR m.content LIKE ?)
      `;
      
      const params = [`%${query}%`, `%${query}%`];
      
      if (userId !== null) {
        sql += ' AND c.user_id = ?';
        params.push(userId);
      }
      
      sql += ' GROUP BY c.id ORDER BY c.updated_at DESC LIMIT ?';
      params.push(limit);
      
      return await db.query(sql, params);
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  }
}

module.exports = Conversation;
