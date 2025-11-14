'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import type {
  Activity,
  Child,
  FamilyAction,
  FamilyContextValue,
  FamilyState,
  RewardRequest,
} from '@/lib/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'reward-sprint::state';

const defaultState: FamilyState = {
  onboardingCompleted: false,
  trialEndsAt: null,
  familyName: null,
  admins: [],
  children: [],
  tasks: [
    {
      id: generateId(),
      title: 'Room Reset Sprint',
      description: '10-minute tidy sweep of bedroom or shared space.',
      points: 10,
      cadence: 'daily',
      category: 'cleaning',
      active: true,
    },
    {
      id: generateId(),
      title: 'Laundry Launch',
      description: 'Start a load of laundry and move it to dryer.',
      points: 15,
      cadence: 'weekly',
      category: 'habit',
      active: true,
    },
    {
      id: generateId(),
      title: 'Bonus Helping Hand',
      description: 'Jump in to help a sibling or parent without being asked.',
      points: 20,
      cadence: 'adhoc',
      category: 'bonus',
      active: true,
    },
  ],
  rewards: [
    {
      id: generateId(),
      title: '30-Min Screen Pass',
      description: 'Extra screen time token for tonight.',
      cost: 25,
      quantity: null,
      type: 'privilege',
    },
    {
      id: generateId(),
      title: '$5 Allowance Boost',
      description: 'Cash reward added to allowance payout.',
      cost: 60,
      quantity: null,
      type: 'cash',
    },
    {
      id: generateId(),
      title: 'Saturday Donut Run',
      description: 'Pick the bakery and the treats.',
      cost: 80,
      quantity: 2,
      type: 'experience',
    },
  ],
  rewardRequests: [],
  sprint: {
    id: generateId(),
    startAt: new Date().toISOString(),
    cleanTimeMinutes: 10,
    focusArea: 'Daily Reset',
  },
  activity: [],
};

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

function withNewActivity(state: FamilyState, activity: Activity): FamilyState {
  return {
    ...state,
    activity: [activity, ...state.activity].slice(0, 25),
  };
}

function createActivity(message: string, type: Activity['type'], childId?: string) {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    message,
    type,
    childId,
  } satisfies Activity;
}

function isSameDay(a?: string, b?: string) {
  if (!a || !b) return false;
  const dayA = new Date(a);
  const dayB = new Date(b);
  return (
    dayA.getUTCFullYear() === dayB.getUTCFullYear() &&
    dayA.getUTCMonth() === dayB.getUTCMonth() &&
    dayA.getUTCDate() === dayB.getUTCDate()
  );
}

function createChildFromOnboarding(input: { name: string; pin: string }): Child {
  return {
    id: generateId(),
    name: input.name.trim(),
    pin: input.pin,
    points: 0,
    streak: 0,
    lastCheckIn: undefined,
    completedToday: [],
  };
}

