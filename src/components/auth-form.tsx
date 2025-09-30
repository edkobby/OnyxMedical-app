
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, Timestamp } from "firebase/firestore";
import { createNotification } from "@/lib/notifications";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { User } from "firebase/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type Stage = "login" | "register";

interface AuthFormProps {
  onLoginSuccess?: (user: User) => void;
}

async function handleUserCreation(user: User, additionalData: { name?: string, phone?: string } = {}) {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
        const userName = additionalData.name || user.displayName || "New User";
        // Use setDoc with the user's UID as the document ID
        await setDoc(userDocRef, {
            uid: user.uid, // Store the UID within the document as well
            email: user.email,
            name: userName,
            photoURL: user.photoURL,
            phone: additionalData.phone || user.phoneNumber || '',
            role: 'patient', // Default role for new sign-ups
            status: 'Active',
            createdAt: serverTimestamp()
        });
        
        // Create a notification for the admin
        await createNotification({
            recipientId: "admin",
            title: 'New Patient Registered',
            description: `${userName} has created an account.`,
            type: 'new_patient',
            href: `/admin/patients/${user.uid}`
        });
    }
}


export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const { toast } = useToast();
  const [stage, setStage] = React.useState<Stage>("login");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      await handleUserCreation(userCredential.user);
      toast({ title: "Logged In Successfully!" });
      if(onLoginSuccess) onLoginSuccess(userCredential.user);
    } catch(error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/invalid-credential') {
        toast({ 
          title: "Login Failed", 
          description: "Invalid email or password. Please try again or register if you are new.", 
          variant: "destructive" 
        });
      } else {
        toast({ title: "Login Error", description: error.message, variant: "destructive" });
      }
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: values.name });
        await handleUserCreation(user, { name: values.name });
        
        toast({ title: "Account Created Successfully!" });
        if(onLoginSuccess) onLoginSuccess(user);

    } catch(error: any) {
        console.error("Registration error:", error);
        if (error.code === 'auth/email-already-in-use') {
            toast({
                title: "Registration Failed",
                description: "This email is already in use. Please try logging in instead.",
                variant: "destructive"
            });
            setStage('login');
        } else {
            toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const stageVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <Link href="/">
            <Image 
                src="/images/hero/ONYX_logo_cleaned-1 (1)-min.png"
                alt="Onyx Medical Logo" 
                width={50} 
                height={50}
                className="mx-auto h-10 w-auto"
            />
        </Link>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-headline">
          {stage === 'login' ? 'Sign in to your Account' : 'Create Your Account'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {stage === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <Button variant="link" onClick={() => setStage(stage === 'login' ? 'register' : 'login')} className="p-1">
             {stage === 'login' ? 'Register' : 'Log In'}
          </Button>
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          variants={stageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {stage === "login" && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="accent" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging In...' : 'Log In'}
                </Button>
              </form>
            </Form>
          )}

          {stage === "register" && (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                 <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} placeholder="Create a password (min. 8 characters)" {...field} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="accent" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="px-8 text-center text-sm text-muted-foreground pt-6">
        By continuing, you agree to Onyx Medical's{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms and Conditions
        </Link>
        .
      </p>
    </div>
  );
}
