import { collection, addDoc, Firestore } from "firebase/firestore";

/**
 * Saves a recipe to Firestore.
 * @param {object} db - Firestore database instance.
 * @param {string} userId - The authenticated user's ID.
 * @param {object} recipe - The recipe data (title, ingredients, instructions, image).
 */
export const saveRecipe = async (db: Firestore, userId: any, recipe: { title: any; ingredients: any; instructions: any; image: any; }) => {
  try {
    await addDoc(collection(db, "recipes"), {
      userId, // Store the authenticated user ID
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: recipe.image || "", // Optional image URL
      createdAt: new Date(),
    });
    console.log("Recipe saved successfully!");
  } catch (error) {
    console.error("Error saving recipe:", error);
  }
};
