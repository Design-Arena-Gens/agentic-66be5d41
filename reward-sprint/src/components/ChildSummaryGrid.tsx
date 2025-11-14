'use client';

import { useFamily } from '@/context/FamilyProvider';

export function ChildSummaryGrid() {
  const {
    state: { children },
  } = useFamily();

  if (!children.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-purple-100/80">
        Add children to start tracking Clean Time streaks and point balances.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {children.map((child) => (
        <div
          key={child.id}
          className="rounded-3xl border border-purple-200/15 bg-gradient-to-br from-slate-950 via-slate-950/60 to-purple-900/20 p-5 shadow shadow-purple-500/10"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{child.name}</h3>
              <p className="text-xs uppercase tracking-wide text-purple-200/70">Clean Time Hero</p>
            </div>
            <span className="rounded-full border border-purple-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-purple-100">
              PIN {child.pin}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-purple-100/70">Points</p>
              <p className="text-xl font-semibold text-orange-200">{child.points}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-purple-100/70">Streak</p>
              <p className="text-xl font-semibold text-white">{child.streak}d</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-purple-100/70">Completed</p>
              <p className="text-xl font-semibold text-white">{child.completedToday.length}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-purple-100/70">
            Last check-in:{' '}
            {child.lastCheckIn
              ? new Date(child.lastCheckIn).toLocaleString()
              : 'No Clean Time logged yet'}
          </p>
        </div>
      ))}
    </div>
  );
}
