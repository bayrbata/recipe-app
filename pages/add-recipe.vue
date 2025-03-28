<script setup>
import { useNuxtApp } from "#app";
import { saveRecipe } from "~/utils/recipeService";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router"; // ✅ Import router

const { $auth, $db } = useNuxtApp();
const router = useRouter(); // ✅ Initialize router
const userId = ref(null);

// Reactive state for recipe
const recipe = ref({
  title: "",
  ingredients: "",
  instructions: "",
  imageUrl: "" // Holds the manually entered image URL
});

// Get logged-in user
onAuthStateChanged($auth, (user) => {
  if (user) {
    userId.value = user.uid;
  }
});

// Submit recipe
const submitRecipe = async () => {
  if (!userId.value) {
    alert("You must be logged in!");
    return;
  }

  // Check if required fields are filled
  if (!recipe.value.title || !recipe.value.ingredients || !recipe.value.instructions) {
    alert("Please fill in all fields!");
    return;
  }

  // Save recipe
  const recipeData = {
    title: recipe.value.title,
    ingredients: recipe.value.ingredients,
    instructions: recipe.value.instructions,
    image: recipe.value.imageUrl || "", // Store empty string if no image
    userId: userId.value
  };

  try {
    await saveRecipe($db, userId.value, recipeData);
    alert("Recipe saved successfully!");
    
    // Clear the form
    recipe.value = { title: "", ingredients: "", instructions: "", imageUrl: "" };

    // ✅ Redirect to the dashboard
    router.push("/dashboard");
  } catch (error) {
    alert("Failed to save recipe!");
    console.error("Error saving recipe:", error);
  }
};
</script>

<template>
  <div class="container">
    <h2>Add Recipe</h2>
    
    <input v-model="recipe.title" placeholder="Recipe Title" />
    <textarea v-model="recipe.ingredients" placeholder="Ingredients"></textarea>
    <textarea v-model="recipe.instructions" placeholder="Instructions"></textarea>

    <div>
      <input v-model="recipe.imageUrl" type="text" placeholder="Paste image URL" />
    </div>

    <button @click="submitRecipe">Save Recipe</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
</style>
