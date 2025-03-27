<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const { $auth, $db } = useNuxtApp();
const user = ref(null);
const userRecipes = ref([]);
const savedRecipes = ref([]);

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
  <div>
    <h2>My Recipes</h2>
    <div v-if="userRecipes.length === 0">
      <p>No recipes found. Add your first recipe!</p>
    </div>
    <div v-for="recipe in userRecipes" :key="recipe.id">
        <img
            v-if="recipe.image" 
            :src="recipe.image" 
            class="card-img-top" 
            alt="Recipe Image"
          />
      <h3>{{ recipe.title }}</h3>
      <p>{{ recipe.ingredients }}</p>
      <button @click="deleteRecipe(recipe.id)">Delete</button>
      <NuxtLink :to="`/edit-recipe/${recipe.id}`">
        <button>Edit</button>
      </NuxtLink>
    </div>
  </div>
</template>