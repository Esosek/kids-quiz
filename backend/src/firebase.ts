// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import config from './config'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: 'kids-quiz-c9ae5.firebaseapp.com',
  projectId: 'kids-quiz-c9ae5',
  storageBucket: 'kids-quiz-c9ae5.firebasestorage.app',
  messagingSenderId: '603420408123',
  appId: '1:603420408123:web:9c8e0c5cbafa8902f85f1e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
