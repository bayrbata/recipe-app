<script setup>
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app'; // Access Nuxt app for global dependencies
import { ref, onMounted } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'; // Import necessary functions

// Use Nuxt app to access Firebase services
const { $auth, $googleProvider, $facebookProvider, $db } = useNuxtApp();

// Reactive variables for user and recipes
const user = ref(null);
const recipes = ref([]);

// Listen for authentication state changes
onAuthStateChanged($auth, (authUser) => {
  user.value = authUser; // Set user value to the current authenticated user
  if (authUser) {
    router.push('/dashboard'); // Redirect to dashboard if logged in
  }
});

// Fetch recipes from Firestore
const fetchRecipes = async () => {
  try {
    const querySnapshot = await getDocs(collection($db, 'recipes'));
    querySnapshot.forEach((doc) => {
      recipes.value.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// Fetch recipes when the component is mounted
onMounted(() => {
  fetchRecipes();
});

// Google login
const loginWithGoogle = async () => {
  try {
    await signInWithPopup($auth, $googleProvider);
    console.log('Google login successful');
  } catch (error) {
    console.error("Google Login Error:", error.message);
  }
};

// Facebook login
const loginWithFacebook = async () => {
  try {
    await signInWithPopup($auth, $facebookProvider);
    console.log('Facebook login successful');
  } catch (error) {
    console.error("Facebook Login Error:", error.message);
  }
};

// Logout
const logout = async () => {
  try {
    await signOut($auth);
    console.log('User logged out');
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
</script>

<template>
  <div class="container py-4">
    <h2>All Recipes</h2>

    <div>
      <!-- Display the login/logout button based on user authentication status -->
      <div v-if="user">
        <p>Welcome, {{ user.displayName || user.email }}!</p>
        <button @click="logout" class="btn btn-danger">Logout</button>
      </div>
      <div v-else>
        <button @click="loginWithGoogle" class="btn btn-primary">Login with Google</button>
        <button @click="loginWithFacebook" class="btn btn-primary">Login with Facebook</button>
      </div>
    </div>

    <!-- If no recipes available -->
    <div v-if="recipes.length === 0">
      <p>No recipes available.</p>
    </div>

    <!-- Display recipes in cards -->
    <div class="row">
      <div 
        v-for="(recipe, index) in recipes" 
        :key="recipe.id" 
        class="col-12 col-md-4 mb-4"
      >
        <div class="card shadow-sm">
          <img
            v-if="recipe.image" 
            :src="recipe.image" 
            class="card-img-top" 
            alt="Recipe Image"
            style="height: 200px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <p class="card-text">{{ recipe.ingredients }}</p>
            <p class="card-text">{{ recipe.instructions }}</p>
            <router-link :to="`/recipe/${recipe.id}`" class="btn btn-primary">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.875rem;
  color: #555;
}

button {
  margin-top: 10px;
}
</style>