// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABVJbx1dJYnazpxtynDHN9udXmqPqcUUU",
  authDomain: "nft-datastorage.firebaseapp.com",
  projectId: "nft-datastorage",
  storageBucket: "nft-datastorage.appspot.com",
  messagingSenderId: "201738102483",
  appId: "1:201738102483:web:917059dd580704558c1626"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);