function familyReducer(state: FamilyState, action: FamilyAction): FamilyState {
  switch (action.type) {
    case 'HYDRATE': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'COMPLETE_ONBOARDING': {
      const payload = action.payload;
      const admins = [
        {
          id: generateId(),
          name: payload.admin.name.trim(),
          email: payload.admin.email.toLowerCase(),
          createdAt: new Date().toISOString(),
        },
      ];
      if (payload.coAdmin) {
        admins.push({
          id: generateId(),
          name: payload.coAdmin.name.trim(),
          email: payload.coAdmin.email.toLowerCase(),
          createdAt: new Date().toISOString(),
        });
      }
      const children = payload.children.map(createChildFromOnboarding);
      const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const activity = createActivity(
        `${payload.familyName} launched a 30-day RewardSprint trial.`,
        'system'
      );
      return {
        ...state,
        onboardingCompleted: true,
        trialEndsAt,
        familyName: payload.familyName.trim(),
        admins,
        children,
        activity: [activity, ...state.activity],
      };
    }
    case 'ADD_CHILD': {
      const child = createChildFromOnboarding(action.payload);
      return withNewActivity(
        {
          ...state,
          children: [...state.children, child],
        },
        createActivity(`Added ${child.name} to the family roster.`, 'system', child.id)
      );
    }
    case 'UPDATE_CHILD': {
      const children = state.children.map((child) =>
        child.id === action.payload.id
          ? { ...child, name: action.payload.name.trim(), pin: action.payload.pin }
          : child
      );
      return { ...state, children };
    }
    case 'REMOVE_CHILD': {
      const child = state.children.find((c) => c.id === action.payload.id);
      if (!child) return state;
      return withNewActivity(
        {
          ...state,
          children: state.children.filter((c) => c.id !== action.payload.id),
        },
        createActivity(`Removed ${child.name} from the roster.`, 'system', child.id)
      );
    }
    case 'ADD_TASK': {
      const tasks = [...state.tasks, action.payload];
      return withNewActivity(
        { ...state, tasks },
        createActivity(`New task added: ${action.payload.title}`, 'system')
      );
    }
    case 'UPDATE_TASK': {
      const tasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
      return { ...state, tasks };
    }
    case 'REMOVE_TASK': {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (!task) return state;
      const tasks = state.tasks.filter((t) => t.id !== action.payload.id);
      return withNewActivity(
        { ...state, tasks },
        createActivity(`Task removed: ${task.title}`, 'system')
      );
    }
    case 'ADD_REWARD': {
      const rewards = [...state.rewards, action.payload];
      return withNewActivity(
        { ...state, rewards },
        createActivity(`Reward stocked: ${action.payload.title}`, 'system')
      );
    }
    case 'UPDATE_REWARD': {
      const rewards = state.rewards.map((reward) =>
        reward.id === action.payload.id ? action.payload : reward
      );
      return { ...state, rewards };
    }
    case 'REMOVE_REWARD': {
      const reward = state.rewards.find((r) => r.id === action.payload.id);
      if (!reward) return state;
      const rewards = state.rewards.filter((r) => r.id !== action.payload.id);
      return withNewActivity(
        { ...state, rewards },
        createActivity(`Reward removed: ${reward.title}`, 'system')
      );
    }
    case 'RECORD_TASK_COMPLETION': {
      const { childId, taskId, date } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;
      let didUpdate = false;
      const children = state.children.map((child) => {
        if (child.id !== childId) return child;
        const newDay = !isSameDay(child.lastCheckIn, date);
        const completedToday = newDay ? [] : child.completedToday;
        if (completedToday.includes(taskId)) {
          return child;
        }
        didUpdate = true;
        const updatedCompleted = [...completedToday, taskId];
        let streak = child.streak || 0;
        if (!child.lastCheckIn) {
          streak = 1;
        } else {
          const last = new Date(child.lastCheckIn);
          const current = new Date(date);
          const diff =
            (current.setUTCHours(0, 0, 0, 0) - last.setUTCHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24);
          if (diff === 0) {
            streak = child.streak;
          } else if (diff === 1) {
            streak = child.streak + 1;
          } else {
            streak = 1;
          }
        }
        return {
          ...child,
          points: child.points + task.points,
          completedToday: updatedCompleted,
          lastCheckIn: date,
          streak,
        };
      });
      if (!didUpdate) {
        return state;
      }
      const updatedChild = children.find((child) => child.id === childId)!;
      return withNewActivity(
        {
          ...state,
          children,
        },
        createActivity(
          `${updatedChild.name} completed "${task.title}" (+${task.points} pts).`,
          'task',
          childId
        )
      );
    }
    case 'REQUEST_REWARD': {
      const { childId, rewardId } = action.payload;
      const child = state.children.find((c) => c.id === childId);
      const reward = state.rewards.find((r) => r.id === rewardId);
      if (!child || !reward) return state;
      if (child.points < reward.cost) return state;
      const request: RewardRequest = {
        id: generateId(),
        childId,
        rewardId,
        status: 'pending',
        requestedAt: new Date().toISOString(),
      };
      return withNewActivity(
        {
          ...state,
          rewardRequests: [request, ...state.rewardRequests],
        },
        createActivity(
          `${child.name} requested "${reward.title}" (${reward.cost} pts).`,
          'reward',
          childId
        )
      );
    }
    case 'RESOLVE_REWARD': {
      const request = state.rewardRequests.find((r) => r.id === action.payload.requestId);
      if (!request) return state;
      if (request.status !== 'pending') return state;
      const reward = state.rewards.find((r) => r.id === request.rewardId);
      const child = state.children.find((c) => c.id === request.childId);
      if (!reward || !child) return state;
      const rewardRequests = state.rewardRequests.map((r) =>
        r.id === request.id ? { ...r, status: action.payload.status } : r
      );
      let nextRewards = state.rewards;
      if (action.payload.status === 'approved' && reward.quantity !== null) {
        nextRewards = state.rewards.map((r) =>
          r.id === reward.id ? { ...r, quantity: Math.max((r.quantity ?? 0) - 1, 0) } : r
        );
      }
      const children = state.children.map((c) =>
        c.id === child.id && action.payload.status === 'approved'
          ? { ...c, points: c.points - reward.cost }
          : c
      );
      const message =
        action.payload.status === 'approved'
          ? `${child.name} redeemed "${reward.title}".`
          : `${child.name}'s request for "${reward.title}" was declined.`;
      return withNewActivity(
        {
          ...state,
          rewardRequests,
          rewards: nextRewards,
          children,
        },
        createActivity(message, 'reward', child.id)
      );
    }
    case 'SCHEDULE_SPRINT': {
      return withNewActivity(
        {
          ...state,
          sprint: {
            id: generateId(),
            startAt: action.payload.startAt,
            cleanTimeMinutes: action.payload.cleanTimeMinutes,
            focusArea: action.payload.focusArea,
          },
        },
        createActivity(
          `Next RewardSprint set for ${new Date(
            action.payload.startAt
          ).toLocaleString()} (${action.payload.cleanTimeMinutes}-min focus).`,
          'system'
        )
      );
    }
    default:
      return state;
  }
}

function parseStoredState(data: string | null): FamilyState | null {
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as FamilyState;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(familyReducer, defaultState);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = parseStoredState(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      dispatch({ type: 'HYDRATE', payload: stored });
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasHydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<FamilyContextValue>(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
