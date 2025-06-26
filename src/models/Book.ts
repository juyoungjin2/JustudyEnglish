//src\models\Book.ts

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Firestore에 저장되는 순수 데이터 타입
export type BookData = {
  bookTitle: string;
  bookType: 'global' | 'custom';
  bookOrder: number;
  bookCover: string;
  userId?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
  wordCount?: number;
  tags?: string[];
};

// 화면에서 사용할 Book 타입 (문서 ID 포함)
export type Book = BookData & {
  bookId: string;
};
