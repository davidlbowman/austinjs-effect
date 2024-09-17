import { Effect } from "effect"

const success: Effect.Effect<number, Error> = Effect.succeed(42)
const failure: Effect.Effect<number, Error> = Effect.fail(new Error("Uh oh!"))

/*
 * Effect.match is a function that allows you to match an effect against a set of patterns.
 * It is useful for handling effects in a structured way.
 */

const matchSuccess = Effect.match(success, {
	onFailure: (error) => `failure: ${error.message}`,
	onSuccess: (value) => `success: ${value}`,
})

Effect.runPromise(matchSuccess).then(console.log) // Output: "success: 42"

const matchFailure = Effect.match(failure, {
	onFailure: (error) => `failure: ${error.message}`,
	onSuccess: (value) => `success: ${value}`,
})

Effect.runPromise(matchFailure).then(console.log) // Output: "failure: Uh oh!"

/*
 * Effect.matchEffect is a function that allows you to match an effect against a set of patterns.
 * It is useful for handling effects in a structured way.
 */

const ignoreFailure = Effect.ignore(failure)
Effect.runPromise(ignoreFailure).then(console.log) // Output: undefined

const matchEffect = Effect.matchEffect(success, {
	onFailure: (error) =>
		Effect.succeed(`failure: ${error.message}`).pipe(Effect.tap(Effect.log)),
	onSuccess: (value) =>
		Effect.succeed(`success: ${value}`).pipe(Effect.tap(Effect.log)),
})
Effect.runPromise(matchEffect).then(console.log) // Output: "success: 42"
