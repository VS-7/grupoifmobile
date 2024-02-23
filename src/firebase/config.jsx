import { initializeApp } from "firebase/app";
/*import { getAnalytics } from "firebase/analytics";*/
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB8T1GzAyGByjhY2ufRcURa276x8SYSaUE",
  authDomain: "ifmobile-dd43d.firebaseapp.com",
  projectId: "ifmobile-dd43d",
  storageBucket: "ifmobile-dd43d.appspot.com",
  messagingSenderId: "431822256725",
  appId: "1:431822256725:web:edd69cd59353afc1c472dc",
  measurementId: "G-CBYDJ1CFK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/*const analytics = getAnalytics(app);*/

const db = getFirestore(app);
export const storage = getStorage(app);

export { db };

