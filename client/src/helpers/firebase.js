import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";

import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "mernblog-7987a.firebaseapp.com",
  projectId: "mernblog-7987a",
  storageBucket: "mernblog-7987a.firebasestorage.app",
  messagingSenderId: "942299095991",
  appId: "1:942299095991:web:0e969d81ea73e5a1947e32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)


const provider = new GoogleAuthProvider()

export {auth , provider}