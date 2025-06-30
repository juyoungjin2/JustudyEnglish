// backend/routes/words.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}
const db = admin.firestore();

// 1) 단어장 목록 조회
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

// 2) 단어 등록 (서브컬렉션에 저장, createdAt/updatedAt 자동 추가)
router.post('/words/add', async (req, res) => {
  const { word, bookId, bookTitle } = req.body;
  if (!word || !bookId || !bookTitle) {
    return res.status(400).json({ error: 'word, bookId, bookTitle가 필요합니다.' });
  }

  try {
    // OpenAI 호출
    const messages = [
      { role: 'system', content: 'You are an assistant that returns JSON with fields: word, korean, wordClass, example[], similarWord[], oppositeWord[], transformation[].' },
      { role: 'user', content: `영한 사전에서 찾은 ${word}의 의미와 예문, 유의어, 반의어, 형태 변형을 JSON으로 반환해줘.` }
    ];
    const aiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: 'gpt-3.5-turbo', messages, temperature: 0.2, max_tokens: 1000 },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    // 응답 파싱
    let text = aiRes.data.choices[0].message.content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
      .replace(/,\s*([\]}])/g, '$1');
    const data = JSON.parse(text);

    // Firestore 서브컬렉션에 저장 (createdAt, updatedAt 자동)
    const wordsCol = db.collection('wordbooks').doc(bookId).collection('words');
    const now = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await wordsCol.add({
      word: data.word,
      korean: data.korean,
      wordClass: data.wordClass,
      example: data.example,
      similarWord: data.similarWord,
      oppositeWord: data.oppositeWord,
      transformation: data.transformation,
      studyDate: now,
      createdAt: now,
      updatedAt: now,
      bookId,
      bookTitle
    });

    console.log(`새 단어 저장: wordbooks/${bookId}/words/${docRef.id}`);
    res.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('Error adding word:', err);
    res.status(500).json({ error: '단어 등록 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
