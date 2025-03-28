<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getDoc, doc, deleteDoc } from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const recipeId = route.params.id;
const recipe = ref(null);

const { $auth, $googleProvider, $facebookProvider, $db } = useNuxtApp();

// Fetch the details of the recipe
const fetchRecipeDetails = async () => {
  try {
    const recipeDoc = await getDoc(doc($db, "recipes", recipeId));
    if (recipeDoc.exists()) {
      recipe.value = { id: recipeDoc.id, ...recipeDoc.data() };
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
};

// Delete recipe function
const deleteRecipe = async () => {
  try {
    await deleteDoc(doc($db, "recipes", recipeId));
    console.log("Recipe deleted successfully");
    router.push("/"); // Redirect to home page after deletion
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};

// Fetch recipe details when the component is mounted
onMounted(() => {
  fetchRecipeDetails();
});
</script>
<template>
  <div class="recipe-detail-container">
    <!-- Back Button -->
    <button @click="router.back()" class="back-btn">Back</button>

    <!-- Recipe Details -->
    <div v-if="recipe" class="recipe-details">
      <h2>{{ recipe.title }}</h2>
      <p><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
      <p><strong>Instructions:</strong> {{ recipe.instructions }}</p>

      <div v-if="recipe.image">
        <img :src="recipe.image" alt="Recipe Image" class="recipe-image" />
      </div>

      <!-- Edit and Delete Buttons (Visible only for the user who created the recipe) -->
      <div v-if="user && user.uid === recipe.userId" class="action-buttons">
        <NuxtLink :to="`/edit-recipe/${recipe.id}`" class="edit-btn">Edit</NuxtLink>
        <button @click="deleteRecipe" class="delete-btn">Delete</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
<style scoped>
.recipe-detail-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.back-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.back-btn:hover {
  background-color: #0056b3;
}

.recipe-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  max-width: 100%;
  margin-top: 20px;
  border-radius: 10px;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.edit-btn,
.delete-btn {
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #28a745;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c82333;
}

p {
  font-size: 16px;
  line-height: 1.6;
}
</style>
