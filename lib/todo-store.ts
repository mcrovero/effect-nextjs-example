import { promises as fs } from "fs";
import path from "path";
import { Data, Effect, Context, Layer } from "effect";

export class TodoStoreError extends Data.TaggedError("TodoStoreError")<{
  message: string;
}> {}

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "todos.json");

const ensureStore = Effect.fn("ensureStore")(function* () {
  yield* Effect.promise(() => fs.mkdir(DATA_DIR, { recursive: true }));
  // Access file, create if missing
  yield* Effect.promise(() => fs.access(FILE_PATH)).pipe(
    Effect.catchAll(() =>
      Effect.promise(() => fs.writeFile(FILE_PATH, "[]", "utf8"))
    )
  );
});

const readTodosImpl = Effect.fn("readTodos")(function* () {
  yield* ensureStore();
  const content = yield* Effect.promise(() => fs.readFile(FILE_PATH, "utf8"));

  if (Math.random() < 0.2) {
    yield* Effect.fail(new TodoStoreError({ message: "Random read failure" }));
  }

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed as Todo[];
    }
    return [] as Todo[];
  } catch {
    return [] as Todo[];
  }
});

const writeTodos = Effect.fn("writeTodos")(function* (todos: Todo[]) {
  yield* ensureStore();
  const serialized = JSON.stringify(todos, null, 2);
  yield* Effect.promise(() => fs.writeFile(FILE_PATH, serialized, "utf8"));
});

const createTodoImpl = Effect.fn("createTodo")(function* (title: string) {
  const todos = yield* readTodosImpl();
  const newTodo: Todo = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  };
  const next = [newTodo, ...todos];
  yield* writeTodos(next);
  return next as Todo[];
});

const toggleTodoImpl = Effect.fn("toggleTodo")(function* (id: string) {
  const todos = yield* readTodosImpl();
  const next = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  yield* writeTodos(next);
  return next as Todo[];
});

const deleteTodoImpl = Effect.fn("deleteTodo")(function* (id: string) {
  const todos = yield* readTodosImpl();
  const next = todos.filter((t) => t.id !== id);
  yield* writeTodos(next);
  return next as Todo[];
});

export class TodoStore extends Context.Tag("TodoStore")<
  TodoStore,
  {
    readTodos: Effect.Effect<Todo[], TodoStoreError>;
    createTodo: (title: string) => Effect.Effect<Todo[], TodoStoreError>;
    toggleTodo: (id: string) => Effect.Effect<Todo[], TodoStoreError>;
    deleteTodo: (id: string) => Effect.Effect<Todo[], TodoStoreError>;
  }
>() {}

const makeTodoStore = Effect.gen(function* () {
  return {
    readTodos: readTodosImpl(),
    createTodo: (title: string) => createTodoImpl(title),
    toggleTodo: (id: string) => toggleTodoImpl(id),
    deleteTodo: (id: string) => deleteTodoImpl(id),
  } as const;
});

export const TodoStoreLive = Layer.effect(TodoStore, makeTodoStore);
