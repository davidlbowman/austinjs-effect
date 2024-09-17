import { Effect } from "effect"

/*
 * Asynchronous effects are those that execute immediately and return a value.
 * They are the simplest form of effect and are useful for modeling operations
 * that do not require asynchronous execution or external dependencies.
 */

const delay = (message: string) =>
	Effect.promise<string>(
		() =>
			new Promise((resolve) => {
				setTimeout(() => {
					resolve(message)
				}, 1000)
			}),
	)

const programDelay = delay("Hello World")

/*
 * Effect.tryPromise is a powerful function that allows you to execute an asynchronous function
 * and handle any potential UnknownException error that may occur during its execution.
 */

const getTodo = (id: number) =>
	Effect.tryPromise({
		try: () => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`),
		catch: (unknown) => new Error(`Failed to fetch todo: ${unknown}`),
	})

const programGetTodo = getTodo(1)
