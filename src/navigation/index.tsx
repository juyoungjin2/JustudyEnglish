import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen  from '../screens/HomeScreen';

// 스크린 이름과 파라미터 타입을 선언
export type RootStackParamList = {
  Login: undefined;
  Home:  undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home"  component={HomeScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
