'use client';

import { useFamily } from '@/context/FamilyProvider';

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function TrialStatusCard() {
  const {
    state: { trialEndsAt, familyName },
  } = useFamily();

  if (!trialEndsAt) return null;

  const endDate = new Date(trialEndsAt);
  const now = new Date();
  const diff = Math.max(0, endDate.getTime() - now.getTime());
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const statusLabel =
    daysRemaining === 0 ? 'Trial ends today' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-200/20 bg-gradient-to-br from-purple-400/15 via-purple-400/5 to-purple-300/10 p-6 shadow-inner shadow-purple-500/20">
      <div className="absolute -top-8 -right-10 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-purple-100/80">Trial Countdown</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{familyName} RewardSprint</h2>
        <div className="mt-6 flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-purple-100/70">Trial expires</p>
            <p className="text-2xl font-semibold text-white">{formatDate(trialEndsAt)}</p>
          </div>
          <div>
            <p className="text-sm text-purple-100/70">Time remaining</p>
            <p className="text-2xl font-semibold text-orange-200">{statusLabel}</p>
          </div>
        </div>
        <button className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
          Upgrade anytime
          <span className="inline-flex h-2 w-2 items-center justify-center rounded-full bg-lime-300" />
        </button>
      </div>
    </div>
  );
}
