'use client';

import { useEffect, useState } from 'react';
import { useFamily } from '@/context/FamilyProvider';

function toInputValue(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function SprintPlanner() {
  const {
    state: { sprint },
    dispatch,
  } = useFamily();
  const [startAt, setStartAt] = useState(() => toInputValue(sprint.startAt));
  const [cleanTimeMinutes, setCleanTimeMinutes] = useState(sprint.cleanTimeMinutes);
  const [focusArea, setFocusArea] = useState(sprint.focusArea);

  useEffect(() => {
    setStartAt(toInputValue(sprint.startAt));
    setCleanTimeMinutes(sprint.cleanTimeMinutes);
    setFocusArea(sprint.focusArea);
  }, [sprint]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({
      type: 'SCHEDULE_SPRINT',
      payload: {
        startAt: new Date(startAt).toISOString(),
        cleanTimeMinutes,
        focusArea: focusArea.trim() || 'Clean Time',
      },
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-purple-500/10">
      <h3 className="text-xl font-semibold text-white">Next RewardSprint</h3>
      <p className="text-xs uppercase tracking-wide text-purple-200/60">
        Lock in tomorrow&apos;s clean-time window
      </p>

      <form className="mt-5 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="block text-xs uppercase tracking-wide text-purple-200/70">
          Start time
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
          />
        </label>
        <label className="block text-xs uppercase tracking-wide text-purple-200/70">
          Clean Time length (minutes)
          <input
            type="number"
            min={5}
            step={5}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
            value={cleanTimeMinutes}
            onChange={(event) => setCleanTimeMinutes(Number(event.target.value))}
          />
        </label>
        <label className="block text-xs uppercase tracking-wide text-purple-200/70">
          Focus area
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:ring-4 focus:ring-purple-400/30"
            value={focusArea}
            onChange={(event) => setFocusArea(event.target.value)}
            placeholder="Kitchen Reset"
          />
        </label>
        <div className="md:col-span-3 flex justify-end">
          <button
            className="rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow shadow-purple-500/30 transition hover:scale-[1.01]"
            type="submit"
          >
            Schedule sprint
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
        <p className="text-xs uppercase tracking-widest text-purple-200/60">Live plan</p>
        <h4 className="mt-2 text-lg font-semibold text-white">
          {new Date(sprint.startAt).toLocaleString(undefined, {
            weekday: 'short',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </h4>
        <p className="text-sm text-purple-100/80">
          {sprint.cleanTimeMinutes}-minute burst on <span className="font-semibold">{sprint.focusArea}</span>
        </p>
      </div>
    </div>
  );
}
