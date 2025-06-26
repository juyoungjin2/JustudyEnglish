// src/services/firebase.ts

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// firebase.app() 같은 게 필요하면 아래처럼 import 할 수 있지만,
// 현재는 auth, firestore만 쓰므로 생략해도 된다.
// import app from '@react-native-firebase/app';

export { auth, firestore };
