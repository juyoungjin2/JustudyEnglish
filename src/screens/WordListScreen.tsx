// src/screens/WordListScreen.tsx

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from '../utils/axiosConfig';
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
  const [playingId, setPlayingId] = useState<string | null>(null);

  // AudioRecorderPlayer 인스턴스
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

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

  const handlePlayWord = useCallback(
    async (word: string, id: string) => {
      setPlayingId(id);
      try {
        // 백엔드 /pronounce 호출
        const res = await axios.post('/pronounce', { sentence: word });
        const audioContent: string = res.data.audioContent;

        // base64 MP3 파일로 저장
        const filePath = `${RNFS.CachesDirectoryPath}/word_${Date.now()}.mp3`;
        await RNFS.writeFile(filePath, audioContent, 'base64');

        // AudioRecorderPlayer 로 재생
        await audioRecorderPlayer.startPlayer(filePath);
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener(e => {
          // 재생 완료 시 정리
          if (e.current_position === e.duration) {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            RNFS.unlink(filePath).catch(() => {});
            setPlayingId(null);
          }
        });
      } catch (err: any) {
        console.error('발음 재생 에러:', err);
        Alert.alert('발음 재생 실패', err.message);
        setPlayingId(null);
      }
    },
    [audioRecorderPlayer]
  );

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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <View>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handlePlayWord(item.word, item.id)}
                disabled={playingId === item.id}
                style={styles.iconButton}
              >
                {playingId === item.id ? (
                  <ActivityIndicator />
                ) : (
                  <Ionicons
                    name="volume-high-outline"
                    size={24}
                    color={playingId === item.id ? 'blue' : 'black'}
                  />
                )}
              </TouchableOpacity>
            </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  iconButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
