import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBhVsmay9M40w6HYimPgxUxVHnvWAZHrnQ",
  authDomain: "bimdev3-1bd63.firebaseapp.com",
  projectId: "bimdev3-1bd63",
  storageBucket: "bimdev3-1bd63.firebasestorage.app",
  messagingSenderId: "477129223185",
  appId: "1:477129223185:web:e5ffcbf4c6cff75dad15b0",
  measurementId: "G-WXZ61RLW4M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestoreDB = Firestore.getFirestore(app);

export function getCollection<T>(path: string) {
  return Firestore.collection(firestoreDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(path: string, id: string) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`)
  await Firestore.deleteDoc(doc)
}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`)
  await Firestore.updateDoc(doc, data)
}
