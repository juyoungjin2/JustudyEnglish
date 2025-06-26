// src/services/bookService.ts
import { firestore, auth } from './firebase';
import { Book, BookData } from '../models/Book';
import { Word, WordData } from '../models/Word';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const globalCol = firestore().collection('wordbooks');
const customCol = (uid: string) =>
  firestore().collection(`users/${uid}/customWordbooks`);

// 1) 글로벌 단어장 가져오기
export const fetchGlobalBooks = async (): Promise<Book[]> => {
  const snap = await globalCol.orderBy('bookOrder').get();
  return snap.docs.map(doc => {
    const data = doc.data() as BookData; 
    return { bookId: doc.id, ...data };
  });
};

// 2) 내 커스텀 단어장 가져오기
export const fetchCustomBooks = async (): Promise<Book[]> => {
  const uid = auth().currentUser!.uid;
  const snap = await customCol(uid).orderBy('bookOrder').get();
  return snap.docs.map(doc => {
    const data = doc.data() as BookData;
    return { bookId: doc.id, ...data };
  });
};

// 3) 단어장 생성 (custom only)
export const createCustomBook = async (book: Omit<BookData, 'createdAt' | 'updatedAt'>): Promise<string> => {
  const uid = auth().currentUser!.uid;
  const now = firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp;
  const ref = await customCol(uid).add({
    ...book,
    userId: uid,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
};

// 4) 단어장 업데이트
export const updateBook = async (
  bookId: string,
  data: Partial<Pick<BookData, 'bookTitle' | 'bookOrder' | 'bookCover' | 'tags'>>
): Promise<void> => {
  const uid = auth().currentUser!.uid;
  await customCol(uid).doc(bookId).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

// 5) 단어 가져오기 by 책 ID
export const fetchWordsByBookId = async (bookId: string): Promise<Word[]> => {
  const uid = auth().currentUser!.uid;

  // 글로벌 단어 하위 콜렉션
  const globalWordsSnap = await globalCol
    .doc(bookId)
    .collection('words')
    .orderBy('createdAt')
    .get();
  const globalWords = globalWordsSnap.docs.map(doc => {
    const data = doc.data() as WordData;
    return { id: doc.id, ...data };
  });

  // 커스텀 단어 하위 콜렉션
  const customWordsSnap = await customCol(uid)
    .doc(bookId)
    .collection('words')
    .orderBy('createdAt')
    .get();
  const customWords = customWordsSnap.docs.map(doc => {
    const data = doc.data() as WordData;
    return { id: doc.id, ...data };
  });

  return [...globalWords, ...customWords];
};
