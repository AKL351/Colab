// Firebase Configuration for Colab
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_M3l_LtR_cpGlSinKPMXlEMc3vYBJ-iE",
  authDomain: "colab-ded5d.firebaseapp.com",
  projectId: "colab-ded5d",
  storageBucket: "colab-ded5d.firebasestorage.app",
  messagingSenderId: "61975234698",
  appId: "1:61975234698:web:b4d94fa4a57ca2ab1f4573"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Log a user search to Firestore
export async function logSearch(userEmail, userName, message) {
  try {
    await addDoc(collection(db, "searches"), {
      email: userEmail || "anonymous",
      name: userName || "Unknown",
      message,
      timestamp: new Date().toISOString(),
      ts: Date.now()
    });
  } catch (e) {
    console.error("Error logging search:", e);
  }
}

// Save user profile to Firestore
export async function saveUserProfile(userEmail, data) {
  try {
    await setDoc(doc(db, "users", userEmail.replace(/[.#$[\]]/g, '_')), data, { merge: true });
  } catch (e) {
    console.error("Error saving profile:", e);
  }
}

// Get user profile from Firestore
export async function getUserProfile(userEmail) {
  try {
    const snap = await getDoc(doc(db, "users", userEmail.replace(/[.#$[\]]/g, '_')));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("Error getting profile:", e);
    return null;
  }
}

// Upload profile picture to Firebase Storage
export async function uploadProfilePic(userEmail, file) {
  try {
    const storageRef = ref(storage, 'profiles/' + userEmail.replace(/[.#$[\]]/g, '_'));
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await saveUserProfile(userEmail, { profilePic: url });
    return url;
  } catch (e) {
    console.error("Error uploading pic:", e);
    return null;
  }
}

// Get all searches (admin only)
export async function getAllSearches() {
  try {
    const q = query(collection(db, "searches"), orderBy("ts", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error("Error getting searches:", e);
    return [];
  }
}

export { db, storage };
