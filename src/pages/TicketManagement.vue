<template>
  <div :class="['dashboard-container', { 'sidebar-open': sidebarOpen }]">
    <!-- ====== Top Navbar (Mobile) ====== -->
    <header class="mobile-header" role="banner">
      <button
        class="menu-toggle"
        @click="sidebarOpen = !sidebarOpen"
        :aria-expanded="sidebarOpen.toString()"
        aria-controls="sidebar"
        aria-label="Toggle sidebar menu"
      >
        ☰
      </button>
      <h1 class="mobile-title">Ticketrax</h1>
    </header>

    <!-- ====== Sidebar ====== -->
    <aside
      id="sidebar"
      :class="['sidebar', { open: sidebarOpen }]"
      role="navigation"
      aria-label="Main sidebar navigation"
    >
      <h2 class="logo">Ticketrax</h2>
      <nav>
        <ul>
          <li><button @click="goTo('/dashboard')">Dashboard</button></li>
          <li><button @click="goTo('/tickets')">Ticket Management</button></li>
          <li><button @click="handleLogout" class="logout-btn">Logout</button></li>
        </ul>
      </nav>
    </aside>

    <!-- ====== Main Content ====== -->
    <main class="dashboard-main" role="main">
      <div class="content-header">
        <div>
          <h2>Ticket Management</h2>
          <p>Manage, track, and update all your tickets efficiently.</p>
        </div>
        <button
          class="btn-primary"
          @click="openModal"
          aria-haspopup="dialog"
          aria-controls="create-ticket-modal"
        >
          + Create Ticket
        </button>
      </div>

      <!-- ====== Ticket List ====== -->
      <section class="ticket-list" aria-label="List of all tickets">
        <div v-if="tickets.length === 0" class="empty-state" role="status">
          <p>No tickets yet. Start by creating one below.</p>
        </div>
        <ul v-else class="ticket-grid">
          <li
            v-for="ticket in tickets"
            :key="ticket.id"
            :class="['ticket-card', ticket.status]"
            tabindex="0"
            :aria-label="`Ticket titled ${ticket.title}, status ${ticket.status}, priority ${ticket.priority}`"
          >
            <header class="ticket-header">
              <h3>{{ ticket.title }}</h3>
              <span class="status" :class="ticket.status">
                {{ ticket.status.replace('_', ' ') }}
              </span>
            </header>

            <span class="priority-pill" :class="ticket.priority">
              {{ ticket.priority }}
            </span>

            <p v-if="ticket.description">{{ ticket.description }}</p>

            <div class="ticket-actions">
              <button @click="editTicket(ticket)">Edit</button>
              <button class="delete" @click="confirmDelete = ticket.id">Delete</button>
            </div>
          </li>
        </ul>
      </section>

      <Footer />
    </main>

    <!-- ====== Modal ====== -->
    <div
      v-if="showModal"
      id="create-ticket-modal"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="modal-content">
        <header>
          <h3 id="modal-title">{{ editingId ? "Edit Ticket" : "Create Ticket" }}</h3>
          <button @click="closeModal" aria-label="Close modal" class="close-btn">✕</button>
        </header>

        <form class="ticket-form" @submit.prevent="handleSubmit" novalidate>
          <label for="title">Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            :aria-invalid="!!error.title"
          />
          <span v-if="error.title" id="title-error" class="error">{{ error.title }}</span>

          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            :aria-invalid="!!error.description"
          ></textarea>
          <span v-if="error.description" class="error">{{ error.description }}</span>

          <label for="status">Status</label>
          <select id="status" v-model="form.status">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <label for="priority">Priority</label>
          <select id="priority" v-model="form.priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button type="submit" class="btn-primary">
            {{ editingId ? "Update Ticket" : "Create Ticket" }}
          </button>
        </form>
      </div>
    </div>

    <!-- ====== Delete Confirmation ====== -->
    <div
      v-if="confirmDelete"
      class="confirm-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div class="confirm-box">
        <h4 id="confirm-title">Confirm Deletion</h4>
        <p>Are you sure you want to delete this ticket?</p>
        <div class="confirm-actions">
          <button @click="confirmDelete = null">Cancel</button>
          <button class="delete" @click="handleDelete">Yes, Delete</button>
        </div>
      </div>
    </div>

    <Toast v-if="toast" :type="toast.type" :message="toast.message" @close="toast = null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";
import Footer from "../components/shared/Footer.vue";

const router = useRouter();

const tickets = ref([]);
const form = ref({ title: "", description: "", status: "open", priority: "low" });
const error = ref({});
const editingId = ref(null);
const toast = ref(null);
const sidebarOpen = ref(false);
const showModal = ref(false);
const confirmDelete = ref(null);

// ✅ Load tickets & session
onMounted(() => {
  const session = localStorage.getItem("ticketapp_session");
  if (!session) {
    router.push("/auth/login");
    return;
  }
  const stored = JSON.parse(localStorage.getItem("ticketapp_tickets") || "[]");
  tickets.value = stored;
});

const saveTickets = (data) => {
  localStorage.setItem("ticketapp_tickets", JSON.stringify(data));
  tickets.value = data;
};

const validate = () => {
  const newError = {};
  if (!form.value.title.trim()) newError.title = "Title is required.";
  if (!form.value.description.trim()) newError.description = "Description is required.";
  if (form.value.description.length > 300)
    newError.description = "Description must be under 300 characters.";
  error.value = newError;
  return Object.keys(newError).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  let updated;

  if (editingId.value) {
    updated = tickets.value.map((t) =>
      t.id === editingId.value ? { ...t, ...form.value } : t
    );
    toast.value = { type: "success", message: "Ticket updated successfully." };
  } else {
    updated = [
      ...tickets.value,
      { id: Date.now(), ...form.value, createdAt: new Date().toISOString() },
    ];
    toast.value = { type: "success", message: "Ticket created successfully." };
  }

  saveTickets(updated);
  form.value = { title: "", description: "", status: "open", priority: "low" };
  editingId.value = null;
  showModal.value = false;
};

const editTicket = (ticket) => {
  form.value = { ...ticket };
  editingId.value = ticket.id;
  showModal.value = true;
};

const handleDelete = () => {
  const filtered = tickets.value.filter((t) => t.id !== confirmDelete.value);
  saveTickets(filtered);
  confirmDelete.value = null;
  toast.value = { type: "info", message: "Ticket deleted successfully." };
};

const handleLogout = () => {
  localStorage.removeItem("ticketapp_session");
  toast.value = { type: "success", message: "Logged out successfully." };
  setTimeout(() => router.push("/auth/login"), 800);
};

const goTo = (path) => router.push(path);
const openModal = () => (showModal.value = true);
const closeModal = () => {
  showModal.value = false;
  editingId.value = null;
  error.value = {};
};
</script>

<style scoped>
@import "../components/styles/ticket.css";
</style>
