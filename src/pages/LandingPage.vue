<template>
  <div>
    <Navbar />
    <main>
      <Hero />
      <section class="container section">
        <Features />
      </section>
      <section class="container section">
        <Banner />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/LandingPage/Navbar.vue";
import Hero from "../components/LandingPage/Hero.vue";
import Features from "../components/LandingPage/Features.vue";
import Banner from "../components/LandingPage/Banner.vue";
import Footer from "../components/shared/Footer.vue";
</script>
