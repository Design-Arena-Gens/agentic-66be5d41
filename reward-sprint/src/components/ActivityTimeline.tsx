'use client';

import { useMemo } from 'react';
import { useFamily } from '@/context/FamilyProvider';

const colors: Record<string, string> = {
  task: 'bg-lime-300/20 border-lime-300/40 text-lime-100',
  reward: 'bg-orange-300/20 border-orange-300/40 text-orange-100',
  system: 'bg-purple-300/20 border-purple-300/40 text-purple-100',
};

export function ActivityTimeline() {
  const {
    state: { activity, children },
  } = useFamily();

  const items = useMemo(() => activity.slice(0, 10), [activity]);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-purple-100/70">
        Activity feed is quiet. As kids complete tasks and redeem rewards you&apos;ll see it here.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-purple-500/10">
      <h3 className="text-xl font-semibold text-white">Family activity</h3>
      <p className="text-xs uppercase tracking-wide text-purple-200/60">
        Real-time pulse on clean time and redemptions
      </p>
      <ul className="mt-5 space-y-4">
        {items.map((log) => {
          const child = log.childId ? children.find((item) => item.id === log.childId) : null;
          return (
            <li
              key={log.id}
              className="flex items-start gap-4 rounded-2xl bg-slate-950/60 p-4"
            >
              <span
                className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  colors[log.type] ?? colors.system
                }`}
              >
                {log.type.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-sm text-purple-100/90">{log.message}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-purple-200/60">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  {child && <span>Child: {child.name}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
