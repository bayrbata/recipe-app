<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const { $auth, $db } = useNuxtApp();
const user = ref(null);
const userRecipes = ref([]);

// Get logged-in user
onAuthStateChanged($auth, (authUser) => {
  user.value = authUser;
  if (authUser) {
    fetchUserRecipes();
  }
});

// Fetch user's own recipes
const fetchUserRecipes = async () => {
  if (!user.value) return;
  const q = query(collection($db, "recipes"), where("userId", "==", user.value.uid));
  const querySnapshot = await getDocs(q);
  userRecipes.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Delete recipe
const deleteRecipe = async (id) => {
  await deleteDoc(doc($db, "recipes", id));
  fetchUserRecipes(); // Refresh recipes after deletion
};
</script>

<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">My Recipes</h2>
    
    <div v-if="userRecipes.length === 0" class="text-center">
      <p>No recipes found. Add your first recipe!</p>
    </div>
    
    <!-- Recipe Grid Layout -->
    <div class="recipe-grid">
      <div 
        v-for="recipe in userRecipes" 
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
          <h3 class="card-title">{{ recipe.title }}</h3>
      
          <div class="instructions">
            <h4>Ingredients:</h4>
            <p>{{ recipe.ingredients }}</p>
          </div>
          <!-- Display Instructions -->
          <div class="instructions">
            <h4>Instructions:</h4>
            <p>{{ recipe.instructions }}</p>
          </div>
          
          <!-- Edit Button -->
          <div style="display: inline-flex; gap: 10px;">
            <NuxtLink :to="`/edit-recipe/${recipe.id}`" class="btn btn-primary">
              Edit
            </NuxtLink>
            <button @click="deleteRecipe(recipe.id)" class="btn btn-danger">
              Delete
            </button>
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
  padding: 20px;
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

/* Recipe Image */
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

/* Instructions Styling */
.instructions {
  margin-bottom: 15px;
}

.instructions h4 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.instructions p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
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

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
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
