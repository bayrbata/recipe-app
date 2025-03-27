<script setup>
import { useNuxtApp } from "#app";
import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";

const { $auth } = useNuxtApp();
const user = ref(null);

onAuthStateChanged($auth, (authUser) => {
  user.value = authUser;
});

const logout = async () => {
  await signOut($auth);
  user.value = null;
};
</script>

<template>
  <div>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/add-recipe">Add Recipe</NuxtLink>
      <NuxtLink to="/saved-recipes">Saved Recipes</NuxtLink>
      <NuxtLink to="/dashboard" v-if="user">Dashboard</NuxtLink>
      <button v-if="user" @click="logout">Logout</button>
      <NuxtLink to="/login" v-else>Login</NuxtLink>
    </nav>
    
    <NuxtPage />
  </div>
</template>

<style scoped>
nav {
  background: #333;
  padding: 10px;
}
nav a, button {
  color: white;
  margin-right: 10px;
  text-decoration: none;
}
</style>
