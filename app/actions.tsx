"use server";

import { BaseAction } from "@/lib/base";
import { TodoStore } from "@/lib/todo-store";
import { Effect } from "effect";

export const getTodosAction = async () =>
  BaseAction.run(
    TodoStore.pipe(
      Effect.flatMap((s) => s.searchTodos()),
      Effect.map((todos) => ({ todos, error: null } as const)),
      Effect.catchAll((err) =>
        Effect.succeed({
          todos: [],
          error: String((err as any)?.message ?? "Error reading todos"),
        } as const)
      )
    )
  );

export const searchTodosAction = async ({ query }: { query?: string }) =>
  BaseAction.run(
    TodoStore.pipe(
      Effect.flatMap((s) => s.searchTodos(query)),
      Effect.map((todos) => ({ todos, error: null } as const)),
      Effect.catchAll((err) =>
        Effect.succeed({
          todos: [],
          error: String((err as any)?.message ?? "Error searching todos"),
        } as const)
      )
    )
  );

export const createTodoAction = async ({ title }: { title: string }) =>
  BaseAction.run(
    TodoStore.pipe(
      Effect.flatMap((s) => s.createTodo(title)),
      Effect.map((todos) => ({ todos, error: null } as const)),
      Effect.catchAll((err) =>
        Effect.succeed({
          todos: [],
          error: String((err as any)?.message ?? "Error creating todo"),
        } as const)
      )
    )
  );

export const toggleTodoAction = async ({ id }: { id: string }) =>
  BaseAction.run(
    TodoStore.pipe(
      Effect.flatMap((s) => s.toggleTodo(id)),
      Effect.map((todos) => ({ todos, error: null } as const)),
      Effect.catchAll((err) =>
        Effect.succeed({
          todos: [],
          error: String((err as any)?.message ?? "Error toggling todo"),
        } as const)
      )
    )
  );

export const deleteTodoAction = async ({ id }: { id: string }) =>
  BaseAction.run(
    TodoStore.pipe(
      Effect.flatMap((s) => s.deleteTodo(id)),
      Effect.map((todos) => ({ todos, error: null } as const)),
      Effect.catchAll((err) =>
        Effect.succeed({
          todos: [],
          error: String((err as any)?.message ?? "Error deleting todo"),
        } as const)
      )
    )
  );
