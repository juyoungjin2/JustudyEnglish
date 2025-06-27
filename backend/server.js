//backend\server.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const wordGoogleApiRouter = require('./routes/wordgoogleapi');

const app = express();
app.use(cors());
app.use(express.json());
// /api/translate, /api/pronounce 라우트 등록
app.use('/api', wordGoogleApiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
