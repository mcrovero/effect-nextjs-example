"use server";

import { BaseAction } from "@/lib/base";
import { TodoStore } from "@/lib/todo-store";
import { Effect } from "effect";

const _getTodosAction = Effect.fn("getTodosAction")(() =>
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
export const getTodosAction = BaseAction.build(_getTodosAction);

const _searchTodosAction = Effect.fn("searchTodosAction")(
  ({ query }: { query?: string }) =>
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
export const searchTodosAction = BaseAction.build(_searchTodosAction);

const _createTodoAction = Effect.fn("createTodoAction")(
  ({ title }: { title: string }) =>
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
export const createTodoAction = BaseAction.build(_createTodoAction);

const _toggleTodoAction = Effect.fn("toggleTodoAction")(
  ({ id }: { id: string }) =>
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
export const toggleTodoAction = BaseAction.build(_toggleTodoAction);

const _deleteTodoAction = Effect.fn("deleteTodoAction")(
  ({ id }: { id: string }) =>
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
export const deleteTodoAction = BaseAction.build(_deleteTodoAction);
