// src/models/Word.ts
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Firestore에 저장되는 단어 데이터 타입
export type WordData = {
  // 단어가 속한 단어장 ID 매핑
  bookId: string;
  // 단어 텍스트
  word: string;
  // 단어 뜻
  meaning: string;
  // 생성/수정 타임스탬프 (선택)
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
};

// 화면에서 사용할 Word 타입 (문서 ID 포함)
export type Word = WordData & {
  id: string;
};