<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "~/plugins/firebase";

const route = useRoute();
const recipeId = route.params.id;
const recipe = ref(null);

// Fetch the details of the recipe
const fetchRecipeDetails = async () => {
  try {
    const recipeDoc = await getDoc(doc(db, "recipes", recipeId));
    if (recipeDoc.exists()) {
      recipe.value = { id: recipeDoc.id, ...recipeDoc.data() };
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
};

// Fetch recipe details when the component is mounted
onMounted(() => {
  fetchRecipeDetails();
});
</script>

<template>
  <div v-if="recipe">
    <h2>{{ recipe.title }}</h2>
    <p><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
    <p><strong>Instructions:</strong> {{ recipe.instructions }}</p>

    <!-- Display image if available -->
    <div v-if="recipe.image">
      <img :src="recipe.image" alt="Recipe Image" style="max-width: 100%; margin-top: 20px;" />
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>