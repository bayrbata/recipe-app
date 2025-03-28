<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { getDoc, doc, updateDoc } from "firebase/firestore";

const { $db } = useNuxtApp();
const route = useRoute();
const router = useRouter();

// Recipe data and form handling
const recipe = ref({
  title: "",
  ingredients: "",
  image: "",
  instructions: "", // Add instructions field
});
const recipeId = route.params.id;  // Get the ID from the URL

// Fetch the recipe to edit when the component mounts
onMounted(async () => {
  const recipeDoc = await getDoc(doc($db, "recipes", recipeId));
  if (recipeDoc.exists()) {
    recipe.value = recipeDoc.data();
  }
});

// Handle form submission for updating the recipe
const updateRecipe = async () => {
  await updateDoc(doc($db, "recipes", recipeId), {
    title: recipe.value.title,
    ingredients: recipe.value.ingredients,
    image: recipe.value.image,
    instructions: recipe.value.instructions, // Update instructions
  });
  router.push("/dashboard"); // Redirect to dashboard after update
};
</script>

<template>
  <div class="edit-recipe-container">
    <h2>Edit Recipe</h2>
    <form @submit.prevent="updateRecipe" class="recipe-form">
      <div class="form-group">
        <label for="title" class="form-label">Title:</label>
        <input v-model="recipe.title" type="text" id="title" class="form-input" required />
      </div>
      <div class="form-group">
        <label for="ingredients" class="form-label">Ingredients:</label>
        <textarea v-model="recipe.ingredients" id="ingredients" class="form-input" required></textarea>
      </div>
      <div class="form-group">
        <label for="instructions" class="form-label">Instructions:</label>
        <textarea v-model="recipe.instructions" id="instructions" class="form-input" required></textarea>
      </div>
      <div class="form-group">
        <label for="image" class="form-label">Image URL:</label>
        <input v-model="recipe.image" type="text" id="image" class="form-input" />
      </div>
      <button type="submit" class="btn btn-primary">Update Recipe</button>
    </form>
  </div>
</template>

<style scoped>
/* Container for the page */
.edit-recipe-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Title */
h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

/* Form styles */
.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form Group styles */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Label styles */
.form-label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

/* Input and Textarea styles */
.form-input {
  padding: 12px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #007bff;
}

/* Button Styles */
.btn {
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Responsive design for small screens */
@media (max-width: 768px) {
  .edit-recipe-container {
    width: 90%;
  }
}
</style>
