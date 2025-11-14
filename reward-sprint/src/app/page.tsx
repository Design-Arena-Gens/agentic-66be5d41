'use client';

import { useFamily } from '@/context/FamilyProvider';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { ParentWorkspace } from '@/components/ParentWorkspace';

export default function Home() {
  const { state } = useFamily();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-purple-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 md:px-10 lg:py-16">
        {!state.onboardingCompleted ? (
          <>
            <header className="space-y-6 text-white">
              <div className="inline-flex items-center gap-3 rounded-full border border-purple-300/50 bg-purple-400/10 px-4 py-2 text-xs uppercase tracking-widest text-purple-100/90">
                Motivation-first · Allowance automation · Daily clean time
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                RewardSprint is the family motivation &amp; rewards engine designed for quick daily
                wins.
              </h1>
              <p className="max-w-2xl text-lg text-purple-100/80">
                Trade a 10-minute clean sprint for points, cash boosts, and experiences. Parents set
                the sprint, kids tap tasks done, and everyone sees progress without surveillance.
              </p>
              <ul className="grid gap-3 text-sm text-purple-100/80 md:grid-cols-3">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Plug-and-play task bank</p>
                  <p className="mt-2 text-xs text-purple-200/70">
                    Launch daily Clean Time with preloaded sprints and custom chores.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Kid kiosks with PINs</p>
                  <p className="mt-2 text-xs text-purple-200/70">
                    Kids self-report progress in under a minute. No surveillance. No nagging.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Auto allowance &amp; rewards</p>
                  <p className="mt-2 text-xs text-purple-200/70">
                    Map points to cash boosts, privileges, and shared experiences.
                  </p>
                </li>
              </ul>
            </header>
            <OnboardingWizard />
          </>
        ) : (
          <ParentWorkspace />
        )}
      </div>
    </main>
  );
}
