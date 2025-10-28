<template>
  <div :class="['dashboard-container', { 'sidebar-open': sidebarOpen }]">
    <header class="mobile-header">
      <button @click="sidebarOpen = !sidebarOpen" aria-label="Toggle sidebar menu">☰</button>
      <h1 class="mobile-title">Ticketrax Dashboard</h1>
    </header>

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

    <main class="dashboard-main">
      <section class="content-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here’s an overview of your tickets.</p>
        </div>
        <button class="btn-primary" @click="go('/tickets')">Go to Ticket Management</button>
      </section>

      <section class="stats-grid">
        <div class="stat-card"><h4>Total Tickets</h4><p>{{ stats.total }}</p></div>
        <div class="stat-card open"><h4>Open Tickets</h4><p>{{ stats.open }}</p></div>
        <div class="stat-card in-progress"><h4>In Progress</h4><p>{{ stats.in_progress }}</p></div>
        <div class="stat-card closed"><h4>Closed</h4><p>{{ stats.closed }}</p></div>
      </section>

      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/shared/Footer.vue'

const router = useRouter()
const sidebarOpen = ref(false)
const stats = ref({ total: 0, open: 0, in_progress: 0, closed: 0 })

onMounted(() => {
  const session = localStorage.getItem('ticketapp_session')
  if (!session) router.push('/auth/login')

  const tickets = JSON.parse(localStorage.getItem('ticketapp_tickets') || '[]')
  stats.value = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  }
})

const go = (path) => router.push(path)

const goTo = (path) => router.push(path)

const handleLogout = () => {
  localStorage.removeItem("ticketapp_session");
  toast.value = { type: "success", message: "Logged out successfully." };
  setTimeout(() => router.push("/auth/login"), 800);
};
</script>
