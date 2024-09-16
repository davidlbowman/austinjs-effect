import { Effect } from "effect"

/*
 * Synchronous effects are those that execute immediately and return a value.
 * They are the simplest form of effect and are useful for modeling operations
 * that do not require asynchronous execution or external dependencies.
 */

const log = (message: string) =>
	Effect.sync(() => {
		console.log(message)
	})

const programLog = log("Hello World")

/*
 * Effect.try is a powerful function that allows you to execute a synchronous function
 * and handle any potential UnknownException error that may occur during its execution.
 */

const parse = (input: string) =>
	Effect.try({
		try: () => JSON.parse(input),
		catch: (unknown) => new Error(`Failed to parse JSON: ${unknown}`),
	})

const programParse = parse("{")
