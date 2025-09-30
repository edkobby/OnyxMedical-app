
"use client";
import AuthForm from '@/components/auth-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLoginSuccess = async (user: any) => {
    if (!user) return;
    
    // Check user role from Firestore to determine redirect
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    let isAdmin = false;
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      // A user is an admin if their role in Firestore is 'Admin' or 'admin'.
      if (userData.role && typeof userData.role === 'string' && userData.role.toLowerCase() === 'admin') {
        isAdmin = true;
      }
    } else {
        // This case handles social logins for users who don't have a DB entry yet.
        // They are defaulted to non-admin.
        console.warn("User document not found for UID:", user.uid);
    }
    
    router.push(isAdmin ? '/admin' : '/dashboard');
  };

  useEffect(() => {
    // If the user is already loaded and logged in, redirect them.
    if (!loading && user) {
        handleLoginSuccess(user);
    }
  }, [user, loading, handleLoginSuccess]);


  // If the auth state is still loading, show a loading indicator.
  // If the user is already determined to be logged in, also show loading while we redirect.
  if(loading || user) {
    return (
        <div className="flex flex-col min-h-screen bg-background items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  // If loading is complete and there is no user, show the login page.
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm onLoginSuccess={(user) => handleLoginSuccess(user)} />
      </main>
    </div>
  );
}
