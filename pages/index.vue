<script setup>
import { useNuxtApp } from '#app'; // Access Nuxt app for global dependencies
import { ref, onMounted, computed } from 'vue';
import { getDocs, collection, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'; // Import necessary functions

// Use Nuxt app to access Firebase services
const { $auth, $googleProvider, $facebookProvider, $db } = useNuxtApp();

// Reactive variables for user, recipes, savedRecipes, and searchQuery
const user = ref(null);
const recipes = ref([]);
const savedRecipes = ref([]);
const searchQuery = ref('');

// Listen for authentication state changes
onAuthStateChanged($auth, (authUser) => {
  user.value = authUser; // Set user value to the current authenticated user
  if (authUser) {
    fetchSavedRecipes(); // Fetch saved recipes for the user
  }
});

onMounted(() => {
  fetchRecipes(); // Fetch all recipes when user is logged in
});

// Fetch recipes from Firestore
const fetchRecipes = async () => {
  recipes.value = []; // Clear previous recipes before fetching
  try {
    const querySnapshot = await getDocs(collection($db, 'recipes'));
    querySnapshot.forEach((doc) => {
      recipes.value.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// Fetch saved recipes from Firestore for the logged-in user
const fetchSavedRecipes = async () => {
  if (user.value) {
    const savedRecipesSnapshot = await getDocs(collection($db, `users/${user.value.uid}/savedRecipes`));
    savedRecipes.value = savedRecipesSnapshot.docs.map(doc => doc.data());
  }
};

// Save a recipe to the user's saved recipes collection
const saveRecipe = async (recipe) => {
  if (user.value) {
    try {
      await setDoc(doc($db, `users/${user.value.uid}/savedRecipes`, recipe.id), recipe);
      savedRecipes.value.push(recipe);
      console.log('Recipe saved successfully');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  } else {
    console.log('User must be logged in to save recipes');
  }
};

// Remove a saved recipe
const removeSavedRecipe = async (recipeId) => {
  if (user.value) {
    try {
      await deleteDoc(doc($db, `users/${user.value.uid}/savedRecipes`, recipeId));
      savedRecipes.value = savedRecipes.value.filter(recipe => recipe.id !== recipeId);
      console.log('Recipe removed from saved recipes');
    } catch (error) {
      console.error('Error removing saved recipe:', error);
    }
  }
};

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

// Computed property to filter recipes based on the search query
const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe => {
    const query = searchQuery.value.toLowerCase();
    return recipe.title.toLowerCase().includes(query) || recipe.ingredients.toLowerCase().includes(query);
  });
});
</script>
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">All Recipes</h2>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control search-input"
        placeholder="Search by title or ingredients..."
      />
    </div>

    <!-- Display filtered recipes in responsive grid -->
    <div class="recipe-grid">
      <div 
        v-for="(recipe, index) in filteredRecipes" 
        :key="recipe.id" 
        class="recipe-card"
        @click="navigateToListing(recipe.id)"
      >
        <div class="card shadow-sm w-100">
          <img
            v-if="recipe.image" 
            :src="recipe.image" 
            class="recipe-image"
            alt="Recipe Image"
          />
          
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <p class="card-text flex-grow-1">{{ recipe.ingredients }}</p>

            <!-- Save Recipe Button -->
            <button 
              class="btn" 
              :class="savedRecipes.some(saved => saved.id === recipe.id) ? 'btn-warning' : 'btn-secondary'"
              @click="savedRecipes.some(saved => saved.id === recipe.id) ? removeSavedRecipe(recipe.id) : saveRecipe(recipe)"
            >
              {{ savedRecipes.some(saved => saved.id === recipe.id) ? 'Unsave Recipe' : 'Save Recipe' }}
            </button>

            <!-- View Details Button -->
            <router-link :to="`/recipe/${recipe.id}`" class="btn">
              View Details
            </router-link>
          </div>
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
