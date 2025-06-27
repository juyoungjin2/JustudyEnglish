//backend\routes\wordgoogleapi.js

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const axios = require('axios');
const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// 번역은 이미 있는 거라 패스하고, 발음만:
// POST /api/pronounce
router.post('/pronounce', async (req, res) => {
  const { sentence } = req.body;
  try {
    const ttsResponse = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
      {
        input: { text: sentence },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Wavenet-D',
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.8,
          pitch: 0.0,
          volumeGainDb: 0.0,
        },
      }
    );
    res.json({ audioContent: ttsResponse.data.audioContent });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
