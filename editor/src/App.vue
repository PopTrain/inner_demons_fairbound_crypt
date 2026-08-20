<script setup lang="ts">
import { ref } from 'vue'
import CategoryGrid from './components/CategoryGrid.vue'
import DatabaseEditor from './components/DatabaseEditor.vue'
import RepoSelector from './components/RepoSelector.vue'

const currentView = ref<'dashboard' | 'editor' | 'selector'>('dashboard')
const repoPath = ref<string>('')
const currentEntity = ref<string>('')

const categories = [
  { id: 'items', name: 'Items', icon: '🎒', description: 'Medicine, Treasure, Capture Cards...' },
  { id: 'demons', name: 'Demons', icon: '👹', description: 'Demon species and forms.' },
  { id: 'trainers', name: 'Trainers', icon: '🧙‍♂️', description: 'Trainer teams, rewards, and dialogue.' },
  { id: 'dialogue', name: 'Dialogue', icon: '💬', description: 'NPC Conversations.' }
]

const mockItems = ref(['Record 1', 'Record 2'])

function handleRepoSelected(path: string) {
  repoPath.value = path
  currentView.value = 'dashboard'
}

function handleSelectCategory(id: string) {
  currentEntity.value = id
  currentView.value = 'editor'
}

function handleBackToDashboard() {
  currentView.value = 'dashboard'
  currentEntity.value = ''
}

function handleSave() {
  console.log('Saving changes for:', currentEntity.value)
}
</script>

<template>
  <main>
    <RepoSelector v-if="!repoPath" @repoSelected="handleRepoSelected" />
    
    <div v-else class="main-editor">
      <p>Repository loaded: {{ repoPath }}</p>
    </div>
  </main>
  <div class="app-shell">
    <RepoSelector 
      v-if="currentView === 'selector'" 
      @repoSelected="handleRepoSelected" 
    />

    <CategoryGrid 
      v-else-if="currentView === 'dashboard'" 
      :categories="categories" 
      @selectCategory="handleSelectCategory" 
    />
    
    <div v-else-if="currentView === 'editor'" class="editor-view">
      <nav class="top-nav">
        <button class="back-btn" @click="handleBackToDashboard">← Back to Dashboard</button>
      </nav>
      <DatabaseEditor 
        :entityType="currentEntity" 
        :items="mockItems" 
        @save="handleSave" 
      />
    </div>
  </div>
</template>

<style>
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
  background: #121212;
}

.app-shell {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.editor-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-nav {
  background: #181818;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #333;
}

.back-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.back-btn:hover {
  background: #444;
}
</style>
