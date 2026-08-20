<script setup lang="ts">
defineProps<{
    categories: Array<{ id: string; name: string; icon: string; description: string }>
}>()

const emit = defineEmits<{
    (e: 'selectCategory', id: string): void
}>()
</script>

<template>
    <div class="dashboard-container">
        <h1>Inner Demons Database Editor</h1>
        <p class="subtitle">Select a category to manage game data</p>

        <div class="category-grid">
            <div
             v-for="cat in categories"
             :key="cat.id"
             class="category-card"
             @click="emit('selectCategory', cat.id)"
            >
             <div class="icon-wrapper">
                <span class ="icon">{{ cat.icon }}</span>
            </div>
            <span class="category-name">{{ cat.name }}</span>
            <span class="category-desc">{{ cat.description }}</span>
        </div>
    </div>
</div>
</template>

<style scoped>
.dashboard-container {
  padding: 3rem;
  background: #121212;
  color: #fff;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subtitle {
  color: #888;
  margin-bottom: 2.5rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.category-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  background: #2a2a2a;
  border-color: #555;
  transform: translateY(-4px);
}

.icon-wrapper {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.category-desc {
  font-size: 0.85rem;
  color: #aaa;
  text-align: center;
}
</style>