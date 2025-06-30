//
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen  from '../screens/HomeScreen';
import WordEnrollPage from '../screens/WordEnrollPage';
import WordListScreen from '../screens/WordListScreen';

// 스크린 이름과 파라미터 타입을 선언
export type RootStackParamList = {
  Login: undefined;
  Home:  undefined;
  WordEnrollPage: undefined;
  WordList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="WordList" component={WordListScreen} />
        <Stack.Screen name="Home"  component={HomeScreen}  />
        <Stack.Screen name="WordEnrollPage"  component={WordEnrollPage}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
