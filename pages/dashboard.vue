<script setup>
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { signOut } from 'firebase/auth';

definePageMeta({
  middleware: 'auth', // Protect this page
});

const router = useRouter();
const { $auth } = useNuxtApp();

const logout = async () => {
  await signOut($auth);
  router.push('/login'); // Redirect to login page after logout
};
</script>

<template>
  <div v-if="$auth.currentUser">
    <h1>Welcome to your Dashboard!</h1>
    <p>Email: {{ $auth.currentUser?.email }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <p>Please log in first.</p>
  </div>
</template>