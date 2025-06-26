import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet, Text, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../services/firebase';
import { RootStackParamList } from '../types';

type LoginNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const credential = await auth().signInWithEmailAndPassword(email, password);
      const user = credential.user;
      if (!user.emailVerified) {
        await auth().signOut();
        Alert.alert(
          '인증 필요',
          '이메일 인증돼야 로그인 가능해. 인증 메일 다시 보낼까?',
          [
            {
              text: '예',
              onPress: async () => {
                await user.sendEmailVerification();
                Alert.alert('메일 전송됨', '인증 메일을 다시 보냈어.');
              },
            },
            { text: '아니요' },
          ]
        );
        return;
      }
      Alert.alert('로그인 성공');
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('로그인 실패', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        placeholder="이메일"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="비밀번호"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="로그인" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('SignUp')}
      >
        회원가입 하기
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    height: 40, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 4, marginBottom: 12, paddingHorizontal: 8
  },
  link: { marginTop: 16, color: '#0066cc', textAlign: 'center' },
});
