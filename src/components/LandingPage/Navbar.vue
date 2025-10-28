<template>
  <header class="site-header" role="banner">
    <div class="container nav-inner">
      <!-- Logo -->
      <a href="/" class="logo" aria-label="Go to Ticketrax homepage">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Ticketrax logo"
        >
          <circle cx="12" cy="12" r="10" fill="#0b6eff"></circle>
          <path d="M7 12h10" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          <path d="M12 7v10" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span class="logo-text" aria-hidden="true">Ticketrax</span>
      </a>

      <!-- Hamburger -->
      <button
        class="nav-toggle"
        :aria-expanded="open"
        aria-controls="primary-navigation"
        :aria-label="open ? 'Close navigation menu' : 'Open navigation menu'"
        @click="toggleMenu"
      >
        <span class="hamburger" aria-hidden="true"></span>
      </button>

      <!-- Navigation -->
      <nav
        id="primary-navigation"
        class="nav"
        :class="{ open }"
        aria-label="Primary navigation"
      >
        <ul role="menubar" class="nav-list">
          <li role="none">
            <a class="nav-link" href="#features" role="menuitem" tabindex="0">Features</a>
          </li>
          <li role="none">
            <a class="nav-link" href="/auth/login" role="menuitem" tabindex="0">Login</a>
          </li>
          <li role="none">
            <a class="btn btn-primary2 nav-cta" href="/auth/signup" role="menuitem" tabindex="0">
              Sign up
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

const open = ref(false);
const toggleMenu = () => {
  open.value = !open.value;
};
</script>
