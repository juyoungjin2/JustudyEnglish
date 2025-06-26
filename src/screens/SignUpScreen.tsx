// src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet, Text, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../services/firebase';
import { RootStackParamList } from '../types';

type SignUpNavProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpNavProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = async () => {
    if (password !== confirm) {
      Alert.alert('비밀번호가 일치하지 않아');
      return;
    }
    try {
      const credential = await auth().createUserWithEmailAndPassword(email, password);
      await credential.user.sendEmailVerification();
      Alert.alert(
        '회원가입 완료',
        '인증 이메일을 보냈어. 메일함 확인 후 로그인해줘.'
      );
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('회원가입 실패', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
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
      <TextInput
        placeholder="비밀번호 확인"
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />
      <Button title="회원가입" onPress={handleSignUp} />
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
});
