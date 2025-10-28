<template>
  <main class="auth-page">
    <h2>Login To Your Account</h2>
    <form @submit.prevent="handleSubmit" novalidate>
      <label>
        Username or Email
        <input
          type="text"
          v-model="form.identifier"
          :aria-describedby="error.identifier ? 'identifier-error' : undefined"
        />
        <span v-if="error.identifier" id="identifier-error" class="error">{{ error.identifier }}</span>
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

      <button type="submit" class="btn-primary">Login</button>
    </form>

    <p class="auth-switch">
      Don't have an account?
      <a href="/auth/signup" class="link">Signup</a>
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
import Toast from "../Toast.vue";
import Footer from "../shared/Footer.vue";
import { loginUser } from "../../utils/auth";

const form = reactive({ identifier: "", password: "" });
const error = reactive({});
const toast = ref(null);

const validate = () => {
  const errs = {};
  if (!form.identifier.trim()) errs.identifier = "Username or email is required.";
  if (!form.password) errs.password = "Password is required.";
  return errs;
};

const handleSubmit = () => {
  Object.assign(error, validate());
  if (Object.keys(error).length === 0) {
    try {
      loginUser(form);
      toast.value = { message: "Welcome back!", type: "success" };
      setTimeout(() => (window.location.href = "/dashboard"), 1000);
    } catch (err) {
      toast.value = { message: err.message, type: "error" };
    }
  }
};
</script>
