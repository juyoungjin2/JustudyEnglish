// src/screens/WordEnrollPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from '../utils/axiosConfig';
import { fetchGlobalBooks, fetchCustomBooks } from '../services/bookService';
import { Book } from '../models/Book';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type WordEnrollNavProp = StackNavigationProp<RootStackParamList, 'WordEnroll'>;

export default function WordEnrollPage() {
  const navigation = useNavigation<WordEnrollNavProp>();

  // 입력 / 실패 관리
  const [wordInput, setWordInput] = useState('');
  const [failedItems, setFailedItems] = useState<string[]>([]);

  // 단어장 목록/선택
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // 등록 진행 상태
  const [isRegistering, setIsRegistering] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadBooks();
  }, []);

  /** Firestore에서 글로벌 + 내 커스텀 단어장 불러오기 */
  async function loadBooks() {
    setLoadingBooks(true);
    try {
      const [globalBooks, customBooks] = await Promise.all([
        fetchGlobalBooks(),
        fetchCustomBooks()
      ]);
      setBooks([...globalBooks, ...customBooks]);
    } catch (err: any) {
      console.error('loadBooks error:', err.message || err);
      Alert.alert(
        '단어장 로드 실패',
        `에러: ${err.message || '알 수 없는 오류'}`
      );
    } finally {
      setLoadingBooks(false);
    }
  }

  /** 서버에 단어 등록 요청 */
  async function handleRegister() {
    if (!selectedBook) {
      Alert.alert('Error', '단어장을 선택해주세요.');
      return;
    }
    const lines = wordInput
      .split('\n')
      .map(l => l.trim())
      .filter(l => l !== '');
    if (lines.length === 0) {
      Alert.alert('Error', '단어를 입력해주세요.');
      return;
    }

    setTotalCount(lines.length);
    setProgressCount(0);
    setFailedItems([]);
    setIsRegistering(true);

    const failures: string[] = [];
    await Promise.all(
      lines.map(async word => {
        try {
          await axios.post('/words/add', {
            word,
            bookId: selectedBook.bookId,
            bookTitle: selectedBook.bookTitle
          });
        } catch {
          failures.push(word);
        } finally {
          setProgressCount(p => p + 1);
        }
      })
    );

    setIsRegistering(false);
    if (failures.length) {
      setFailedItems(failures);
      Alert.alert(
        'Partial Success',
        `실패한 단어:\n${failures.join(', ')}`
      );
      setWordInput(failures.join('\n'));
    } else {
      Alert.alert('Success', '모든 단어 등록이 완료되었습니다.');
      setWordInput('');
    }
  }

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedBook(item);
        setModalVisible(false);
      }}
    >
      <Text>{item.bookTitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>단어 등록</Text>
      <TouchableOpacity
        style={styles.bookSelect}
        onPress={() => setModalVisible(true)}
      >
        <Text>
          {selectedBook ? selectedBook.bookTitle : '단어장 선택'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="여러 단어를 엔터로 구분해서 입력"
        value={wordInput}
        onChangeText={setWordInput}
        multiline
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={isRegistering}
      >
        {isRegistering ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>등록</Text>
        )}
      </TouchableOpacity>

      {isRegistering && (
        <Text style={styles.progressText}>
          {progressCount} / {totalCount}
        </Text>
      )}

      {failedItems.length > 0 && (
        <>
          <Text style={styles.subHeader}>등록 실패 단어</Text>
          <TextInput
            style={styles.input}
            value={failedItems.join('\n')}
            editable={false}
            multiline
          />
        </>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>단어장 선택</Text>
          {loadingBooks ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={books}
              keyExtractor={b => b.bookId}
              renderItem={renderBookItem}
            />
          )}
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
          >
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  bookSelect: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  registerButtonText: { color: '#fff', fontWeight: 'bold' },
  progressText: { textAlign: 'center', marginTop: 8 },
  modalContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  modalClose: { marginTop: 16, alignItems: 'center' },
});
