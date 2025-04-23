import { Inject, Injectable } from '@nestjs/common';
import {
  Firestore,
  Query,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { IConnectionService } from 'src/interfaces/IConnection.service';

@Injectable()
export class FirestoreService implements IConnectionService {
  constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {}
  async connectDB(): Promise<string> {
    const colRef = collection(this.firestore, 'pets');
    const snapshot = await getDocs(colRef);
    const pets = snapshot.docs.map((doc) => doc.data());
    return JSON.stringify(pets);
    // return "connected to firestore";
  }
  async dumpCollection<T>(cls: new () => T): Promise<T[]> {
    try {
      let collectionName = getCollectionName(cls);
      const colRef = collection(this.firestore, collectionName);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.log(error);
    }
  }

  
  async addDocument<T>(cls: new () => T, doc: T): Promise<T & { id: string }> {
    try {
      let collectionName = getCollectionName(cls);
      const colRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(colRef, { ...doc });
      return { id: docRef.id, ...doc };
    } catch (error) {
      console.log(error);
    }
  }

  async removeDocument<T>(
    cls: new () => T,
    options: { filter?: string; value?: string },
  ): Promise<(T & { id: string }) | null> {
    try {
      const collectionName = getCollectionName(cls);
      const colRef = collection(this.firestore, collectionName);

      const q = query(colRef, where(options.filter, '==', options.value));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn('No matching document found to delete.');
        return null;
      }

      const docToDelete = snapshot.docs[0];
      const docData = docToDelete.data() as T;

      await deleteDoc(docToDelete.ref);

      return { id: docToDelete.id, ...docData };
    } catch (error) {
      console.log(error);
    }
  }


  async fetchDocument<T>(
    cls: new () => T,
    options: { filter?: string; value?: string },
  ): Promise<T[]> {
    try {
      let collectionName = getCollectionName(cls);
      const colRef = collection(this.firestore, collectionName);

      let queryRef = colRef as Query;
      if (options?.filter && options?.value) {
        queryRef = query(colRef, where(options.filter, '==', options.value));
      }

      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.log(error);
    }
  }
}
