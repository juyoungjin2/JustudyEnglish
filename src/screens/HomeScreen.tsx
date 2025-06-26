// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet, Alert,
  FlatList, Image, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../services/firebase';
import { fetchGlobalBooks, fetchCustomBooks } from '../services/bookService';
import { Book } from '../models/Book';
import { RootStackParamList } from '../types';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 홈 진입 시 글로벌 + 커스텀 단어장 불러오기
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const globalBooks = await fetchGlobalBooks();
        const customBooks = await fetchCustomBooks();
        setBooks(
          [...globalBooks, ...customBooks]
            .sort((a, b) => a.bookOrder - b.bookOrder)
        );
      } catch (e: any) {
        Alert.alert('데이터 로드 실패', e.message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (e: any) {
      Alert.alert('로그아웃 실패', e.message);
    }
  };

  // 단어장 아이템 렌더
  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity style={styles.bookItem}>
      <Image source={{ uri: item.bookCover }} style={styles.bookCover} />
      <Text style={styles.bookTitle}>{item.bookTitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>환영합니다!</Text>
      <Button title="로그아웃" onPress={handleLogout} />

      {loading
        ? <Text>로딩 중...</Text>
        : (
          <FlatList
            data={books}
            keyExtractor={item => item.bookId}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  welcome: { fontSize: 28, marginBottom: 20 },
  list: { paddingTop: 20 },
  bookItem: { marginBottom: 16, alignItems: 'center' },
  bookCover: { width: 120, height: 160, borderRadius: 4, marginBottom: 8 },
  bookTitle: { fontSize: 16, textAlign: 'center' },
});
