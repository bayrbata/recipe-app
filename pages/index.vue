<script setup>

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
    
    <h2 class="text-center mb-4">All Recipes</h2>
    
    <!-- If no recipes available -->
    <div v-if="recipes.length === 0" class="text-center">
      <p>No recipes available.</p>
    </div>

    <!-- Display recipes in Bootstrap grid -->
    <div style="display: inline-flex">
      <div 
        v-for="(recipe, index) in recipes" 
        :key="recipe.id" 
        class="col-12 col-sm-6 col-md-4 mb-4 d-flex align-items-stretch"
      >
        <div class="card shadow-sm w-100">
          <img
            v-if="recipe.image" 
            :src="recipe.image" 
            class="card-img-top" 
            alt="Recipe Image"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <p class="card-text flex-grow-1">{{ recipe.ingredients }}</p>
            <router-link :to="`/recipe/${recipe.id}`" class="btn btn-primary mt-auto">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style for individual recipe cards */
.card {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Image inside the card */
.card-img-top {
  height: 200px; /* Fixed height for uniformity */
  object-fit: cover; /* Ensure images fit properly */
}

/* Card body adjustments */
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Space between elements */
  padding: 15px;
}

/* Title styling */
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
}

/* Ingredient text */
.card-text {
  font-size: 0.875rem;
  color: #555;
  text-align: justify;
  flex-grow: 1; /* Allows the text to fill available space */
}

/* Button styles */
.btn {
  width: 100%;
  text-align: center;
}

/* Responsive Grid */
@media (max-width: 768px) {
  .col-sm-6 {
    flex: 0 0 50%; /* 2 cards per row */
    max-width: 50%;
  }
}

@media (max-width: 576px) {
  .col-12 {
    flex: 0 0 100%; /* 1 card per row */
    max-width: 100%;
  }
}
</style>