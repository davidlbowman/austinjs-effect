import { Effect } from "effect"

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

const getTodo = (id: number) =>
	Effect.tryPromise({
		try: () => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`),
		catch: (unknown) => new Error(`Failed to fetch todo: ${unknown}`),
	})

const programGetTodo = getTodo(1)
