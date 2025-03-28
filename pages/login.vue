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
  <div class="login-container">
    <h2>Login to Your Account</h2>
    <div class="login-buttons">
      <button class="btn-google" @click="loginWithGoogle">Login with Google</button>
      <button class="btn-facebook" @click="loginWithFacebook">Login with Facebook</button>
    </div>
  </div>
</template>

<style scoped>
/* Container styling */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f7fa;
  padding: 20px;
  text-align: center;
}

/* Heading styling */
h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

/* Button container */
.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 350px;
}

/* Common button styles */
button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  color: white;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

/* Google button styles */
.btn-google {
  background-color: #db4437;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-google:hover {
  background-color: #c1351d;
  transform: translateY(-2px);
}

.btn-google:focus {
  outline: none;
}

/* Facebook button styles */
.btn-facebook {
  background-color: #3b5998;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-facebook:hover {
  background-color: #2d4373;
  transform: translateY(-2px);
}

.btn-facebook:focus {
  outline: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
