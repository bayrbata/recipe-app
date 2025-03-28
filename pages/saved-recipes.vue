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
    <h2 class="text-center mb-4 text-primary">Saved Recipes</h2>

    <!-- Display saved recipes in grid -->
    <div class="recipe-grid">
      <div 
        v-for="(recipe, index) in savedRecipes" 
        :key="recipe.id" 
        class="recipe-card"
      >
        <img
          v-if="recipe.image" 
          :src="recipe.image" 
          class="recipe-image" 
          alt="Recipe Image"
        />
        <div class="card-body">
          <h5 class="card-title">{{ recipe.title }}</h5>
          <p class="card-text">{{ recipe.ingredients }}</p>

          <!-- Remove Recipe Button -->
          <button 
            class="btn btn-warning"
            @click="removeSavedRecipe(recipe.id)"
          >
            Remove from Saved
          </button>

          <router-link :to="`/recipe/${recipe.id}`" class="btn">
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container for the page */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Search Bar Styling */
.search-input {
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 30px;
}

/* Recipe Grid Layout */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 0 10px;
}

/* Individual Recipe Card Styling */
.recipe-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

/* Card Body Styles */
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.card-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
  flex-grow: 1;
}

/* Button Styles */
.btn {
  width: 100%;
  text-align: center;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: scale(1.05);
}

.btn-warning {
  background-color: #ffc107;
  color: white;
  border: none;
}

.btn-warning:hover {
  background-color: #e0a800;
  transform: scale(1.05);
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
}
</style>
