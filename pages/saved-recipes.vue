<script setup>
import { useNuxtApp } from '#app';
import { ref, onMounted } from 'vue';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';

// Use Nuxt app to access Firebase services
const { $auth, $db } = useNuxtApp();

// Reactive variables for saved recipes
const savedRecipes = ref([]);

// Fetch saved recipes when the user is logged in
const fetchSavedRecipes = async () => {
  const user = $auth.currentUser;
  if (user) {
    const savedRecipesSnapshot = await getDocs(collection($db, `users/${user.uid}/savedRecipes`));
    savedRecipes.value = savedRecipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Remove a saved recipe
const removeSavedRecipe = async (recipeId) => {
  const user = $auth.currentUser;
  if (user) {
    try {
      await deleteDoc(doc($db, `users/${user.uid}/savedRecipes`, recipeId));
      savedRecipes.value = savedRecipes.value.filter(recipe => recipe.id !== recipeId);
      console.log('Recipe removed from saved recipes');
    } catch (error) {
      console.error('Error removing saved recipe:', error);
    }
  }
};

// Fetch saved recipes on mount
onMounted(() => {
  fetchSavedRecipes();
});
</script>

<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">Saved Recipes</h2>

    <!-- Display saved recipes -->
    <div class="row">
      <div 
        v-for="(recipe, index) in savedRecipes" 
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

            <!-- Remove Recipe Button -->
            <button 
              class="btn btn-danger mt-auto"
              @click="removeSavedRecipe(recipe.id)"
            >
              Remove from Saved
            </button>

            <router-link :to="`/recipe/${recipe.id}`" class="btn btn-primary mt-2">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style for individual saved recipe cards */
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
