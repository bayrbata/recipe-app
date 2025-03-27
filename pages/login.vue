<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { signInWithPopup } from "firebase/auth";

const { $auth, $googleProvider, $facebookProvider } = useNuxtApp();

const loginWithGoogle = async () => {
  await signInWithPopup($auth, $googleProvider);
  window.location.href = "/dashboard";
};

const loginWithFacebook = async () => {
  await signInWithPopup($auth, $facebookProvider);
  window.location.href = "/dashboard";
};
</script>

<template>
  <div>
    <h2>Login</h2>
    <button @click="loginWithGoogle">Login with Google</button>
    <button @click="loginWithFacebook">Login with Facebook</button>
  </div>
</template>
