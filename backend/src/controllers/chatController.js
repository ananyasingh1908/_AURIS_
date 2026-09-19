import { generateGeminiResponse } from '../services/geminiService.js';

export const chat = async (req, res) => {
  const { message, history = [], context = {} } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message parameter is required and cannot be empty.'
    });
  }

  try {
    const result = await generateGeminiResponse({
      message: message.trim(),
      history,
      context
    });

    return res.json({
      success: true,
      reply: result.reply,
      model: result.modelUsed,
      timestamp: result.timestamp
    });
  } catch (err) {
    console.error('Gemini Chat Controller Error:', err.message);

    return res.status(500).json({
      success: false,
      message: err.message || 'Error processing request with Gemini AI'
    });
  }
};
