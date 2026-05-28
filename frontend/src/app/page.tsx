"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  ListTodo, 
  Filter, 
  Sparkles, 
  Loader2,
  Trash
} from "lucide-react";
import { Task, TaskFilter } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // States for editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/tasks`);
      const result = await res.json();
      if (result.success) {
        setTasks(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        setTasks((prev) => [...prev, result.data]);
        setNewTitle("");
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle task completed state
  const handleToggleTask = async (task: Task) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const result = await res.json();
      if (result.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? result.data : t))
        );
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  // Edit task title
  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? result.data : t))
        );
        setEditingId(null);
        setEditingTitle("");
      }
    } catch (err) {
      console.error("Failed to edit task:", err);
    }
  };

  // Delete a single task
  const handleDeleteTask = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Delete all completed tasks
  const handleDeleteCompleted = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks/completed`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setTasks((prev) => prev.filter((t) => !t.completed));
      }
    } catch (err) {
      console.error("Failed to delete completed tasks:", err);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  }, [tasks, filter]);

  // Task counters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tasklist Premium
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Stateless, fast, and modern task manager</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full text-xs font-medium text-slate-400 border border-slate-800">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            <span>Developer Mode</span>
          </div>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAddTask} className="flex flex-row gap-2 mb-6 w-full">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Apa tugas harianmu hari ini, bro?"
            disabled={submitting}
            className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting || !newTitle.trim()}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 disabled:text-indigo-400/50 text-white font-medium text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-2 active:scale-95 disabled:active:scale-100 shadow-lg shadow-indigo-600/10"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>Tambah</span>
          </button>
        </form>

        {/* Statistics & Filters Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 mb-6">
          {/* Counters */}
          <div className="flex gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">{totalTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Selesai:</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                {completedTasks} / {totalTasks}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === "all"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                  : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === "active"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                  : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === "completed"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                  : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Selesai
            </button>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            <p className="text-sm text-slate-500">Memuat daftar tugas...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
            <div className="mx-auto w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mb-4 text-slate-500">
              <ListTodo className="h-6 w-6" />
            </div>
            <h3 className="text-slate-300 font-bold text-base mb-1">
              {tasks.length === 0 ? "Tidak ada tugas, bro!" : "Tidak ada tugas di filter ini"}
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {tasks.length === 0 
                ? "Semua kewajiban selesai, saatnya leyeh-leyeh atau tambahkan tugas baru di atas."
                : "Ubah filter di atas untuk melihat tugas lainnya."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-4 bg-slate-950 border rounded-xl transition-all ${
                  task.completed 
                    ? "border-slate-800/40 bg-slate-950/40 opacity-70" 
                    : "border-slate-800/80 hover:border-slate-700/80"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Status Toggle Checkbox */}
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`transition-all ${
                      task.completed ? "text-emerald-500" : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 fill-emerald-500/10" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  {/* Task Content */}
                  {editingId === task.id ? (
                    <div className="flex items-center gap-1.5 flex-1 pr-4">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(task.id)}
                        className="flex-1 bg-slate-900 border border-indigo-500 rounded px-2.5 py-1 text-sm focus:outline-none text-slate-100"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 bg-slate-900 text-slate-400 border border-slate-800 rounded hover:bg-slate-800"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleToggleTask(task)}
                      className={`text-sm cursor-pointer select-none truncate pr-4 ${
                        task.completed 
                          ? "line-through text-slate-500" 
                          : "text-slate-200"
                      }`}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                {/* Actions */}
                {editingId !== task.id && (
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    {!task.completed && (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-all"
                        title="Edit Tugas"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all"
                      title="Hapus Tugas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Clear Completed Tasks Button */}
        {completedTasks > 0 && (
          <div className="border-t border-slate-800/80 mt-6 pt-6 flex justify-end">
            <button
              onClick={handleDeleteCompleted}
              className="bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white transition-all font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-md"
            >
              <Trash className="h-3.5 w-3.5" />
              <span>Hapus Semua Tugas Selesai</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
