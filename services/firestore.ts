// services/firestore.ts
import { collection, getDocs, addDoc } from 'firebase/firestore';

const { $db } = useNuxtApp();

export const getCollection = async (collectionName: string) => {
    const querySnapshot = await getDocs(collection($db, collectionName));
    const items = querySnapshot.docs.map(doc => doc.data());
    return items;
  };
  

// Example of adding data to Firestore
export const addToCollection = async (collectionName: string, data: object) => {
  await addDoc(collection($db, collectionName), data);
};


