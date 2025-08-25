"use server";

import { CurrentUser } from "@/lib/auth-middleware";
import { BaseAction } from "@/lib/base";
import * as Store from "@/lib/todo-store";
import { Effect, Schema } from "effect";

export const getTodos = BaseAction.build(async () =>
  Effect.gen(function* () {
    yield* CurrentUser;
    const todos = yield* Store.readTodos();
    return { todos, error: null } as const;
  }).pipe(
    Effect.catchAll((err) =>
      Effect.succeed({ todos: [], error: String((err as any)?.message ?? "Error fetching todos") } as const)
    )
  )
);

export const createTodoAction = BaseAction.setInputSchema(
  Schema.Struct({ title: Schema.String.pipe(Schema.minLength(1)) })
).build(async (request) =>
  Effect.gen(function* () {
    yield* CurrentUser;
    const input = yield* Effect.orDie(request.input);
    const todos = yield* Store.createTodo(input.title);
    return { todos, error: null } as const;
  }).pipe(
    Effect.catchAll((err) =>
      Effect.succeed({ todos: [], error: String((err as any)?.message ?? "Error creating todo") } as const)
    )
  )
);

export const toggleTodoAction = BaseAction.setInputSchema(
  Schema.Struct({ id: Schema.String })
).build(async (request) =>
  Effect.gen(function* () {
    yield* CurrentUser;
    const input = yield* Effect.orDie(request.input);
    const todos = yield* Store.toggleTodo(input.id);
    return { todos, error: null } as const;
  }).pipe(
    Effect.catchAll((err) =>
      Effect.succeed({ todos: [], error: String((err as any)?.message ?? "Error toggling todo") } as const)
    )
  )
);

export const deleteTodoAction = BaseAction.setInputSchema(
  Schema.Struct({ id: Schema.String })
).build(async (request) =>
  Effect.gen(function* () {
    yield* CurrentUser;
    const input = yield* Effect.orDie(request.input);
    const todos = yield* Store.deleteTodo(input.id);
    return { todos, error: null } as const;
  }).pipe(
    Effect.catchAll((err) =>
      Effect.succeed({ todos: [], error: String((err as any)?.message ?? "Error deleting todo") } as const)
    )
  )
);
