// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#app';
import { onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  return new Promise((resolve) => {
    const { $auth } = useNuxtApp();

    onAuthStateChanged($auth, (user) => {
      if (!user) {
        if (to.path !== '/login') {
          return navigateTo('/login'); // Redirect only if NOT logged in
        }
      } else {
        if (to.path === '/login') {
          return navigateTo('/dashboard'); // Prevent logged-in users from staying on login
        }
      }
      resolve(true);
    });
  });
});
