export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="rounded-xl border p-5">
        <div className="h-5 w-36 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-3 h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-6 h-10 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="rounded-xl border p-5">
        <div className="h-5 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-3 h-4 w-72 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-6 h-9 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}


