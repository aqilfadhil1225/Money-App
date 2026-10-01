"use client";

import { useState } from "react";
import { Goal, GoalFormData } from "@/types";
import {
  ArrowUpRight,
  CalendarBlank,
  CheckCircle,
  Coins,
  PencilSimple,
  Plus,
  Target,
  Trash,
  X,
} from "@phosphor-icons/react";

interface GoalSummaryProps {
  goals: Goal[];
  onAddGoal: (data: GoalFormData) => void;
  onUpdateGoal: (id: string, data: GoalFormData) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalSummary = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalSummaryProps) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState(500000);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingTarget, setEditingTarget] = useState(500000);
  const [editingCurrentAmount, setEditingCurrentAmount] = useState(0);
  const [editingDeadline, setEditingDeadline] = useState("");

  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.target).length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || target <= 0 || currentAmount < 0) return;

    onAddGoal({
      name: name.trim(),
      target,
      currentAmount,
      deadline,
    });

    setName("");
    setTarget(500000);
    setCurrentAmount(0);
    setDeadline("");
  };

  const startEditing = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditingName(goal.name);
    setEditingTarget(goal.target);
    setEditingCurrentAmount(goal.currentAmount);
    setEditingDeadline(goal.deadline);
  };

  const saveEdit = () => {
    if (!editingGoalId) return;
    if (!editingName.trim() || editingTarget <= 0 || editingCurrentAmount < 0) return;

    onUpdateGoal(editingGoalId, {
      name: editingName.trim(),
      target: editingTarget,
      currentAmount: editingCurrentAmount,
      deadline: editingDeadline,
    });

    setEditingGoalId(null);
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-white via-violet-50/40 to-zinc-50 p-5 shadow-[0_18px_45px_-30px_rgba(109,40,217,0.4)] dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-emerald-500/10" />

      <div className="relative mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Savings Goals</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-zinc-950 dark:text-white">Target tabungan</h3>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
          <Target size={14} weight="fill" />
          {goals.length} goal{goals.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="relative mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>Total target</span>
            <Coins size={15} className="text-violet-500" weight="fill" />
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{formatCurrency(totalTarget)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>Terakumulasi</span>
            <ArrowUpRight size={15} className="text-emerald-500" weight="fill" />
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{formatCurrency(totalSaved)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>Complete</span>
            <CheckCircle size={15} className="text-emerald-500" weight="fill" />
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{completedGoals}/{goals.length || 0}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-6 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-emerald-50 p-3 dark:border-zinc-800 dark:from-zinc-900/80 dark:via-zinc-900/60 dark:to-zinc-950/80">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
            <Plus size={16} weight="bold" />
          </div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Tambah target baru</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Goal name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Dana darurat"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Target</label>
            <input
              type="number"
              min={0}
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Saved</label>
            <input
              type="number"
              min={0}
              value={currentAmount}
              onChange={(event) => setCurrentAmount(Number(event.target.value))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
            />
          </div>

          <button
            type="submit"
            className="flex h-[46px] items-center justify-center gap-2 self-end rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-800 px-3 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:brightness-110 dark:from-white dark:to-zinc-200 dark:text-zinc-950"
          >
            <Plus size={16} weight="bold" />
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-zinc-200 bg-white/70 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-400">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
              <Target size={22} weight="fill" />
            </div>
            Belum ada target tabungan.
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.target) * 100, 100);
            const remaining = goal.target - goal.currentAmount;
            const isComplete = goal.currentAmount >= goal.target;
            const isEditing = editingGoalId === goal.id;

            return (
              <div
                key={goal.id}
                className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/70"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${isComplete ? "from-emerald-500 to-emerald-400" : "from-violet-500 via-fuchsia-500 to-indigo-500"}`} />

                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
                      />

                      <input
                        type="number"
                        min={0}
                        value={editingTarget}
                        onChange={(event) => setEditingTarget(Number(event.target.value))}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
                      />

                      <input
                        type="number"
                        min={0}
                        value={editingCurrentAmount}
                        onChange={(event) => setEditingCurrentAmount(Number(event.target.value))}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
                      />

                      <input
                        type="date"
                        value={editingDeadline}
                        onChange={(event) => setEditingDeadline(event.target.value)}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/10"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGoalId(null)}
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                            <Target size={17} weight="fill" />
                          </div>
                          <p className="truncate text-base font-bold text-zinc-950 dark:text-white">{goal.name}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <CalendarBlank size={14} weight="bold" />
                          <span>
                            {goal.deadline
                              ? new Date(goal.deadline).toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Tanpa deadline"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle size={12} weight="fill" />
                            Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                            <ArrowUpRight size={12} weight="fill" />
                            In progress
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
                      <span>{formatCurrency(goal.currentAmount)} saved</span>
                      <span>{formatCurrency(goal.target)} target</span>
                    </div>

                    <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${isComplete ? "from-emerald-500 to-emerald-400" : "from-violet-500 via-fuchsia-500 to-indigo-500"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <span>{isComplete ? "Completed" : "Remaining"}</span>
                      <span className={isComplete ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-950 dark:text-white"}>
                        {formatCurrency(Math.max(remaining, 0))}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(goal)}
                        className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteGoal(goal.id)}
                        className="rounded-xl p-2 text-zinc-500 transition hover:bg-rose-100 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
