'use client';

import { useMemo } from 'react';
import { useFamily } from '@/context/FamilyProvider';

export function PendingRewards() {
  const {
    state: { rewardRequests, rewards, children },
    dispatch,
  } = useFamily();

  const pending = useMemo(
    () => rewardRequests.filter((request) => request.status === 'pending'),
    [rewardRequests]
  );

  if (!pending.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-purple-100/70">
        No pending redemptions. Kids can request rewards from their kiosk once they have enough
        points.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((request) => {
        const child = children.find((item) => item.id === request.childId);
        const reward = rewards.find((item) => item.id === request.rewardId);
        if (!child || !reward) return null;
        return (
          <div
            key={request.id}
            className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-400/10 via-slate-950/60 to-purple-400/5 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-purple-200/70">Pending reward</p>
                <h3 className="text-lg font-semibold text-white">
                  {child.name} → {reward.title}
                </h3>
                <p className="text-xs text-purple-100/70">
                  {new Date(request.requestedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-orange-200">
                  {reward.cost} pts
                </span>
                <button
                  className="rounded-full border border-lime-300/50 bg-lime-300/20 px-4 py-2 text-xs font-semibold text-lime-100 transition hover:bg-lime-300/30"
                  onClick={() =>
                    dispatch({
                      type: 'RESOLVE_REWARD',
                      payload: { requestId: request.id, status: 'approved' },
                    })
                  }
                >
                  Approve
                </button>
                <button
                  className="rounded-full border border-red-400/50 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-400/20"
                  onClick={() =>
                    dispatch({
                      type: 'RESOLVE_REWARD',
                      payload: { requestId: request.id, status: 'declined' },
                    })
                  }
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
