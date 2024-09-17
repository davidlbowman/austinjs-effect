import { Effect, Exit } from "effect"

/*
 * Effect.runSync is a function that executes an effect synchronously and returns the result.
 * It is useful for executing effects in a synchronous manner, such as in a Node.js environment.
 */

const program = Effect.sync(() => {
	console.log("Hello World")
	return 1
})

const result = Effect.runSync(program)

/*
 * Effect.runSyncExit is a function that executes an effect synchronously and returns an Exit.
 * It is useful for executing effects in a synchronous manner, such as in a Node.js environment.
 * An Exit is a value that represents the result of an effect, either a success or a failure.
 * Exit.match is a function that allows you to match on the result of an effect and handle
 * the success or failure of the effect.
 */

const simulation = Effect.runSyncExit(Effect.fail("error"))
Exit.match(simulation, {
	onFailure: (cause) =>
		console.error(`Exit.match: Execution failed with cause: ${cause._tag}`),
	onSuccess: (value) =>
		console.log(`Exit.match: Execution was successful with value: ${value}`),
})
