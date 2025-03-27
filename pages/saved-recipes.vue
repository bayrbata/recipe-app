<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const { $auth, $db } = useNuxtApp();
const user = ref(null);
const savedRecipes = ref([]);

onAuthStateChanged($auth, (authUser) => {
  user.value = authUser;
  if (authUser) {
    fetchSavedRecipes();
  }
});

const fetchSavedRecipes = async () => {
  if (!user.value) return;
  const q = query(collection($db, "saved_recipes"), where("userId", "==", user.value.uid));
  const querySnapshot = await getDocs(q);
  savedRecipes.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const removeSavedRecipe = async (id) => {
  await deleteDoc(doc($db, "saved_recipes", id));
  fetchSavedRecipes();
};
</script>

<template>
  <div>
    <h2>Saved Recipes</h2>
    <div v-if="savedRecipes.length === 0">
      <p>No saved recipes yet.</p>
    </div>
    <div v-for="recipe in savedRecipes" :key="recipe.id">
      <h3>{{ recipe.title }}</h3>
      <button @click="removeSavedRecipe(recipe.id)">Remove</button>
    </div>
  </div>
</template>
