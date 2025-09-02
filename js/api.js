/**
 * Gemini API Integration for AgriChat
 * Handles communication with Google's Gemini AI API
 */

class GeminiAPI {
  constructor(apiToken = null) {
    this.apiToken = apiToken;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-1.5-flash'; // Using the fast, efficient model
    this.timeout = 15000; // 15 seconds (Gemini can be a bit slower than HuggingFace)
    this.maxRetries = 3;
    
    // Agricultural context prompt - this is like giving the AI a job description
    this.systemPrompt = `You are AgriChat, an expert agricultural assistant with deep knowledge of farming practices worldwide. Your role is to provide practical, actionable advice about:

- Crop planting, growing, and harvesting
- Soil health and fertility management  
- Pest and disease identification and management
- Sustainable farming practices
- Irrigation and water management
- Farm equipment and tools
- Livestock care basics
- Organic farming methods
- Climate-smart agriculture

Always provide:
1. Clear, practical advice
2. Safety warnings when relevant
3. Suggestions to consult local agricultural extension services for region-specific guidance
4. Multiple solution options when possible

Keep responses helpful, concise (under 200 words), and encouraging. If you're unsure about something, say so and suggest consulting local experts.`;
  }

  /**
   * Set the API token - like giving the system your membership card
   */
  setApiToken(token) {
    this.apiToken = token;
  }

  /**
   * Check if API token is valid - like checking if your membership card is real
   */
  hasValidToken() {
    return this.apiToken && this.apiToken.startsWith('AIza') && this.apiToken.length > 30;
  }

  /**
   * Make a request to the Gemini API
   * This is like having a conversation with the AI expert
   */
  async query(userMessage, options = {}) {
    if (!this.hasValidToken()) {
      throw new Error('Invalid or missing Gemini API token');
    }

    // Prepare the conversation - like setting up a meeting with an expert
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${this.systemPrompt}\n\nUser Question: ${userMessage}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: options.temperature || 0.7, // How creative the AI should be (0.7 is balanced)
        maxOutputTokens: options.maxOutputTokens || 300, // Maximum length of response
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    };

    // Add timeout protection - like setting a timer for your meeting
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    requestOptions.signal = controller.signal;

