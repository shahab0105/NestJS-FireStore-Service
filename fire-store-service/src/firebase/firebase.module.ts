import { Provider, Module, Global } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
// Can be copied from your firebase dashboard
const firebaseConfig = {
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'AUTH_DOMAIN',
  projectId: 'PROJECT_ID',
  storageBucket: 'STORAGE_BUCKET_ID',
  messagingSenderId: '*****',
  appId: '*****',
  measurementId: '******',
};
@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: (): FirebaseApp => {
        return initializeApp(firebaseConfig);
        //will be defined to be in this module
      },
    },
    {
      provide: 'FIRESTORE',
      useFactory: (app: FirebaseApp): Firestore => {
        return getFirestore(app);
      },
      inject: ['FIREBASE_APP'], //this ensures the previous provider gets called and passed to its usefactory
    },
    {
      provide: 'FIRESTORE_SERVICE',
      useClass: FirestoreService, //to be defined
    },
  ],

  exports: ['FIREBASE_APP', 'FIRESTORE', 'FIRESTORE_SERVICE'],
})
export class FirebaseModule {
  //lets add shiz later
}
