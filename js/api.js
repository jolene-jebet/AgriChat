 /**
 * Hugging Face API Integration for AgriChat
 * Handles communication with Hugging Face Transformers API
 */

class HuggingFaceAPI {
  constructor(apiToken = null) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api-inference.huggingface.co';
    this.model = 'gpt2'; // Default model
    this.timeout = 10000; // 10 seconds
    this.maxRetries = 3;
    
    // Agricultural context prompt
    this.systemPrompt = `You are AgriChat, an expert agricultural assistant. Provide practical, 
    actionable advice about crop planting, farming techniques, pest management, soil health, 
    and sustainable agriculture. Keep responses concise and helpful. Always prioritize safety 
    and recommend consulting local agricultural extensions for specific chemical treatments.`;
  }

  /**
   * Set the API token
   */
  setApiToken(token) {
    this.apiToken = token;
  }

  /**
   * Check if API token is valid
   */
  hasValidToken() {
    return this.apiToken && this.apiToken.startsWith('hf_') && this.apiToken.length > 20;
  }

  /**
   * Make a request to the Hugging Face API
   */
  async query(inputs, options = {}) {
    if (!this.hasValidToken()) {
      throw new Error('Invalid or missing API token');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: inputs,
        parameters: {
          max_length: options.maxLength || 150,
          temperature: options.temperature || 0.7,
          do_sample: true,
          ...options.parameters
        }
      })
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    requestOptions.signal = controller.signal;

    try {
      const response = await fetch(`${this.baseURL}/models/${this.model}`, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.processResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  /**
   * Process the API response
   */
  processResponse(data) {
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text || data[0].text || 'I apologize, but I couldn\'t generate a response. Please try again.';
    }
    
    if (data.generated_text) {
      return data.generated_text;
    }
    
    if (data.text) {
      return data.text;
    }

    return 'I apologize, but I couldn\'t generate a response. Please try again.';
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.name === 'AbortError') {
      return new Error('Request timeout. Please try again.');
    }

    if (error.message.includes('401')) {
      return new Error('Invalid API token. Please check your Hugging Face token.');
    }

    if (error.message.includes('429')) {
      return new Error('Rate limit exceeded. Please wait a moment before trying again.');
    }

    if (error.message.includes('500')) {
      return new Error('Server error. Please try again later.');
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new Error('Network error. Please check your internet connection.');
    }

    return error;
  }

  /**
   * Get agricultural advice with context
   */
  async getAgriculturalAdvice(question, context = {}) {
    try {
      // Enhance the question with agricultural context
      const enhancedInput = `${this.systemPrompt}\n\nUser Question: ${question}`;
      
      const response = await this.query(enhancedInput, {
        maxLength: 200,
        temperature: 0.6
      });

      return this.cleanResponse(response);
    } catch (error) {
      console.error('Error getting agricultural advice:', error);
      throw error;
    }
  }

  /**
   * Clean and format the response
   */
  cleanResponse(response) {
    // Remove the system prompt from the response if it appears
    let cleaned = response.replace(this.systemPrompt, '').trim();
    
    // Remove any duplicate text
    const sentences = cleaned.split('. ');
    const uniqueSentences = [...new Set(sentences)];
    cleaned = uniqueSentences.join('. ');
    
    // Ensure proper capitalization
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    // Add period if missing
    if (cleaned.length > 0 && !cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
      cleaned += '.';
    }
    
    return cleaned || 'I apologize, but I couldn\'t generate a proper response. Please try rephrasing your question.';
  }
}

/**
 * Mock API for demo purposes when no real API token is available
 */
class MockAPI {
  constructor() {
    this.responses = [
      "Based on your question, I'd recommend checking your soil pH levels first. Most crops prefer a pH between 6.0 and 7.0. You can test this with a simple soil test kit from your local garden center.",
      "For optimal growth, ensure your plants receive adequate water, but avoid overwatering. A good rule of thumb is to water when the top inch of soil feels dry to the touch.",
      "Pest management is crucial for healthy crops. Consider using integrated pest management (IPM) techniques, which combine biological, cultural, and chemical controls for the most effective results.",
      "Crop rotation is an excellent practice for maintaining soil health. Try rotating between different plant families each season to prevent nutrient depletion and reduce pest problems.",
      "Composting is a great way to improve soil fertility naturally. Mix green materials (like kitchen scraps) with brown materials (like leaves) in a 1:3 ratio for best results.",
      "For better yields, consider companion planting. Some plants grow better together, like tomatoes with basil or corn with beans, which can help with pest control and nutrient sharing.",
      "Timing is everything in farming. Check your local frost dates and plant accordingly. Most warm-season crops should be planted after the last frost date in your area.",
      "Mulching around your plants helps retain moisture, suppress weeds, and regulate soil temperature. Organic mulches like straw or wood chips also add nutrients as they decompose."
    ];
  }

  async getAgriculturalAdvice(question) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Return a random response
    const randomResponse = this.responses[Math.floor(Math.random() * this.responses.length)];
    
    // Add some context based on keywords in the question
    let contextualResponse = randomResponse;
    
    if (question.toLowerCase().includes('tomato')) {
      contextualResponse = "For tomatoes, ensure they receive at least 6-8 hours of direct sunlight daily. Plant them deep, burying about 2/3 of the stem to encourage strong root development. Water consistently to prevent blossom end rot.";
    } else if (question.toLowerCase().includes('pest') || question.toLowerCase().includes('bug')) {
      contextualResponse = "For pest control, start with the least toxic methods. Hand-picking larger pests, using insecticidal soap for soft-bodied insects, and encouraging beneficial insects like ladybugs can be very effective.";
    } else if (question.toLowerCase().includes('soil') || question.toLowerCase().includes('dirt')) {
      contextualResponse = "Healthy soil is the foundation of good farming. Test your soil annually and amend it with organic matter like compost. Good soil should be loose, well-draining, and rich in organic matter.";
    } else if (question.toLowerCase().includes('water') || question.toLowerCase().includes('irrigation')) {
      contextualResponse = "Water deeply but less frequently to encourage deep root growth. Early morning is the best time to water, as it reduces evaporation and helps prevent fungal diseases. Aim for about 1 inch of water per week for most crops.";
    }
    
    return contextualResponse;
  }
}

/**
 * API Manager - Handles switching between real and mock API
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
    if (apiToken && AgriChatUtils.ValidationUtils.isValidApiToken(apiToken)) {
      this.api = new HuggingFaceAPI(apiToken);
      this.isDemoMode = false;
      console.log('AgriChat: Real API initialized');
    } else {
      this.api = this.mockApi;
      this.isDemoMode = true;
      console.log('AgriChat: Demo mode initialized');
    }
  }

  /**
   * Get agricultural advice
   */
  async getAgriculturalAdvice(question) {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      return await this.api.getAgriculturalAdvice(question);
    } catch (error) {
      // If real API fails, fall back to mock
      if (!this.isDemoMode) {
        console.warn('Real API failed, falling back to demo mode:', error);
        this.api = this.mockApi;
        this.isDemoMode = true;
        return await this.api.getAgriculturalAdvice(question);
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
      hasValidToken: this.api && this.api.hasValidToken ? this.api.hasValidToken() : false
    };
  }
}

// Create global API manager instance
window.AgriChatAPI = new APIManager();
