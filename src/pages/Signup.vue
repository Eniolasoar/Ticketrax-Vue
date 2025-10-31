<template>
  <main class="auth-page">
    <h2>Create an account</h2>
    <form @submit.prevent="handleSubmit" novalidate>
      <label>
        Username
        <input
          type="text"
          v-model="form.username"
          :aria-describedby="error.username ? 'username-error' : undefined"
        />
        <span v-if="error.username" id="username-error" class="error">{{ error.username }}</span>
      </label>

      <label>
        Email
        <input
          type="email"
          v-model="form.email"
          :aria-describedby="error.email ? 'email-error' : undefined"
        />
        <span v-if="error.email" id="email-error" class="error">{{ error.email }}</span>
      </label>

      <label>
        Password
        <input
          type="password"
          v-model="form.password"
          :aria-describedby="error.password ? 'password-error' : undefined"
        />
        <span v-if="error.password" id="password-error" class="error">{{ error.password }}</span>
      </label>

      <label>
        Confirm Password
        <input
          type="password"
          v-model="form.confirm"
          :aria-describedby="error.confirm ? 'confirm-error' : undefined"
        />
        <span v-if="error.confirm" id="confirm-error" class="error">{{ error.confirm }}</span>
      </label>

      <button type="submit" class="btn-primary">Sign Up</button>
    </form>

    <p class="auth-switch">
      Already have an account?
      <a href="/auth/login" class="link">Login</a>
    </p>

    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      :onClose="() => (toast = null)"
    />
    <Footer />
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import Toast from "../components/Toast.vue";
import Footer from "../components/shared/Footer.vue";
import { signupUser } from "../utils/auth";

const form = reactive({ username: "", email: "", password: "", confirm: "" });
const error = reactive({});
const toast = ref(null);

const validate = () => {
  const errs = {};
  if (!form.username.trim()) errs.username = "Username is required.";
  if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Please enter a valid email.";
  if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
  if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
  return errs;
};

const handleSubmit = () => {
  Object.assign(error, validate());
  if (Object.keys(error).length === 0) {
    try {
      signupUser(form);
      toast.value = { message: "Account created successfully!", type: "success" };
      setTimeout(() => (window.location.href = "/dashboard"), 1000);
    } catch (err) {
      toast.value = { message: err.message, type: "error" };
    }
  }
};
</script>
