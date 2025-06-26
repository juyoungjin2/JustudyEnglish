import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Word } from '../models/Word';
import { fetchWordsByBookId } from '../services/bookService';

type WordListRouteProp = RouteProp<RootStackParamList, 'WordList'>;
type WordListNavProp = StackNavigationProp<RootStackParamList, 'WordList'>;

export default function WordListScreen() {
  const route = useRoute<WordListRouteProp>();
  const navigation = useNavigation<WordListNavProp>();
  const { bookId } = route.params;

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const list = await fetchWordsByBookId(bookId);
        setWords(list);
      } catch (e: any) {
        Alert.alert('단어 로드 실패', e.message);
      } finally {
        setLoading(false);
      }
    };
    loadWords();
  }, [bookId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.meaning}>{item.meaning}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 12,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meaning: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
