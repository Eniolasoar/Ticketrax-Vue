import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/auth";

// Import pages
import LandingPage from "../pages/LandingPage.vue";
import Signup from "../components/auth/Signup.vue";
import Login from "../components/auth/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import TicketManagement from "../pages/TicketManagement.vue";

// Routes
const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/auth/signup",
    name: "Signup",
    component: Signup,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) next("/dashboard");
      else next();
    },
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) next("/dashboard");
      else next();
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/tickets",
    name: "TicketManagement",
    component: TicketManagement,
    meta: { requiresAuth: true },
  },
  // Catch-all redirect
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global route guard for protected pages
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/auth/login");
  } else {
    next();
  }
});

export default router;
