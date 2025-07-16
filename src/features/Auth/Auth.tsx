'use client'

import React, {useEffect, useState, useCallback} from "react"
import {auth, provider, db} from "@/lib/firebase/firebaseConfig"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    User,
    AuthError,
    UserCredential,
    onAuthStateChanged
} from "firebase/auth"
import {doc, setDoc, getDoc, getDocs, query, collection, where} from "firebase/firestore"
import styles from "./Auth.module.scss"
import SuccessMessage from "@/features/Auth/components/SuccessMessage"

const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [fullName, setFullName] = useState("")
    const [user, setUser] = useState<User | null>(null)
    const [isSignUp, setIsSignUp] = useState(true)
    const [validationError, setValidationError] = useState("")
    const [firebaseError, setFirebaseError] = useState("")
    const [wasSubmitted, setWasSubmitted] = useState(false)
    const [hideComponent, setHideComponent] = useState(false)

    useEffect(() => {
        setValidationError("")
        setFirebaseError("")
        setWasSubmitted(false)
    }, [isSignUp])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                setHideComponent(true)
            }, 600)
        }
    }, [user])
    useEffect(() => {
        if (user) {
            user.getIdToken()
                .then(async (token) => {
                    const res = await fetch("/api/set-token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token }),
                    });

                    if (!res.ok) {
                        console.error("Failed to set token cookie");
                    } else {
                        console.log("Token cookie set");
                        // Возможно, обновить страницу:
                        // window.location.reload();
                    }
                })
                .catch((err) => {
                    console.error("Error getting ID token:", err);
                });
        }
    }, [user]);



    const createUserDocIfNotExists = async (user: User, fullName?: string) => {
        try {
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                const baseName = fullName || user.displayName || "user";
                const baseUsername = baseName
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-_]/g, "");

                let cleanUsername = baseUsername;
                let counter = 1;


                let usernameExists = true;
                while (usernameExists) {
                    const querySnapshot = await getDocs(
                        query(
                            collection(db, "users"),
                            where("username", "==", cleanUsername)
                        )
                    );

                    if (querySnapshot.empty) {
                        usernameExists = false;
                    } else {
                        cleanUsername = `${baseUsername}${counter}`;
                        counter++;
                    }
                }
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email || "",
                    fullName: baseName,
                    username: cleanUsername,
                    createdAt: new Date(),
                    provider: user.providerData?.[0]?.providerId || "password",
                });
                console.log("User document created");
            } else {
                console.log("User document already exists");
            }
        } catch (error) {
            console.error("Error creating user doc:", error);
        }
    };


    const handleAuthAction = async (
        action: () => Promise<UserCredential>,
        needsUserDoc = false,
        skipValidation = false
    ) => {
        setFirebaseError("")
        setWasSubmitted(true)

        if (!skipValidation) {
            const validationErr = getValidationError()
            if (validationErr) {
                setValidationError(validationErr)
                return
            }
        }

        try {
            const userCredential = await action()
            setUser(userCredential.user)
            if (needsUserDoc) {
                await createUserDocIfNotExists(userCredential.user, fullName)
            }
        } catch (err) {
            handleFirebaseError(err)
        }
    }

    const handleRegister = () =>
        handleAuthAction(() => createUserWithEmailAndPassword(auth, email, password), true)

    const handleLogin = () =>
        handleAuthAction(() => signInWithEmailAndPassword(auth, email, password))

    const handleGoogleLogin = () =>
        handleAuthAction(() => signInWithPopup(auth, provider), true, true)

    const handleFirebaseError = useCallback((err: unknown) => {
        if (typeof err !== "object" || err === null || !("code" in err)) {
            setFirebaseError("An unknown error occurred")
            return
        }

        const errorCode = (err as AuthError).code

        switch (errorCode) {
            case "auth/email-already-in-use":
                setFirebaseError("Email is already in use")
                break
            case "auth/invalid-email":
                setFirebaseError("Invalid email address")
                break
            case "auth/weak-password":
                setFirebaseError("Password should be at least 6 characters")
                break
            case "auth/user-not-found":
                setFirebaseError("No user found with this email")
                break
            case "auth/wrong-password":
                setFirebaseError("Incorrect password")
                break
            case "auth/popup-closed-by-user":
                setFirebaseError("Google sign-in was closed before completing")
                break
            case "auth/network-request-failed":
                setFirebaseError("Network error occurred")
                break
            case "auth/too-many-requests":
                setFirebaseError("Too many requests. Try again later")
                break
            default:
                setFirebaseError("Authentication error")
                break
        }
    }, [])

    const getValidationError = useCallback((): string => {
        if (isSignUp) {
            if (!fullName.trim() || !email.trim() || !password || !passwordConfirm) {
                return "Please fill all fields"
            }
            if (!email.includes("@")) {
                return "Invalid email format"
            }
            if (password.length < 8) {
                return "Password must be at least 8 characters"
            }
            if (password !== passwordConfirm) {
                return "Passwords do not match"
            }
        } else {
            if (!email.trim() || !password) {
                return "Please fill all fields"
            }
        }
        return ""
    }, [email, password, passwordConfirm, fullName, isSignUp])

    return (
        hideComponent ? <div style={{display: 'none'}}></div> :
                <div className={user ? styles.none : styles.container}>
                    <div className={styles.page__overlay}></div>
                    {user ? (
                        <div><SuccessMessage/></div>
                    ) : isSignUp ? (
                        <div className={styles.mainContainer}>
                            <h2 className={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
                            <input
                                className={styles.input}
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <input
                                name="email"
                                className={styles.input}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                name="password"
                                className={styles.input}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Confirm Password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                            {(wasSubmitted && validationError) || firebaseError ? (
                                <p className={styles.error}>
                                    {(wasSubmitted && validationError) || firebaseError}
                                </p>
                            ) : null}
                            <button className={styles.button} onClick={handleRegister}>
                                Register
                            </button>
                            <div>
                                Already have an account?
                                <button
                                    className={styles.btn__change}
                                    onClick={() => setIsSignUp(false)}
                                >
                                    Sign In
                                </button>
                            </div>
                            <hr className={styles.hr}/>
                            <button className={styles.button} onClick={handleGoogleLogin}>
                                Login with Google
                            </button>
                        </div>
                    ) : (
                        <div className={styles.mainContainer}>
                            <h2 className={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
                            <input
                                name="email"
                                className={styles.input}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                name="password"
                                className={styles.input}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {(wasSubmitted && validationError) || firebaseError ? (
                                <p className={styles.error}>
                                    {(wasSubmitted && validationError) || firebaseError}
                                </p>
                            ) : null}
                            <button className={styles.button} onClick={handleLogin}>
                                Login
                            </button>
                            <div>
                                Don’t have an account?
                                <button
                                    className={styles.btn__change}
                                    onClick={() => setIsSignUp(true)}
                                >
                                    Sign up
                                </button>
                            </div>
                            <hr className={styles.hr}/>
                            <button className={styles.button} onClick={handleGoogleLogin}>
                                Login with Google
                            </button>
                        </div>
                    )}
                </div>
    )
}

export default Auth
