/**
 * VECTORGUARD AI — FIREBASE FIRESTORE PERSISTENT CLIENT
 * 
 * Configures the cloud Firestore database instance for VectorGuard AI.
 * Enables persistent offline caching and handles live read/write operations.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  Firestore, 
  doc, 
  getDoc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  query,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const FIREBASE_CONFIG = firebaseConfig;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!app) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(FIREBASE_CONFIG);
      } else {
        app = getApp();
      }
    } catch (err) {
      console.warn('Firebase App initialization warning:', err);
      return null;
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    try {
      const firebaseApp = getFirebaseApp();
      if (firebaseApp) {
        auth = getAuth(firebaseApp);
      }
    } catch (err) {
      console.warn('Firebase Auth initialization warning:', err);
      return null;
    }
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore | null {
  if (!db) {
    try {
      const firebaseApp = getFirebaseApp();
      if (!firebaseApp) return null;
      const dbId = FIREBASE_CONFIG.firestoreDatabaseId;
      try {
        // Force long-polling to prevent WebSocket/streaming connection errors in sandboxed iframes
        db = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
        }, dbId);
      } catch (initErr) {
        // If initializeFirestore fails because the instance was already initialized, safely fall back to getFirestore()
        console.warn('initializeFirestore fallback to getFirestore:', initErr instanceof Error ? initErr.message : initErr);
        db = getFirestore(firebaseApp, dbId);
      }
    } catch (err) {
      console.warn('Firebase Firestore initialization warning:', err);
      return null;
    }
  }
  return db;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  try {
    const currentAuth = getFirebaseAuth();
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: currentAuth?.currentUser?.uid,
        email: currentAuth?.currentUser?.email,
        emailVerified: currentAuth?.currentUser?.emailVerified,
        isAnonymous: currentAuth?.currentUser?.isAnonymous,
        tenantId: currentAuth?.currentUser?.tenantId,
        providerInfo: currentAuth?.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  } catch (e) {
    console.error('Firestore error logging failed:', e);
  }
}

/**
 * Health check test on cloud database with timeout guard
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Safe browser check for offline status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }
    const firestore = getFirebaseFirestore();
    if (!firestore) return false;
    const testRef = doc(firestore, 'hotspots', 'VG-1042');
    
    // Attempt doc read with 3s timeout
    const docPromise = getDoc(testRef);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const result = await Promise.race([docPromise, timeoutPromise]);
    
    return result !== null;
  } catch (error) {
    console.warn('Firestore health check failed:', error);
    return false;
  }
}
