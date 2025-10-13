import { FileSystem } from "@effect/platform";
import { Data, Effect, Schema } from "effect";
import path from "path";

export class TodoStoreError extends Data.TaggedError("TodoStoreError")<{
  message: string;
}> {}

const TodoSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  completed: Schema.Boolean,
  createdAt: Schema.Number,
});

export type Todo = Schema.Schema.Type<typeof TodoSchema>;

export class TodoStore extends Effect.Service<TodoStore>()("app/TodoStore", {
  effect: Effect.gen(function* () {
    const DATA_DIR = path.join(process.cwd(), ".data");
    const FILE_PATH = path.join(DATA_DIR, "todos.json");
    const fs = yield* FileSystem.FileSystem;

    const readTodosFromFile = () =>
      Effect.gen(function* () {
        const content = yield* fs.readFileString(FILE_PATH, "utf8");
        const parsed = yield* Schema.decodeUnknown(Schema.Array(TodoSchema))(
          JSON.parse(content)
        );
        return parsed;
      });

    return {
      readTodos: Effect.fn("readTodos")(function* () {
        return yield* readTodosFromFile();
      }),
      searchTodos: Effect.fn("searchTodos")(function* (query?: string) {
        const todos = yield* readTodosFromFile();
        if (!query || query.trim() === "") {
          return todos;
        }
        const searchTerm = query.toLowerCase().trim();
        return todos.filter((todo) =>
          todo.title.toLowerCase().includes(searchTerm)
        );
      }),
      createTodo: Effect.fn("createTodo")(function* (title: string) {
        const todos = yield* readTodosFromFile();
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
        yield* fs.writeFileString(FILE_PATH, JSON.stringify(next, null, 2));
        return next;
      }),
      toggleTodo: Effect.fn("toggleTodo")(function* (id: string) {
        const todos = yield* readTodosFromFile();
        const next = todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        yield* fs.writeFileString(FILE_PATH, JSON.stringify(next, null, 2));
        return next;
      }),
      deleteTodo: Effect.fn("deleteTodo")(function* (id: string) {
        const todos = yield* readTodosFromFile();
        const next = todos.filter((t) => t.id !== id);
        yield* fs.writeFileString(FILE_PATH, JSON.stringify(next, null, 2));
        return next;
      }),
    };
  }),
}) {}
