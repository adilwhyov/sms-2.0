// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC3RzyblsZTeFM1Qy_60FZ6ZjdasfD2yQ",
  authDomain: "adilwhyov.firebaseapp.com",
  databaseURL: "https://adilwhyov-default-rtdb.firebaseio.com",
  projectId: "adilwhyov",
  storageBucket: "adilwhyov.appspot.com",
  messagingSenderId: "780959026674",
  appId: "1:780959026674:web:26c947984611ecde68af6b",
  measurementId: "G-HZE48K1GBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);