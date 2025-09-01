-- AgriChat Database Schema
-- This file contains the complete database structure for the AgriChat application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS agrichat;
USE agrichat;

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- For future authentication
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL, -- NULL if no auth, for future use
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('user', 'ai', 'error') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Insert sample data for testing (optional)
INSERT IGNORE INTO conversations (id, title) VALUES (1, 'Sample Conversation');
INSERT IGNORE INTO messages (conversation_id, content, type) VALUES 
(1, 'Hello! How can I help you with farming today?', 'ai'),
(1, 'I need help with tomato planting', 'user'),
(1, 'Great question! Tomatoes need well-draining soil and at least 6-8 hours of sunlight. Plant them deep, burying about 2/3 of the stem to encourage strong root development.', 'ai');

-- Show table structure
DESCRIBE users;
DESCRIBE conversations;
DESCRIBE messages;
