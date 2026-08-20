<script setup lang="ts">
defineProps<{ entityType: string; items: any[] }>();
const emit = defineEmits<{ (e: 'save'): void }>();
</script>

<template>
  <main class="editor-workspace">
    <header>
      <h1>Editing: {{ entityType.toUpperCase() }}</h1>
      <button @click="emit('save')">Save to Disk</button>
    </header>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID / Record Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(_item, index) in items" :key="index">
            <td>
              <textarea v-model="items[index]" rows="2" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.editor-workspace {
  flex: 1;
  padding: 2rem;
  background: #121212;
  color: #fff;
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
textarea {
  width: 100%;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 0.5rem;
}
</style>