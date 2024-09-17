import { Cause, Console, Effect, Schedule } from "effect"

class NegativeAgeError {
	readonly _tag = "NegativeAgeError"
	constructor(readonly age: number) {}
}

class IllegalAgeError {
	readonly _tag = "IllegalAgeError"
	constructor(readonly age: number) {}
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
			Math.random() < 0.5
				? Effect.fail(new Error("Random failure"))
				: Effect.succeed(validatedAge),
		),
	)

const retryPolicy = Schedule.exponential("100 millis").pipe(
	Schedule.upTo("5 seconds"),
)

const processAge = (age: number) =>
	flakyOperation(age).pipe(
		Effect.retry(retryPolicy),
		Effect.timeout("3 seconds"),
		Effect.match({
			onSuccess: () => `Success: Age ${age} is valid`,
			onFailure: (error) => {
				if (error instanceof NegativeAgeError) {
					return `Error: Age ${error.age} is negative`
				}
				if (error instanceof IllegalAgeError) {
					return `Error: Age ${error.age} is below 18`
				}
				if (error instanceof Error) {
					return `Unexpected error: ${error.message}`
				}
				return "Unknown error occurred"
			},
		}),
		Effect.orElse(() =>
			Effect.succeed(`Fallback: Unable to process age ${age}`),
		),
		Effect.catchAllDefect((defect) =>
			Cause.isRuntimeException(defect)
				? Console.log(`RuntimeException caught: ${defect.message}`)
				: Console.log("Unknown defect caught."),
		),
		Effect.flatMap((result) =>
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
