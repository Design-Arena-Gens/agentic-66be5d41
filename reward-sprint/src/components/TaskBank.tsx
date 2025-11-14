'use client';

import { useState } from 'react';
import { useFamily } from '@/context/FamilyProvider';
import type { Task } from '@/lib/types';
import { generateId } from '@/lib/utils';

const initialForm: Omit<Task, 'id'> = {
  title: '',
  description: '',
  points: 10,
  cadence: 'daily',
  category: 'cleaning',
  active: true,
};

export function TaskBank() {
  const {
    state: { tasks },
    dispatch,
  } = useFamily();
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState<Task | null>(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
  };

  const startEditing = (task: Task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description,
      points: task.points,
      cadence: task.cadence,
      category: task.category,
      active: task.active,
    });
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...editing, ...form, title: form.title.trim(), description: form.description.trim() },
      });
      resetForm();
      return;
    }
    const newTask: Task = {
      ...form,
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    resetForm();
  }

  function handleDelete(task: Task) {
    dispatch({ type: 'REMOVE_TASK', payload: { id: task.id } });
    if (editing?.id === task.id) {
      resetForm();
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-purple-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">Task Bank</h3>
          <p className="text-xs uppercase tracking-wide text-purple-200/60">
            Create quick clean-time sprints
          </p>
        </div>
        {editing && (
          <button
            className="text-xs font-semibold text-purple-200/80 hover:text-purple-100"
            onClick={resetForm}
            type="button"
          >
            Cancel edit
          </button>
        )}
      </div>

      <form className="mt-5 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <div className="md:col-span-1">
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Task name
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="10-min Clean Sweep"
            />
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Description
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Reset surfaces, return items home, quick vacuum"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Points
            <input
              type="number"
              min={1}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.points}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, points: Number(event.target.value) }))
              }
            />
          </label>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Cadence
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.cadence}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cadence: event.target.value as Task['cadence'] }))
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="adhoc">As needed</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Category
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  category: event.target.value as Task['category'],
                }))
              }
            >
              <option value="cleaning">Clean Time</option>
              <option value="habit">Habit</option>
              <option value="bonus">Bonus</option>
            </select>
          </label>
        </div>
        <div className="flex items-end">
          <button
            className="w-full rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow shadow-purple-500/30 transition hover:scale-[1.01]"
            type="submit"
          >
            {editing ? 'Save Task' : 'Add Task'}
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/5">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-purple-200/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Task</th>
              <th className="px-4 py-3 font-semibold">Cadence</th>
              <th className="px-4 py-3 font-semibold">Points</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {tasks.map((task) => (
              <tr key={task.id} className="bg-slate-950/40">
                <td className="px-4 py-4">
                  <p className="font-semibold text-white">{task.title}</p>
                  <p className="text-xs text-purple-100/70">{task.description}</p>
                </td>
                <td className="px-4 py-4 capitalize text-purple-100/80">{task.cadence}</td>
                <td className="px-4 py-4 text-orange-200">{task.points}</td>
                <td className="px-4 py-4 capitalize text-purple-100/80">{task.category}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-3 text-xs">
                    <button
                      className="font-semibold text-purple-200/80 hover:text-purple-100"
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="font-semibold text-red-200/80 hover:text-red-100"
                      onClick={() => handleDelete(task)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-purple-100/70"
                  colSpan={5}
                >
                  Add your first Clean Time task to kick off the sprint.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
