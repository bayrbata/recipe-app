<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '~/plugins/firebase';  // Import your Firestore instance

const router = useRouter();
const { $auth, $db, $collection, $addDoc, $getDocs, $deleteDoc, $doc } = useNuxtApp();
const recipes = ref([]);

// Check if the user is authenticated before fetching saved recipes
const user = $auth.currentUser;
if (!user) {
  router.push('/login');  // Redirect to login if not authenticated
}

const userId = user ? user.uid : null;

const fetchSavedRecipes = async () => {
  if (userId) {
    const recipeCollection = $collection($db, 'recipes');
    const q = query(recipeCollection, where('userId', '==', userId));

    try {
      const querySnapshot = await getDocs(q);
      const fetchedRecipes = [];
      querySnapshot.forEach((doc) => {
        fetchedRecipes.push(doc.data());  // Add each fetched recipe to the array
      });
      recipes.value = fetchedRecipes;  // Set the recipes ref to the fetched data
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }
};

// Fetch saved recipes when the page is mounted
onMounted(() => {
  fetchSavedRecipes();
});
</script>

<template>
  <div>
    <h2>Your Saved Recipes</h2>
    <div v-if="recipes.length === 0">
      <p>You don't have any saved recipes yet.</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="(recipe, index) in recipes" :key="index">
          <h3>{{ recipe.title }}</h3>
          <p>{{ recipe.ingredients }}</p>
          <p>{{ recipe.instructions }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>