<template>
    <div v-if="user">
      <h1>Welcome, {{ user.displayName }}</h1>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <h1>Please log in</h1>
      <nuxt-link to="/login">Go to Login</nuxt-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { setAuthStateChangedCallback } from '~/plugins/firebase';
  
  const user = ref(null);
  
  const logout = () => {
    firebase.auth().signOut();
  };
  
  onMounted(() => {
    setAuthStateChangedCallback((currentUser) => {
      user.value = currentUser;
    });
  });
  </script>
  