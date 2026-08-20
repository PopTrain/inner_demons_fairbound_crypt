<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'repoSelected', path: string): void
}>()

const errorMessage = ref('')
const isLoading = ref(false)

async function handleSelectFolder() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await window.api.selectRepoPath()
    
    if (result.success && result.path) {
      if (!result.hasGameFolder) {
        errorMessage.value = 'Warning: Selected folder does not contain a "game/" directory.'
      }
      emit('repoSelected', result.path)
    }
  } catch (error) {
    errorMessage.value = 'Failed to open directory dialog.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="selector-container">
    <div class="selector-card">
      <h1>Inner Demons Editor</h1>
      <p>Select your local repository folder to start managing game assets.</p>
      
      <button class="select-btn" @click="handleSelectFolder" :disabled="isLoading">
        {{ isLoading ? 'Opening Dialog...' : '📁 Select Repository Folder' }}
      </button>
      
      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.selector-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #121212;
  color: #fff;
}

.selector-card {
  background: #1e1e1e;
  border: 1px solid #333;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  max-width: 450px;
  width: 100%;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

p {
  color: #888;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.select-btn {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 100%;
}

.select-btn:hover {
  background: #4338ca;
}

.error-msg {
  color: #f87171;
  margin-top: 1rem;
  font-size: 0.85rem;
}
</style>