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
  });
  router.push("/dashboard"); // Redirect to dashboard after update
};
</script>

<template>
  <div>
    <h2>Edit Recipe</h2>
    <form @submit.prevent="updateRecipe">
      <div>
        <label for="title">Title:</label>
        <input v-model="recipe.title" type="text" id="title" required />
      </div>
      <div>
        <label for="ingredients">Ingredients:</label>
        <textarea v-model="recipe.ingredients" id="ingredients" required></textarea>
      </div>
      <div>
        <label for="image">Image URL:</label>
        <input v-model="recipe.image" type="text" id="image" />
      </div>
      <button type="submit">Update Recipe</button>
    </form>
  </div>
</template>
