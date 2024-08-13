<template>
  <div class="w-[60%] mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
    <h2 class="text-2xl font-bold mb-4">TO-DO LIST</h2>
    <div class="flex mb-4">
      <input v-model="search" type="text" placeholder="Search tasks..." class="flex-grow p-2 border-b-2 border-teal-500 outline-none" />
      <button @click="openAddModal" class="ml-2 bg-teal-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </div>
    <select v-model="filter" class="ml-2 border-gray-300 rounded-md shadow-sm p-2">
      <option value="">All</option>
      <option value="completed">Completed</option>
      <option value="notCompleted">Not Completed</option>
    </select>
    <ul>
      <li v-for="(task, index) in filteredTasks" :key="index" class="flex items-center mb-2">
        <input
          type="checkbox"
          v-model="task.completed"
          @change="updateTask(index)"
          class="mr-2"
        />
        <span
          :class="{'line-through': task.completed, 'font-bold': !task.completed}"
          class="flex-grow"
        >
          {{ task.title.slice(0, 20) }}...
          <span v-if="task.dueDate" class="text-sm text-gray-500">Due on {{ task.dueDate }}</span>
        </span>
        <button @click="openDetailModal(index)" class="bg-green-500 text-white px-2 py-1 rounded mr-3">Detail</button>
        <button @click="openEditModal(index)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-3">Edit</button>
        <button @click="confirmDelete(index)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
      </li>
    </ul>
    <!-- Add Task Modal -->
    <Modal ref="taskModal">
      <TaskForm :task="selectedTask" :index="selectedIndex" @close="closeModal" />
    </Modal>
    <!-- Confirm Delete Modal -->
    <Modal v-if="showConfirmationModal" @close="closeConfirmationModal">
      <div class="p-4">
        <p>Are you sure you want to delete this task?</p>
        <div class="mt-4">
          <button @click="deleteTask" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          <button @click="closeConfirmationModal" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/todo'
import Modal from './Modal.vue'
import TaskForm from './modalForm.vue'

const store = useTaskStore()
const search = ref('')
const filter = ref('')
const showConfirmationModal = ref(false)
const selectedTask = ref(null)
const selectedIndex = ref(null)

const filteredTasks = computed(() => {
  return store.filteredTasks(search.value, filter.value, '', '')
})

const openAddModal = () => {
  selectedTask.value = null
  selectedIndex.value = null
  taskModal.value.openModal()
}

const openEditModal = (index) => {
  selectedTask.value = { ...store.tasks[index] }
  selectedIndex.value = index
  taskModal.value.openModal()
}

const closeModal = () => {
  taskModal.value.closeModal()
}

const confirmDelete = (index) => {
  if (Window.confirm ('Are you sure you want to delete this task?')) {
    deleteTask()
  }
}

const deleteTask = () => {
  store.deleteTask(selectedIndex.value)
  selectedIndex.value = null
  showConfirmationModal.value = false
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

const updateTask = (index) => {
  store.updateTask(index, store.tasks[index])
}

const taskModal = ref(null)
</script>

