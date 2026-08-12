import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (userId) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) {
      set({ loading: false })
      throw error
    }
    set({ tasks: data, loading: false })
  },

  createTask: async (userId, title, description) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: userId, title, description })
      .select()
      .single()
    if (error) throw error
    set({ tasks: [data, ...get().tasks] })
    return data
  },

  toggleTask: async (taskId, completed) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId)
    if (error) throw error
    set({
      tasks: get().tasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      ),
    })
  },

  updateTask: async (taskId, updates) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
    if (error) throw error
    set({
      tasks: get().tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })
  },

  deleteTask: async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
    if (error) throw error
    set({ tasks: get().tasks.filter((task) => task.id !== taskId) })
  },
}))
