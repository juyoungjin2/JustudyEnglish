// src/models/Word.ts
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// 예문 타입 정의
export type Example = {
  sentence: string;
  translateKorean: string;
};

// 유의어/반의어 타입 정의
export type RelatedWord = {
  word: string;
  korean: string;
  nuance: string;
};

// 내가 만든 예문 타입 정의
export type MyExample = {
  word: string;
};

// Firestore에 저장되는 단어 데이터 타입
export type WordData = {
  bookId: string;                         // 단어가 속한 단어장 ID
  word: string;                           // 단어 텍스트
  meaning: string;                        // 단어 뜻 (Mongoose의 korean)
  wordClass?: string;                     // 품사
  example?: Example[];                    // 예문 배열
  similarWord?: RelatedWord[];            // 유의어 배열
  oppositeWord?: RelatedWord[];           // 반의어 배열
  myExample?: MyExample[];                // 내가 만든 예문 배열
  studyDate?: string;                     // 학습 날짜 (문자열)
  reviewDate?: string;                    // 복습 날짜 (문자열)
  isFinish?: string;                      // 완료 여부 ("Yes"/"No")
  reviewTryNum?: number;                  // 복습 시도 횟수
  star?: number;                          // 별점
  isbn?: string;                          // 책 ISBN
  bookName?: string;                      // 책 이름
  day?: string;                           // 학습 요일
  transformation?: string[];              // 단어 변형 리스트
  isHard?: number | null;                 // 난이도 (1: 어렵다, null/0: 보통)
  // 생성/수정 타임스탬프 (선택)
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
};

// 화면에서 사용할 Word 타입 (문서 ID 포함)
export type Word = WordData & {
  id: string;
};
