<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";

const route = useRoute();
const router = useRouter();
const { $db } = useNuxtApp();
const recipeId = route.params.id;
const recipe = ref({ title: "", ingredients: "", instructions: "" });

onMounted(async () => {
  const recipeDoc = await getDoc(doc($db, "recipes", recipeId));
  if (recipeDoc.exists()) {
    recipe.value = { id: recipeDoc.id, ...recipeDoc.data() };
  }
});

const updateRecipe = async () => {
  await updateDoc(doc($db, "recipes", recipeId), {
    title: recipe.value.title,
    ingredients: recipe.value.ingredients,
    instructions: recipe.value.instructions,
  });
  router.push("/dashboard"); // Redirect after update
};
</script>

<template>
  <div>
    <h2>Edit Recipe</h2>
    <input v-model="recipe.title" placeholder="Title" />
    <textarea v-model="recipe.ingredients" placeholder="Ingredients"></textarea>
    <textarea v-model="recipe.instructions" placeholder="Instructions"></textarea>
    <button @click="updateRecipe">Update Recipe</button>
  </div>
</template>
