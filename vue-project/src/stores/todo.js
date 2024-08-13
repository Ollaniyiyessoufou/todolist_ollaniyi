import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: JSON.parse(localStorage.getItem('tasks')) || []
  }),
  actions: {
    addTask(task) {
      this.tasks = [...this.tasks, task]
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },
    updateTask(index, task) {
      this.tasks[index] = task
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },
    deleteTask(index) {
      this.tasks.splice(index, 1)
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
  },
  getters: {
    filteredTasks: (state) => (search, filterStatus, filterPriority, filterDate) => {
      return state.tasks
        .filter(task => {
          if (filterStatus === 'completed' && !task.completed) return false
          if (filterStatus === 'notCompleted' && task.completed) return false

          if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false

          if (filterPriority && task.priority !== filterPriority) return false
          if (filterDate && task.dueDate < filterDate) return false

          return true
        })
    }
  }
})

