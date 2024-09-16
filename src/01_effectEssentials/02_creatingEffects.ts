import { Effect } from "effect"

/*
 * Effect.succeed(value) creates an effect that succeeds with the given value.
 * Effect.fail(error) creates an effect that fails with the given error.
 */

const divideEffect = (a: number, b: number): Effect.Effect<number, Error> =>
	b === 0
		? Effect.fail(new Error("Cannot divide by zero"))
		: Effect.succeed(a / b)

/*
 * You can also create an effect that fails with a specific error type.
 * This is useful when you want to handle different types of errors in your application.
 */

class DivideByZeroError extends Error {
	readonly _tag = "DivideByZeroError"
}

const divideEffectError = (
	a: number,
	b: number,
): Effect.Effect<number, DivideByZeroError> =>
	b === 0 ? Effect.fail(new DivideByZeroError()) : Effect.succeed(a / b)

const divideByZeroExample = divideEffectError(10, 0)

/*
 * Effect.succeed and Effect.fail are forcing a return type of Effect<User, UserNotFoundError>.
 * This ensures that the effect always returns a User on success or a UserNotFoundError on failure,
 * providing type safety and clear error handling throughout the application.
 */

class UserNotFoundError extends Error {
	readonly _tag = "UserNotFoundError"
}

interface User {
	readonly id: number
	readonly name: string
}

const getUser = (userId: number): Effect.Effect<User, UserNotFoundError> => {
	const userDatabase: Record<number, User> = {
		1: { id: 1, name: "John Doe" },
		2: { id: 2, name: "Jane Doe" },
	}

	const user = userDatabase[userId]
	return user ? Effect.succeed(user) : Effect.fail(new UserNotFoundError())
}

const exampleUserEffect = getUser(1)
