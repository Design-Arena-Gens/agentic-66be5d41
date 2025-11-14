'use client';

import { useMemo, useState } from 'react';
import { useFamily } from '@/context/FamilyProvider';
import { generateId } from '@/lib/utils';

interface ChildDraft {
  id: string;
  name: string;
  pin: string;
}

const steps = ['Account', 'Family', 'Children'] as const;

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function OnboardingWizard() {
  const {
    dispatch,
    state: { onboardingCompleted },
  } = useFamily();
  const [step, setStep] = useState(0);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [coAdminName, setCoAdminName] = useState('');
  const [coAdminEmail, setCoAdminEmail] = useState('');
  const [children, setChildren] = useState<ChildDraft[]>([
    { id: generateId(), name: '', pin: generatePin() },
  ]);

  const [error, setError] = useState('');

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  if (onboardingCompleted) return null;

  function nextStep() {
    if (step === 0) {
      if (!parentName.trim() || !parentEmail.trim()) {
        setError('Provide parent name and email to start the trial.');
        return;
      }
    }
    if (step === 1) {
      if (!familyName.trim()) {
        setError('Name your family to continue.');
        return;
      }
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function previousStep() {
    setError('');
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function updateChild(id: string, patch: Partial<ChildDraft>) {
    setChildren((prev) =>
      prev.map((child) => (child.id === id ? { ...child, ...patch } : child))
    );
  }

  function addChild() {
    setChildren((prev) => [
      ...prev,
      { id: generateId(), name: '', pin: generatePin() },
    ]);
  }

  function removeChild(id: string) {
    setChildren((prev) => (prev.length > 1 ? prev.filter((child) => child.id !== id) : prev));
  }

  function complete() {
    if (children.some((child) => !child.name.trim())) {
      setError('Give each child a name before launching RewardSprint.');
      return;
    }
    const cleanedChildren = children.map((child) => ({
      name: child.name.trim(),
      pin: child.pin,
    }));
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: {
        admin: { name: parentName.trim(), email: parentEmail.trim() },
        coAdmin: coAdminEmail
          ? { name: coAdminName.trim() || 'Co-Admin', email: coAdminEmail.trim() }
          : null,
        familyName: familyName.trim(),
        children: cleanedChildren,
      },
    });
  }

  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-purple-200">RewardSprint Trial</p>
          <h2 className="text-3xl font-semibold text-white">Launch your family rewards engine</h2>
          <p className="mt-2 max-w-xl text-sm text-purple-100/80">
            In three quick steps you&apos;ll open a 30-day full-featured trial, invite your partner,
            and set up kid kiosks with PINs ready for Clean Time.
          </p>
        </div>
        <div className="hidden text-right md:block">
          <p className="text-lg font-semibold text-purple-100">Step {step + 1}</p>
          <p className="text-sm text-purple-200/80">of {steps.length}</p>
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-purple-200/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr,1.2fr]">
        <ul className="space-y-4 text-sm text-purple-100/70">
          {steps.map((label, index) => (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-full border px-4 py-3 transition ${
                index === step
                  ? 'border-purple-400/80 bg-purple-400/10 text-white shadow shadow-purple-500/20'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  index <= step ? 'bg-purple-400 text-slate-900' : 'bg-white/10 text-purple-200'
                }`}
              >
                {index + 1}
              </span>
              <span className="capitalize">{label}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-inner shadow-purple-500/10">
          {step === 0 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-white">Parent account</h3>
              <p className="text-sm text-purple-100/70">
                Sign in with email or drop a social link. We&apos;ll activate your 30-day trial with
                every feature turned on.
              </p>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-purple-100">
                  Parent name
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-purple-400/0 transition focus:ring-4 focus:ring-purple-400/30"
                    value={parentName}
                    onChange={(event) => setParentName(event.target.value)}
                    placeholder="Jamie Parker"
                  />
                </label>
                <label className="block text-sm font-medium text-purple-100">
                  Email or social handle
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-purple-400/0 transition focus:ring-4 focus:ring-purple-400/30"
                    value={parentEmail}
                    onChange={(event) => setParentEmail(event.target.value)}
                    placeholder="jamie@family.com"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-white">Family hub</h3>
              <p className="text-sm text-purple-100/70">
                Give your RewardSprint a name and optionally invite a co-admin who shares approvals.
              </p>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-purple-100">
                  Family name
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-purple-400/0 transition focus:ring-4 focus:ring-purple-400/30"
                    value={familyName}
                    onChange={(event) => setFamilyName(event.target.value)}
                    placeholder="The Parker Crew"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-medium text-purple-100">
                    Invite co-admin (optional)
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-4 focus:ring-purple-400/30"
                      value={coAdminName}
                      onChange={(event) => setCoAdminName(event.target.value)}
                      placeholder="Morgan"
                    />
                  </label>
                  <label className="block text-sm font-medium text-purple-100">
                    Co-admin email
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-4 focus:ring-purple-400/30"
                      value={coAdminEmail}
                      onChange={(event) => setCoAdminEmail(event.target.value)}
                      placeholder="morgan@family.com"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-white">Kid kiosks</h3>
              <p className="text-sm text-purple-100/70">
                Create fast PIN logins for each kid. They&apos;ll use these to check in for their
                daily Clean Time.
              </p>
              <div className="space-y-4">
                {children.map((child, index) => (
                  <div
                    key={child.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-300/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-purple-100/90">
                        Child {index + 1}
                      </p>
                      <button
                        className="text-xs font-medium text-purple-200/80 hover:text-purple-200"
                        onClick={() => updateChild(child.id, { pin: generatePin() })}
                        type="button"
                      >
                        Regenerate PIN
                      </button>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-[2fr,1fr]">
                      <input
                        className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:ring-4 focus:ring-purple-400/30"
                        value={child.name}
                        onChange={(event) => updateChild(child.id, { name: event.target.value })}
                        placeholder="Taylor"
                      />
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3">
                        <span className="text-xs uppercase tracking-wide text-purple-200/80">
                          PIN
                        </span>
                        <input
                          className="flex-1 bg-transparent text-lg font-semibold tracking-[0.4em] text-white outline-none"
                          value={child.pin}
                          onChange={(event) =>
                            updateChild(child.id, {
                              pin: event.target.value.replace(/\D/g, '').slice(0, 4),
                            })
                          }
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        className="text-xs uppercase tracking-wide text-purple-200/70 hover:text-purple-100"
                        onClick={() => removeChild(child.id)}
                        type="button"
                        disabled={children.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="w-full rounded-xl border border-dashed border-purple-300/40 bg-white/5 py-3 text-sm font-semibold text-purple-100 hover:border-purple-300 hover:bg-purple-400/10"
                onClick={addChild}
                type="button"
              >
                + Add another child kiosk
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              className="text-sm font-medium text-purple-200/70 hover:text-purple-100 disabled:opacity-30"
              onClick={previousStep}
              type="button"
              disabled={step === 0}
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button
                className="rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-purple-500/20 transition hover:scale-[1.01]"
                onClick={nextStep}
                type="button"
              >
                Continue
              </button>
            ) : (
              <button
                className="rounded-xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-purple-500/20 transition hover:scale-[1.01]"
                onClick={complete}
                type="button"
              >
                Launch 30-day trial
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
