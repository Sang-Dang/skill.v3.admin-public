// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { fromEnv } from '@/config/env.config'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: fromEnv.APP_FB_API_KEY,
    authDomain: fromEnv.APP_FB_AUTH_DOMAIN,
    projectId: fromEnv.APP_FB_PROJECT_ID,
    storageBucket: fromEnv.APP_FB_STORAGE_BUCKET,
    messagingSenderId: fromEnv.APP_FB_MESSAGING_SENDER_ID,
    appId: fromEnv.APP_FB_APP_ID,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
