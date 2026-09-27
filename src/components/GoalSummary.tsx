"use client";

import { useState } from "react";
import { Goal, GoalFormData } from "@/types";
import { ArrowUpRight, CheckCircle, PencilSimple, Plus, Target, Trash, X } from "@phosphor-icons/react";

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
    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Savings Goals</p>
          <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">Target tabungan</h3>
        </div>
        <div className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
          {goals.length} goal{goals.length > 1 ? "s" : ""}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Goal name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Dana darurat"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Target</label>
          <input
            type="number"
            min={0}
            value={target}
            onChange={(event) => setTarget(Number(event.target.value))}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Saved</label>
          <input
            type="number"
            min={0}
            value={currentAmount}
            onChange={(event) => setCurrentAmount(Number(event.target.value))}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="flex h-[46px] items-center justify-center gap-2 self-end rounded-xl bg-zinc-950 px-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus size={16} weight="bold" />
          Add
        </button>
      </form>

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Belum ada target tabungan.
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.target) * 100, 100);
            const remaining = goal.target - goal.currentAmount;
            const isComplete = goal.currentAmount >= goal.target;
            const isEditing = editingGoalId === goal.id;

            return (
              <div key={goal.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />

                      <input
                        type="number"
                        min={0}
                        value={editingTarget}
                        onChange={(event) => setEditingTarget(Number(event.target.value))}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />

                      <input
                        type="number"
                        min={0}
                        value={editingCurrentAmount}
                        onChange={(event) => setEditingCurrentAmount(Number(event.target.value))}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />

                      <input
                        type="date"
                        value={editingDeadline}
                        onChange={(event) => setEditingDeadline(event.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGoalId(null)}
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Target size={18} weight="fill" className="text-violet-600" />
                          <p className="font-bold text-zinc-950 dark:text-white">{goal.name}</p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {goal.deadline ? new Date(goal.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "Tanpa deadline"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle size={12} weight="fill" />
                            Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                            <ArrowUpRight size={12} weight="fill" />
                            In progress
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => startEditing(goal)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteGoal(goal.id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-rose-100 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                        >
                          <Trash size={16} weight="bold" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2 flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
                      <span>{formatCurrency(goal.currentAmount)} saved</span>
                      <span>{formatCurrency(goal.target)} target</span>
                    </div>

                    <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : "bg-violet-500"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <span>{isComplete ? "Completed" : "Remaining"}</span>
                      <span className={isComplete ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-950 dark:text-white"}>
                        {formatCurrency(Math.max(remaining, 0))}
                      </span>
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