    try {
      // Make the actual API call - like asking your question to the expert
      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiToken}`, 
        requestOptions
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return this.processResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  /**
   * Process the API response - like interpreting what the expert told you
   */
  processResponse(data) {
    try {
      // Gemini's response structure is different from Hugging Face
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const text = candidate.content.parts[0].text;
          return text.trim();
        }
      }
      
      // If we can't find the response in the expected format
      return 'I apologize, but I couldn\'t generate a proper response. Please try rephrasing your question.';
    } catch (error) {
      console.error('Error processing Gemini response:', error);
      return 'I encountered an error while processing the response. Please try again.';
    }
  }

  /**
   * Handle API errors - like dealing with problems during your conversation
   */
  handleError(error) {
    console.error('Gemini API Error:', error);

    if (error.name === 'AbortError') {
      return new Error('Request timeout. The AI is taking too long to respond. Please try again.');
    }

    if (error.message.includes('401') || error.message.includes('403')) {
      return new Error('Invalid API key. Please check your Gemini API key.');
    }

    if (error.message.includes('429')) {
      return new Error('Too many requests. Please wait a moment before trying again.');
    }

    if (error.message.includes('400')) {
      return new Error('Invalid request. Please try rephrasing your question.');
    }

    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return new Error('Gemini service is temporarily unavailable. Please try again in a few minutes.');
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new Error('Network error. Please check your internet connection.');
    }

    return error;
  }

  /**
   * Get agricultural advice with context - your main function for asking farming questions
   */
  async getAgriculturalAdvice(question, context = {}) {
    try {
      // Add any additional context to the question
      let enhancedQuestion = question;
      
      if (context.location) {
        enhancedQuestion += ` (Location: ${context.location})`;
      }
      if (context.cropType) {
        enhancedQuestion += ` (Crop: ${context.cropType})`;
      }
      if (context.season) {
        enhancedQuestion += ` (Season: ${context.season})`;
      }

      const response = await this.query(enhancedQuestion, {
        temperature: 0.6, // Slightly more focused for agricultural advice
        maxOutputTokens: 250
      });

      return this.cleanResponse(response);
    } catch (error) {
      console.error('Error getting agricultural advice:', error);
      throw error;
    }
  }

  /**
   * Clean and format the response - like editing the expert's advice to make it clearer
   */
  cleanResponse(response) {
    if (!response || typeof response !== 'string') {
      return 'I apologize, but I couldn\'t generate a proper response. Please try rephrasing your question.';
    }

    // Remove any unwanted prefixes that might come from the system prompt
    let cleaned = response
      .replace(/^(AgriChat:|Assistant:|AI:)/i, '')
      .trim();
    
    // Ensure proper capitalization
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    // Add period if missing and doesn't end with punctuation
    if (cleaned.length > 0 && !cleaned.match(/[.!?]$/)) {
      cleaned += '.';
    }
    
    return cleaned || 'I apologize, but I couldn\'t generate a proper response. Please try rephrasing your question.';
  }
}

/**
 * Mock API for demo purposes - same as before but with updated responses
 */
class MockAPI {
  constructor() {
    this.responses = [
      "For healthy soil, test your pH levels first. Most crops thrive in soil with a pH between 6.0-7.0. You can get a simple test kit from any garden center for about $10-15.",
      "Water management is crucial for crop success. Water deeply but less frequently to encourage deep root growth. Early morning watering (6-8 AM) reduces evaporation and prevents fungal diseases.",
      "Integrated Pest Management (IPM) is your best approach for pest control. Start with beneficial insects, companion planting, and crop rotation before considering chemical treatments. Always consult your local extension office for region-specific pest issues.",
      "Crop rotation prevents soil nutrient depletion and breaks pest cycles. Follow a simple rule: don't plant the same crop family in the same spot for at least 3 years. For example, rotate tomatoes → beans → lettuce → back to tomatoes.",
      "Composting creates 'black gold' for your soil. Mix 3 parts brown materials (dried leaves, paper) with 1 part green materials (kitchen scraps, grass clippings). Turn monthly and you'll have rich compost in 6-12 months.",
      "Companion planting can boost yields naturally. Try the 'Three Sisters' method: corn provides support for beans, beans fix nitrogen for corn and squash, and squash leaves shade the soil to retain moisture.",
      "Know your local frost dates! Plant cool-season crops (lettuce, peas) 2-4 weeks before the last spring frost. Warm-season crops (tomatoes, peppers) should wait until after the last frost date.",
      "Mulching is like giving your plants a blanket. Apply 2-3 inches of organic mulch around plants to retain moisture, suppress weeds, and regulate soil temperature. Straw, wood chips, and grass clippings work well."
    ];
  }

  async getAgriculturalAdvice(question) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    // Select response based on keywords in question
    let contextualResponse = this.getContextualResponse(question);
    
    return contextualResponse || this.getRandomResponse();
  }

  getContextualResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('tomato')) {
      return "For tomatoes: Plant after last frost, provide 6-8 hours of sunlight, bury 2/3 of the stem when transplanting to encourage strong roots, and water consistently to prevent blossom end rot. Stake or cage tall varieties.";
    }
    
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('bug') || lowerQuestion.includes('insect')) {
      return "For pest control: Start with identification - take photos and consult your local extension office. Use beneficial insects like ladybugs for aphids, neem oil for soft-bodied insects, and row covers for physical protection. Avoid broad-spectrum pesticides that harm beneficial insects.";
    }
    
    if (lowerQuestion.includes('soil') || lowerQuestion.includes('dirt') || lowerQuestion.includes('fertilizer')) {
      return "For soil health: Test your soil first ($15-25 for a complete test). Add compost annually, maintain pH 6.0-7.0 for most crops, and consider cover crops during off-seasons to add organic matter and prevent erosion.";
    }
    
    if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation') || lowerQuestion.includes('drought')) {
      return "For watering: Deep, infrequent watering is best. Water early morning to reduce evaporation and disease. Most vegetables need 1-2 inches per week. Use drip irrigation or soaker hoses for efficient water use, especially in dry climates.";
    }
    
    if (lowerQuestion.includes('organic') || lowerQuestion.includes('natural')) {
      return "For organic growing: Build healthy soil with compost, use beneficial insects for pest control, practice crop rotation, choose disease-resistant varieties, and mulch heavily. Organic doesn't mean pesticide-free - there are approved organic treatments when needed.";
    }
    
    return null;
  }

  getRandomResponse() {
    return this.responses[Math.floor(Math.random() * this.responses.length)];
  }
}

/**
 * API Manager - handles switching between real Gemini API and mock API
 */
class APIManager {
  constructor() {
    this.api = null;
    this.mockApi = new MockAPI();
    this.isDemoMode = true;
  }

  /**
   * Initialize with API token
   */
  initialize(apiToken = null) {
    if (apiToken && this.isValidGeminiToken(apiToken)) {
      this.api = new GeminiAPI(apiToken);
      this.isDemoMode = false;
      console.log('AgriChat: Gemini API initialized successfully ✅');
    } else {
      this.api = this.mockApi;
      this.isDemoMode = true;
      console.log('AgriChat: Demo mode active (no valid Gemini API key) 🎭');
    }
  }

  /**
   * Validate Gemini API token format
   */
  isValidGeminiToken(token) {
    return token && token.startsWith('AIza') && token.length > 30;
  }

  /**
   * Get agricultural advice
   */
  async getAgriculturalAdvice(question, context = {}) {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      return await this.api.getAgriculturalAdvice(question, context);
    } catch (error) {
      // If real API fails, fall back to mock
      if (!this.isDemoMode) {
        console.warn('Gemini API failed, falling back to demo mode:', error);
        this.api = this.mockApi;
        this.isDemoMode = true;
        return await this.api.getAgriculturalAdvice(question, context);
      }
      throw error;
    }
  }

  /**
   * Check if in demo mode
   */
  isInDemoMode() {
    return this.isDemoMode;
  }

  /**
   * Get API status
   */
  getStatus() {
    return {
      isDemoMode: this.isDemoMode,
      hasValidToken: this.api && this.api.hasValidToken ? this.api.hasValidToken() : false,
      apiProvider: this.isDemoMode ? 'Mock API' : 'Google Gemini'
    };
  }
}

// Create global API manager instance
window.AgriChatAPI = new APIManager();