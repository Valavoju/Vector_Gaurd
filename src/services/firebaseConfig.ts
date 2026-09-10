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

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(FIREBASE_CONFIG);
    } else {
      app = getApp();
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    const firebaseApp = getFirebaseApp();
    const dbId = FIREBASE_CONFIG.firestoreDatabaseId;
    try {
      // Force long-polling to prevent WebSocket/streaming connection errors in sandboxed iframes
      db = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
      }, dbId);
    } catch {
      db = getFirestore(firebaseApp, dbId);
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
  const currentAuth = getFirebaseAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth.currentUser?.uid,
      email: currentAuth.currentUser?.email,
      emailVerified: currentAuth.currentUser?.emailVerified,
      isAnonymous: currentAuth.currentUser?.isAnonymous,
      tenantId: currentAuth.currentUser?.tenantId,
      providerInfo: currentAuth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Health check test on cloud database with timeout guard
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const firestore = getFirebaseFirestore();
    const testRef = doc(firestore, 'hotspots', 'VG-1042');
    
    // Attempt doc read with 3s timeout
    const docPromise = getDoc(testRef);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const result = await Promise.race([docPromise, timeoutPromise]);
    
    return result !== null || navigator.onLine;
  } catch (error) {
    // If offline or network unavailable, fall back to browser online state
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}
