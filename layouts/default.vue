<script setup>
import { useNuxtApp } from "#app";
import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRoute } from "vue-router";  // Import useRoute to track active route

const { $auth } = useNuxtApp();
const user = ref(null);
const route = useRoute();  // Get the current route

onAuthStateChanged($auth, (authUser) => {
  user.value = authUser;
});

const logout = async () => {
  await signOut($auth);
  user.value = null;
};

// Check if the current route is active
const isActive = (path) => route.path === path;
</script>

<template>
  <div>
    <!-- Navigation Bar -->
    <nav>
      <div class="container">
        <div class="nav-links">
          <NuxtLink 
            to="/" 
            class="nav-link" 
            :class="{ active: isActive('/') }">Home</NuxtLink>
          <NuxtLink 
            to="/add-recipe" 
            class="nav-link" 
            :class="{ active: isActive('/add-recipe') }">Add Recipe</NuxtLink>
          <NuxtLink 
            to="/saved-recipes" 
            class="nav-link" 
            :class="{ active: isActive('/saved-recipes') }">Saved Recipes</NuxtLink>
          <NuxtLink 
            to="/dashboard" 
            v-if="user" 
            class="nav-link" 
            :class="{ active: isActive('/dashboard') }">My Recipes</NuxtLink>
          <button v-if="user" class="btn-logout" @click="logout">Logout</button>
          <NuxtLink to="/login" v-else class="nav-link" :class="{ active: isActive('/login') }">Login</NuxtLink>
        </div>
      </div>
    </nav>
    
    <!-- Page Content -->
    <NuxtPage />
  </div>
</template>

<style scoped>
/* General Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Navigation Bar Styles */
nav {
  background: #007bff;
  padding: 10px 0;
}

nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

nav .logo-link {
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
  text-decoration: none;
  letter-spacing: 2px;
}

nav .nav-links {
  display: inline-flex;
  align-items: center;

}

nav .nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  margin-right: 20px;
  transition: color 0.3s ease;
}

nav .nav-link:hover,
nav .nav-link.active {
  color: #ffcc00; /* Gold color for hover and active */
}

nav .btn-logout {
  background-color: #ff6f61;
  border: none;
  color: white;
  font-size: 1rem;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 20px;
  transition: background-color 0.3s ease;
}

nav .btn-logout:hover {
  background-color: #e04f3b;
}

@media (max-width: 768px) {
  nav .container {
    flex-direction: column;
    align-items: flex-start;
  }

  nav .nav-links {
    flex-direction: column;
    width: 100%;
  }

  nav .nav-link {
    margin-right: 0;
    margin-bottom: 10px;
  }

  nav .btn-logout {
    margin-bottom: 10px;
  }
}
</style>
