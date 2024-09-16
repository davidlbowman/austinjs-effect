import { Effect } from "effect"

const divide = (a: number, b: number): number => {
	if (b === 0) {
		throw new Error("Cannot divide by zero")
	}
	return a / b
}

/*
 * The Effect type is a powerful abstraction in the Effect library that represents
 * a computation which may succeed with a value of type A, fail with an error of type E,
 * or require an environment of type R. It's defined as Effect<A, E, R>, where:
 *
 * A: The success type (the result of the computation if it succeeds)
 * E: The error type that may occur during the computation
 * R: The environment type (dependencies the effect needs to run)
 *
 * Effects are lazy and composable, allowing for robust error handling, dependency
 * injection, and functional programming patterns in TypeScript.
 */

const divideEffect = (a: number, b: number): Effect.Effect<number, Error> =>
	b === 0
		? Effect.fail(new Error("Cannot divide by zero"))
		: Effect.succeed(a / b)
