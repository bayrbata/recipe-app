<script setup>
import { useNuxtApp } from "#app";
import { saveRecipe } from "~/utils/recipeService"; // Import function
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage imports

const { $auth, $db } = useNuxtApp();
const userId = ref(null);
const recipe = ref({ title: "", ingredients: "", instructions: "", image: null }); // Add image property

// Get logged-in user
onAuthStateChanged($auth, (user) => {
  if (user) {
    userId.value = user.uid;
  }
});

// Handle image file upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    recipe.value.image = file; // Store the image file
  }
};

// Function to upload the image to Firebase Storage
const uploadImage = async (file) => {
  const storage = getStorage();
  const storagePath = `recipes/${file.name}`;
  const imageRef = storageRef(storage, storagePath);

  const uploadTask = uploadBytesResumable(imageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve); // Get download URL after upload
      }
    );
  });
};

// Submit recipe and save it to Firestore
const submitRecipe = async () => {
  if (!userId.value) {
    alert("You must be logged in to save a recipe!");
    return;
  }

  let imageUrl = "";
  if (recipe.value.image) {
    try {
      imageUrl = await uploadImage(recipe.value.image); // Upload image and get URL
    } catch (error) {
      alert("Image upload failed!");
      return;
    }
  }

  const recipeData = { ...recipe.value, image: imageUrl }; // Add image URL to recipe data
  await saveRecipe($db, userId.value, recipeData); // Save recipe with image URL
  alert("Recipe saved successfully!");
};
</script>

<template>
  <div>
    <h2>Add Recipe</h2>
    <input v-model="recipe.title" placeholder="Recipe Title" />
    <textarea v-model="recipe.ingredients" placeholder="Ingredients"></textarea>
    <textarea v-model="recipe.instructions" placeholder="Instructions"></textarea>
    
    <!-- Image Upload -->
    <input type="file" accept="image/*" @change="handleImageUpload" />

    <button @click="submitRecipe">Save Recipe</button>
  </div>
</template>
