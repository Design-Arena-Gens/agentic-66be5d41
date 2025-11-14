'use client';

import { useState } from 'react';
import { useFamily } from '@/context/FamilyProvider';
import type { Reward } from '@/lib/types';
import { generateId } from '@/lib/utils';

const baseReward: Omit<Reward, 'id'> = {
  title: '',
  description: '',
  cost: 25,
  quantity: null,
  type: 'privilege',
};

export function RewardsInventory() {
  const {
    state: { rewards },
    dispatch,
  } = useFamily();
  const [form, setForm] = useState(baseReward);
  const [editing, setEditing] = useState<Reward | null>(null);

  const resetForm = () => {
    setForm(baseReward);
    setEditing(null);
  };

  const startEditing = (reward: Reward) => {
    setEditing(reward);
    setForm({
      title: reward.title,
      description: reward.description,
      cost: reward.cost,
      quantity: reward.quantity,
      type: reward.type,
    });
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      dispatch({
        type: 'UPDATE_REWARD',
        payload: { ...editing, ...form, title: form.title.trim(), description: form.description.trim() },
      });
      resetForm();
      return;
    }
    const reward: Reward = {
      ...form,
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim(),
    };
    dispatch({ type: 'ADD_REWARD', payload: reward });
    resetForm();
  }

  function handleDelete(reward: Reward) {
    dispatch({ type: 'REMOVE_REWARD', payload: { id: reward.id } });
    if (editing?.id === reward.id) resetForm();
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-purple-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">Reward Store</h3>
          <p className="text-xs uppercase tracking-wide text-purple-200/60">
            Stock experiences, cash boosts, and privileges
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
            Reward name
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Friday Movie Night"
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
              placeholder="Winner picks takeout + movie"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Cost (points)
            <input
              type="number"
              min={5}
              step={5}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.cost}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cost: Number(event.target.value) }))
              }
            />
          </label>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Type
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.type}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, type: event.target.value as Reward['type'] }))
              }
            >
              <option value="privilege">Privilege</option>
              <option value="experience">Experience</option>
              <option value="cash">Cash</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-purple-200/70">
            Quantity (leave blank for unlimited)
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
              value={form.quantity ?? ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  quantity: event.target.value ? Number(event.target.value) : null,
                }))
              }
              placeholder="Unlimited"
            />
          </label>
        </div>
        <div className="flex items-end">
          <button
            className="w-full rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow shadow-purple-500/30 transition hover:scale-[1.01]"
            type="submit"
          >
            {editing ? 'Save Reward' : 'Add Reward'}
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-inner shadow-purple-500/10"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{reward.title}</h4>
                <p className="text-xs uppercase tracking-wide text-purple-200/60">
                  {reward.type}
                </p>
              </div>
              <span className="rounded-full border border-orange-200/50 bg-orange-200/10 px-3 py-1 text-xs font-semibold text-orange-100">
                {reward.cost} pts
              </span>
            </div>
            <p className="mt-3 text-sm text-purple-100/80">{reward.description}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-purple-100/70">
              <span>
                Stock:{' '}
                {reward.quantity === null ? 'Unlimited' : reward.quantity > 0 ? reward.quantity : 'Out'}
              </span>
              <div className="flex gap-3 font-semibold">
                <button
                  className="text-purple-200/80 hover:text-purple-100"
                  onClick={() => startEditing(reward)}
                >
                  Edit
                </button>
                <button
                  className="text-red-200/80 hover:text-red-100"
                  onClick={() => handleDelete(reward)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        {rewards.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-sm text-purple-100/70">
            No rewards yet. Add cash boosts, experiences, or privileges to motivate clean-time
            sprints.
          </div>
        )}
      </div>
    </div>
  );
}
