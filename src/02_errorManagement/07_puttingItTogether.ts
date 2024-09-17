import { Cause, Console, Effect, Schedule } from "effect"

/*
 * This function demonstrates a comprehensive error management approach:
 * 1. It takes an age as input and validates it using `validateAge`.
 * 2. If the age is valid, it proceeds with a simulated flaky operation.
 * 3. The operation has a 50% chance of random failure.
 * 4. If it fails, it will retry using an exponential backoff strategy.
 * 5. The entire process has a timeout of 3 seconds.
 * 6. Various error types (NegativeAgeError, IllegalAgeError, RandomFailureError) are handled.
 * 7. It uses Effect for composable and type-safe error handling.
 * 8. Logging is incorporated to track the processing steps.
 * This setup showcases error validation, random failures, retries, and timeouts in a single
 * operation.
 */

class NegativeAgeError {
	readonly _tag = "NegativeAgeError"
	constructor(readonly age: number) {}
}

class IllegalAgeError {
	readonly _tag = "IllegalAgeError"
	constructor(readonly age: number) {}
}

class RandomFailureError {
	readonly _tag = "RandomFailureError"
	constructor(readonly message: string) {}
}

const validateAge = (
	age: number,
): Effect.Effect<number, NegativeAgeError | IllegalAgeError> =>
	age < 0
		? Effect.fail(new NegativeAgeError(age))
		: age < 18
			? Effect.fail(new IllegalAgeError(age))
			: Effect.succeed(age)

const flakyOperation = (age: number) =>
	Effect.succeed(age).pipe(
		Effect.tap(() => Console.log(`Processing age: ${age}`)),
		Effect.flatMap(() => validateAge(age)),
		Effect.flatMap((validatedAge) =>
			Effect.tryPromise({
				try: () =>
					new Promise<number>((resolve, reject) => {
						Math.random() < 0.5
							? reject(new RandomFailureError("Random failure"))
							: resolve(validatedAge)
					}),
				catch: (unknown) =>
					new RandomFailureError(`Failed to process age: ${unknown}`),
			}),
		),
	)

const retryPolicy = Schedule.exponential("100 millis").pipe(
	Schedule.upTo("5 seconds"),
)

const processAge = (age: number) =>
	flakyOperation(age).pipe(
		Effect.retry(retryPolicy),
		Effect.timeout("10 seconds"),
		Effect.match({
			onSuccess: () => `Success: Age ${age} is valid`,
			onFailure: (error) => {
				if (error instanceof NegativeAgeError) {
					return `Error: Age ${error.age} is negative`
				}
				if (error instanceof IllegalAgeError) {
					return `Error: Age ${error.age} is below 18`
				}
				if (error instanceof RandomFailureError) {
					return `Error: Random failure occurred - ${error.message}`
				}
				if (error instanceof Cause.TimeoutException) {
					return `Error: Operation timed out for age ${age}`
				}
				return `Unknown error occurred: ${error}`
			},
		}),
		Effect.tap((result) =>
			Console.log(`Final result for age ${age}: ${result}`),
		),
	)

const program = Effect.all([
	processAge(-5),
	processAge(15),
	processAge(20),
	processAge(30),
])

Effect.runPromise(program).then(console.log).catch(console.error)
