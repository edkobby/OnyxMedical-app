// src/lib/firebase/firebase-admin.ts
import * as admin from "firebase-admin";

// Robust initialization: prefer service account JSON provided as base64 env var,
// otherwise fall back to Google default credentials (works in Google Cloud).
function initAdmin() {
  if (admin.apps.length) return;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64) {
      // decode base64 JSON key (useful for CI / Studio secrets)
      const keyJson = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(keyJson),
      });
    } else {
      // In Google Cloud / Firebase runtimes this should work
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (err) {
    // Last resort: initialize without explicit credential (Cloud Functions usually works)
    try {
      admin.initializeApp();
    } catch (e) {
      // If this fails, surface the error during the build/runtime logs
      // but still export placeholders to avoid "module not found".
      console.error("firebase-admin initialization error:", e);
    }
  }
}

initAdmin();

export const adminApp = admin.apps.length ? admin.app() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export default admin;
