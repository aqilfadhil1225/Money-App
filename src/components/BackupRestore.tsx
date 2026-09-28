"use client";

import { useRef, useState } from "react";
import { DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { AppData, BackupFile } from "@/types";

interface BackupRestoreProps {
  data: AppData;
  onRestore: (data: AppData) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidDate = (value: string) => Number.isFinite(Date.parse(value));

const isAppData = (value: unknown): value is AppData => {
  if (!isRecord(value)) return false;
  const { transactions, budgets, goals } = value;

  return (
    Array.isArray(transactions) &&
    transactions.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.id) &&
        isNonEmptyString(item.title) &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        (item.type === "income" || item.type === "expense") &&
        isNonEmptyString(item.category) &&
        typeof item.date === "string" &&
        isValidDate(item.date)
    ) &&
    Array.isArray(budgets) &&
    budgets.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.id) &&
        isNonEmptyString(item.category) &&
        typeof item.limit === "number" &&
        Number.isFinite(item.limit) &&
        item.limit > 0 &&
        typeof item.month === "string" &&
        /^\d{4}-\d{2}$/.test(item.month)
    ) &&
    Array.isArray(goals) &&
    goals.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.id) &&
        isNonEmptyString(item.name) &&
        typeof item.target === "number" &&
        Number.isFinite(item.target) &&
        item.target > 0 &&
        typeof item.currentAmount === "number" &&
        Number.isFinite(item.currentAmount) &&
        item.currentAmount >= 0 &&
        typeof item.deadline === "string" &&
        (item.deadline === "" || isValidDate(item.deadline))
    )
  );
};

const isBackupFile = (value: unknown): value is BackupFile =>
  isRecord(value) &&
  value.version === 1 &&
  typeof value.exportedAt === "string" &&
  isValidDate(value.exportedAt) &&
  isAppData(value.data);

export const BackupRestore = ({ data, onRestore }: BackupRestoreProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const handleExport = () => {
    const backup: BackupFile = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `money-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Backup berhasil diunduh.");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const backup: unknown = JSON.parse(await file.text());
      if (!isBackupFile(backup)) {
        setMessage("File backup tidak valid atau versinya tidak didukung.");
        return;
      }

      const confirmed = window.confirm(
        "Pulihkan backup ini? Data transaksi, anggaran, dan target saat ini akan diganti."
      );
      if (!confirmed) return;

      onRestore(backup.data);
      setMessage("Data berhasil dipulihkan.");
    } catch {
      setMessage("File tidak dapat dibaca. Pilih file backup JSON yang valid.");
    }
  };

  return (
    <div className="mb-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        Data
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <DownloadSimple size={16} />
          Backup
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <UploadSimple size={16} />
          Pulihkan
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImport}
        className="hidden"
        aria-label="Pilih file backup JSON"
      />
      <p className="mt-2 min-h-4 text-xs text-zinc-500 dark:text-zinc-400" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
};