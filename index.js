// index.js
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Ionicons from 'react-native-vector-icons/Ionicons';

Ionicons.loadFont(); // ← 이거 추가

AppRegistry.registerComponent(appName, () => App);
