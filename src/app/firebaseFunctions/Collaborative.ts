import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, getDoc, writeBatch, query, where } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);