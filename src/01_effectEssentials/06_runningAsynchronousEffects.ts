import { Effect, Exit } from "effect"

/*
 * Effect.runPromise is a function that executes an effect asynchronously and returns a Promise.
 * It is useful for executing effects in an asynchronous manner, such as in a browser environment.
 */

const program = Effect.runPromise(Effect.succeed(1))

/*
 * Effect.runPromiseExit is a function that executes an effect asynchronously and returns an Exit.
 * It is useful for executing effects in an asynchronous manner, such as in a browser environment.
 * An Exit is a value that represents the result of an effect, either a success or a failure.
 * Exit.match is a function that allows you to match on the result of an effect and handle
 * the success or failure of the effect.
 */

const simulationAsync = Effect.runPromiseExit(Effect.fail("async error"))

simulationAsync.then((exit) =>
	Effect.runSync(
		Exit.match(exit, {
			onFailure: (cause) =>
				Effect.sync(() =>
					console.error(
						`Exit.match: Async execution failed with cause: ${cause._tag}`,
					),
				),
			onSuccess: (value) =>
				Effect.sync(() =>
					console.log(
						`Exit.match: Async execution was successful with value: ${value}`,
					),
				),
		}),
	),
)
