"use client";

import type { Todo } from "@/lib/services/todo-store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  createTodoAction,
  deleteTodoAction,
  getTodosAction,
  searchTodosAction,
  toggleTodoAction,
} from "./actions";

export const ClientComponent = ({ initial }: { initial: readonly Todo[] }) => {
  const [todos, setTodos] = useState<readonly Todo[]>(initial);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const showError = (message: string) => {
    setError(message);
  };

  useEffect(() => {
    // Keep fresh client-side on mount
    getTodosAction().then((r) => {
      if (r.error) {
        showError(r.error);
      } else {
        setTodos([...r.todos]);
      }
    });
  }, []);

  useEffect(() => {
    // Initialize search from URL
    const searchParam = searchParams.get("search") || "";
    setSearchQuery(searchParam);
  }, [searchParams]);

  const add = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      const r = await createTodoAction({ title });
      if (r.error) {
        showError(r.error);
      } else {
        setTodos([...r.todos]);
      }
      setTitle("");
    });
  };

  const toggle = (id: string) => {
    startTransition(async () => {
      const r = await toggleTodoAction({ id });
      if (r.error) {
        showError(r.error);
      } else {
        setTodos([...r.todos]);
      }
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const r = await deleteTodoAction({ id });
      if (r.error) {
        showError(r.error);
      } else {
        setTodos([...r.todos]);
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "/";
    window.history.replaceState(null, "", newUrl);

    // Search todos
    startTransition(async () => {
      const r = await searchTodosAction({ query: query.trim() || undefined });
      if (r.error) {
        showError(r.error);
      } else {
        setTodos([...r.todos]);
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-start justify-between gap-3">
          <div>{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-xs rounded border px-2 py-1 hover:bg-red-100"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search todos..."
          className="flex-1 rounded-md border px-3 py-2 bg-transparent"
        />
      </div>
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo title"
          className="flex-1 rounded-md border px-3 py-2 bg-transparent"
        />
        <button
          onClick={add}
          disabled={isPending}
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggle(t.id)}
              className="size-4"
            />
            <div className="flex-1">
              <div
                className={t.completed ? "line-through text-neutral-500" : ""}
              >
                {t.title}
              </div>
              <div className="text-xs text-neutral-500">
                {new Date(t.createdAt).toISOString()}
              </div>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-xs rounded border px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Delete
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-sm text-neutral-500">No todos yet.</li>
        )}
      </ul>
    </div>
  );
};
