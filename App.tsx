import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import WordListScreen from './src/screens/WordListScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="WordList" 
          component={WordListScreen} 
          options={{ title: '단어장 단어' }} 
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '로그인' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: '회원가입' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
