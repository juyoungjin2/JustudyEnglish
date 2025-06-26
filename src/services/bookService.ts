// src/services/bookService.ts

import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { Book, BookData } from '../models/Book';
import { Word, WordData } from '../models/Word';

const db = getFirestore();
const auth = getAuth();

// 1) 글로벌 단어장 가져오기
export const fetchGlobalBooks = async (): Promise<Book[]> => {
  const colRef = collection(db, 'wordbooks');
  const q = query(colRef, orderBy('bookOrder'));
  const snap = await getDocs(q);
  return snap.docs.map(docSnap => ({
    bookId: docSnap.id,
    ...(docSnap.data() as BookData)
  }));
};

// 2) 내 커스텀 단어장 가져오기
export const fetchCustomBooks = async (): Promise<Book[]> => {
  const uid = auth.currentUser!.uid;
  const colRef = collection(db, 'users', uid, 'customWordbooks');
  const q = query(colRef, orderBy('bookOrder'));
  const snap = await getDocs(q);
  return snap.docs.map(docSnap => ({
    bookId: docSnap.id,
    ...(docSnap.data() as BookData)
  }));
};

// 3) 단어장 생성 (custom only)
export const createCustomBook = async (
  book: Omit<BookData, 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const uid = auth.currentUser!.uid;
  const colRef = collection(db, 'users', uid, 'customWordbooks');
  const now = serverTimestamp();
  const ref = await addDoc(colRef, {
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
  const uid = auth.currentUser!.uid;
  const docRef = doc(db, 'users', uid, 'customWordbooks', bookId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// 5) 단어 가져오기 by 책 ID
export const fetchWordsByBookId = async (bookId: string): Promise<Word[]> => {
  const uid = auth.currentUser!.uid;

  // 글로벌 단어
  const globalRef = collection(db, 'wordbooks', bookId, 'words');
  const globalSnap = await getDocs(
    query(globalRef, orderBy('createdAt'))
  );
  const globalWords = globalSnap.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as WordData)
  }));

  // 커스텀 단어
  const customRef = collection(db, 'users', uid, 'customWordbooks', bookId, 'words');
  const customSnap = await getDocs(
    query(customRef, orderBy('createdAt'))
  );
  const customWords = customSnap.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as WordData)
  }));

  return [...globalWords, ...customWords];
};
