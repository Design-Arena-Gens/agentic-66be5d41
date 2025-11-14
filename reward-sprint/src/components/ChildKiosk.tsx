'use client';

import { useMemo, useState } from 'react';
import { useFamily } from '@/context/FamilyProvider';

function isTaskCompletedToday(taskId: string, childId: string, completedIds: string[]) {
  return completedIds.includes(taskId);
}

export function ChildKiosk() {
  const {
    state: { children, tasks, rewards },
    dispatch,
  } = useFamily();
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? '');

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId) ?? children[0],
    [children, selectedChildId]
  );

  if (!children.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-purple-100/70">
        Add children to unlock the RewardSprint kid kiosk.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-inner shadow-purple-500/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Child Kiosk</h3>
          <p className="text-xs uppercase tracking-wide text-purple-200/60">
            Kids tap tasks done, request rewards, and watch streaks climb
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedChild?.id === child.id
                  ? 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 text-slate-900 shadow shadow-purple-500/20'
                  : 'border border-white/10 bg-white/5 text-purple-100/80 hover:bg-white/10'
              }`}
              onClick={() => setSelectedChildId(child.id)}
            >
              {child.name}
            </button>
          ))}
        </div>
      </div>

      {selectedChild && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-200/70">
                  Clean Time queue
                </p>
                <h4 className="text-lg font-semibold text-white">Tap to mark done</h4>
              </div>
              <div className="rounded-full border border-orange-200/50 bg-orange-200/10 px-4 py-2 text-sm font-semibold text-orange-100">
                {selectedChild.points} pts ready
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {tasks.map((task) => {
                const completed = isTaskCompletedToday(
                  task.id,
                  selectedChild.id,
                  selectedChild.completedToday
                );
                return (
                  <button
                    key={task.id}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      completed
                        ? 'border-lime-300/40 bg-lime-300/10 text-lime-100'
                        : 'border-white/10 bg-slate-950/60 text-purple-100/90 hover:border-purple-300/40 hover:bg-purple-400/10'
                    }`}
                    disabled={completed}
                    onClick={() =>
                      dispatch({
                        type: 'RECORD_TASK_COMPLETION',
                        payload: {
                          childId: selectedChild.id,
                          taskId: task.id,
                          date: new Date().toISOString(),
                        },
                      })
                    }
                  >
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-xs text-purple-100/70">{task.description}</p>
                    </div>
                    <span className="rounded-full border border-orange-200/40 bg-orange-200/10 px-3 py-1 text-xs font-semibold text-orange-100">
                      +{task.points} pts
                    </span>
                  </button>
                );
              })}
              {tasks.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-purple-100/70">
                  Parents haven&apos;t added tasks yet. Task completions will appear here.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-200/70">
                  Reward vault
                </p>
                <h4 className="text-lg font-semibold text-white">Redeem your sprint points</h4>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {rewards.map((reward) => {
                const canRedeem =
                  selectedChild.points >= reward.cost &&
                  (reward.quantity === null || reward.quantity > 0);
                return (
                  <div
                    key={reward.id}
                    className="flex items-start justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{reward.title}</p>
                      <p className="text-xs text-purple-100/70">{reward.description}</p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-purple-200/60">
                        {reward.quantity === null ? 'Unlimited' : `${reward.quantity} remaining`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full border border-orange-200/40 bg-orange-200/10 px-3 py-1 text-xs font-semibold text-orange-100">
                        {reward.cost} pts
                      </span>
                      <button
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          canRedeem
                            ? 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 text-slate-900 shadow shadow-purple-500/20'
                            : 'border border-white/10 bg-white/5 text-purple-100/60'
                        }`}
                        onClick={() =>
                          dispatch({
                            type: 'REQUEST_REWARD',
                            payload: { childId: selectedChild.id, rewardId: reward.id },
                          })
                        }
                        disabled={!canRedeem}
                      >
                        {canRedeem ? 'Request reward' : 'Need more points'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {rewards.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-purple-100/70">
                  Parents will stock rewards here. Earn points each Clean Time sprint to unlock them.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
