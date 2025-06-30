// backend/server.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

// Google 관련 라우트 (/api/translate, /api/pronounce 등)
const wordGoogleApiRouter = require('./routes/wordgoogleapi');
// Firestore 연동 단어/단어장 라우트 (/api/books, /api/words/add)
const wordsRouter = require('./routes/words');

const app = express();
app.use(cors());
app.use(express.json());

// Google API 라우터
app.use('/api', wordGoogleApiRouter);

// Firestore books/words 라우터
app.use('/api', wordsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
