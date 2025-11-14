'use client';

import { useFamily } from '@/context/FamilyProvider';
import { TrialStatusCard } from '@/components/TrialStatusCard';
import { SprintPlanner } from '@/components/SprintPlanner';
import { ChildSummaryGrid } from '@/components/ChildSummaryGrid';
import { PendingRewards } from '@/components/PendingRewards';
import { TaskBank } from '@/components/TaskBank';
import { RewardsInventory } from '@/components/RewardsInventory';
import { ChildKiosk } from '@/components/ChildKiosk';
import { ActivityTimeline } from '@/components/ActivityTimeline';

export function ParentWorkspace() {
  const {
    state: { familyName, admins },
  } = useFamily();

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-purple-200/70">
              Welcome back
            </p>
            <h1 className="text-4xl font-semibold text-white">
              {familyName} RewardSprint HQ
            </h1>
            <p className="mt-2 text-sm text-purple-100/80">
              Manage tasks, approve rewards, and keep the Clean Time sprint motivation-first.
            </p>
          </div>
          {admins.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-purple-100/80">
              Admins:{' '}
              {admins.map((admin) => admin.name).join(' · ')}
            </div>
          )}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <TrialStatusCard />
          <SprintPlanner />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <ChildSummaryGrid />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-purple-500/10">
          <h3 className="text-xl font-semibold text-white">Reward approvals</h3>
          <p className="text-xs uppercase tracking-wide text-purple-200/60">
            Review and approve kid redemption requests
          </p>
          <div className="mt-4">
            <PendingRewards />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TaskBank />
        <RewardsInventory />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <ChildKiosk />
        <ActivityTimeline />
      </section>
    </div>
  );
}
