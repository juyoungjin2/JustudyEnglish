// backend/routes/words.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const admin = require('firebase-admin');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Firebase Admin 초기화 (한 번만)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}
const db = admin.firestore();

// ─────────────────────────────────────────────────────────────
// 1) 단어장 목록 조회 (GET /api/books)
// ─────────────────────────────────────────────────────────────
router.get('/books', async (req, res) => {
  try {
    const snap = await db.collection('wordbooks')
      .orderBy('bookOrder')
      .get();
    const books = snap.docs.map(doc => ({
      bookId: doc.id,
      ...doc.data()
    }));
    res.json(books);
  } catch (e) {
    console.error('Error fetching books:', e);
    res.status(500).json({ error: '책 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// ─────────────────────────────────────────────────────────────
// 2) 단어 등록 (POST /api/words/add)
//    OpenAI로부터 JSON 응답을 받아 Firestore에 저장
// ─────────────────────────────────────────────────────────────
router.post('/words/add', async (req, res) => {
  const { word, bookId, bookTitle } = req.body;
  if (!word || !bookId || !bookTitle) {
    return res.status(400).json({ error: 'word, bookId, bookTitle가 필요합니다.' });
  }

  try {
    // 1) OpenAI 호출
    const messages = [
      {
        role: 'system',
        content: 'You are an assistant that returns JSON with fields: word, korean, wordClass, example[], similarWord[], oppositeWord[], transformation[].'
      },
      {
        role: 'user',
        content: `영한 사전에서 찾은 ${word}의 의미와 예문, 유의어, 반의어, 형태 변형을 JSON으로 반환해줘.`
      }
    ];
    const aiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: 'gpt-3.5-turbo', messages, temperature: 0.2, max_tokens: 1000 },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    // 2) 응답 파싱
    let text = aiRes.data.choices[0].message.content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
      .replace(/,\s*([\]}])/g, '$1');
    const data = JSON.parse(text);

    // 3) Firestore에 저장
    const docRef = await db.collection('words').add({
      word: data.word,
      korean: data.korean,
      wordClass: data.wordClass,
      example: data.example,
      similarWord: data.similarWord,
      oppositeWord: data.oppositeWord,
      transformation: data.transformation,
      studyDate: admin.firestore.FieldValue.serverTimestamp(),
      bookId,
      bookTitle
    });

    res.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('Error adding word:', err);
    res.status(500).json({ error: '단어 등록 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
