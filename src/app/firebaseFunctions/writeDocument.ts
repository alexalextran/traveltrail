import { deleteObject, getStorage, ref } from "firebase/storage";
import { app } from "../firebase";
import { getFirestore, collection, doc, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc, getDocs, where, query } from "firebase/firestore";

// firebaseOperations.ts

// Import Firestore and your Firebase app configuration

// Get a Firestore instance
const db = getFirestore(app);

// Modify writeToFirestore to return the document ID
export const writeToFirestore = async (userID: string, data: any): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, `users/${userID}/pins`), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to write document");
  }
};

export const deleteFromFirestore = async (collectionName: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const imageUrls = data.imageUrls || [];

      // Delete images from storage
      await deleteImagesFromStorage(imageUrls);

      // Find and update all lists containing this pin
      const userListsRef = collection(db, `users/${data.userID}/lists`);
      const listsQuery = query(userListsRef, where("pins", "array-contains", docId));
      const listsSnapshot = await getDocs(listsQuery);

      listsSnapshot.forEach(async (listDoc) => {
        await updateDoc(listDoc.ref, {
          pins: arrayRemove(docId)
        });
        console.log(`Pin removed from list: ${listDoc.id}`);
      });

      // Delete the document from Firestore
      await deleteDoc(docRef);
      console.log("Document and images deleted with ID: ", docId);
    } else {
      console.error("No such document with ID: ", docId);
    }
  } catch (error) {
    console.error("Error deleting document and images: ", error);
    throw new Error("Failed to delete document and images");
  }
};


export const updateToFirestore = async (collectionName: string, data: any): Promise<void> => {
  try {
    // Create a reference to the document to update
    const docRef = doc(db, collectionName, data.id);
    // Update the document
    await updateDoc(docRef, {
      title: data.title,
      address: data.address,
      description: data.description,
      category: data.category,
      visited: data.visited,
      lat: data.lat,
      lng: data.lng,
    });
    console.log("Document updated with ID: ", data.id);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export const addImageReferenceToFirestore = async (collectionName: string, docId: string, imageURL: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      imageUrls: arrayUnion(imageURL),  // Use arrayUnion to add the new URL to the array
    });
  } catch (error) {
    console.error('Error adding image reference to document: ', error);
  }
};



export const removeImageReferenceFromFirestore = async (collectionName: string, docId: string, imageUrl: string): Promise<void> => {
  try {
    const decodedUrl = decodeURIComponent(imageUrl);
    const url = new URL(decodedUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const fileName = segments[6].replace(/%20/g, ' ');


    
    const storagePath = `${segments[5]}/${fileName}`;
    const imageRef = ref(getStorage(app), storagePath);
    await deleteObject(imageRef);

    const docRef = doc(db, collectionName, docId);

    await updateDoc(docRef, {
      imageUrls: arrayRemove(imageUrl)
    });


    console.log("Image URL removed from document:", imageUrl);
  } catch (error) {
    console.error("Error removing image reference from document:", error);
    throw new Error("Failed to remove image reference");
  }
};



const deleteImagesFromStorage = async (imageUrls: string[]) => {
  const storage = getStorage(app);
  const deletePromises = imageUrls.map(async (imageUrl) => {
    const decodedUrl = decodeURIComponent(imageUrl);
    const url = new URL(decodedUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const fileName = segments[6].replace(/%20/g, ' ');

    const storagePath = `${segments[5]}/${fileName}`;
    console.log(storagePath)
    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);
  });

  await Promise.all(deletePromises);
};
