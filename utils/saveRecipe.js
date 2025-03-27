import { setDoc, doc, addDoc, collection } from 'firebase/firestore';
import { db } from '~/plugins/firebase';

export const saveRecipe = async (recipe, userId) => {
  if (!userId) {
    console.log('User not logged in');
    return;
  }

  try {
    // Save the recipe with image URL to Firestore
    const recipeRef = doc($db, 'recipes', recipe.id);  // If you're passing a custom ID
    await setDoc(recipeRef, {
      userId: userId,
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: recipe.image,  // Store the image URL
    });

    console.log('Recipe saved successfully!');
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};
