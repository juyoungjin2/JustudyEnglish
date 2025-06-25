// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = () => {
    // TODO: Firebase Auth signOut 로직 추가
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Justudy English에 오신 걸 환영해요!</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '500', marginBottom: 24, textAlign: 'center' },
  button: { backgroundColor: '#e94e77', paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
