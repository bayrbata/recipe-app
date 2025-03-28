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
    <h2 class="text-center mb-4">Add Your Recipe</h2>

    <div class="form-group">
      <input 
        v-model="recipe.title" 
        type="text" 
        class="form-control" 
        placeholder="Recipe Title" 
      />
    </div>

    <div class="form-group">
      <textarea 
        v-model="recipe.ingredients" 
        class="form-control" 
        placeholder="Ingredients" 
      ></textarea>
    </div>

    <div class="form-group">
      <textarea 
        v-model="recipe.instructions" 
        class="form-control" 
        placeholder="Instructions" 
      ></textarea>
    </div>

    <div class="form-group">
      <input 
        v-model="recipe.imageUrl" 
        type="text" 
        class="form-control" 
        placeholder="Paste image URL (Optional)" 
      />
    </div>

    <button @click="submitRecipe" class="btn btn-primary btn-block">Save Recipe</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  padding: 15px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
}

textarea.form-control {
  min-height: 150px;
}

button {
  padding: 15px;
  font-size: 1.1rem;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
}
</style>
