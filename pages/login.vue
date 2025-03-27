<script setup>
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'; // Import signInWithPopup

const router = useRouter();
const { $auth, $googleProvider, $facebookProvider } = useNuxtApp();

// Check if the user is already authenticated
onAuthStateChanged($auth, (user) => {
  if (user) {
    router.push('/dashboard'); // If already logged in, go to dashboard
  }
});

// Google Login
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup($auth, $googleProvider); // Using signInWithPopup for Google login
    router.push("/dashboard"); // Redirect to the dashboard after successful login
  } catch (error) {
    console.error("Google Login Error:", error.message);
  }
};

// Facebook Login
const loginWithFacebook = async () => {
  try {
    const result = await signInWithPopup($auth, $facebookProvider); // Using signInWithPopup for Facebook login
    router.push("/dashboard"); // Redirect to the dashboard after successful login
  } catch (error) {
    console.error("Facebook Login Error:", error.message);
  }
};
</script>

<template>
  <div>
    <h1>Login</h1>
    <button @click="loginWithGoogle">Login with Google</button>
    <button @click="loginWithFacebook">Login with Facebook</button>
  </div>
</template>
