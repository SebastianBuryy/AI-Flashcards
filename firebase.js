// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: "flashcardsaas-20c35.firebaseapp.com",
    projectId: "flashcardsaas-20c35",
    storageBucket: "flashcardsaas-20c35.appspot.com",
    messagingSenderId: "135880742377",
    appId: "1:135880742377:web:ffc6ede9649b65187f2778",
    measurementId: "G-01WCJ59HLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };