import { Effect, Random } from "effect"

class HttpError {
	readonly _tag = "HttpError"
}

class ValidationError {
	readonly _tag = "ValidationError"
}

const program = Effect.gen(function* () {
	const n1 = yield* Random.next
	const n2 = yield* Random.next

	const httpResult = n1 > 0.5 ? "yay!" : yield* Effect.fail(new HttpError())
	const validationResult =
		n2 > 0.5 ? "yay!" : yield* Effect.fail(new ValidationError())

	return httpResult + validationResult
})

Effect.runPromise(program).then(console.log, console.error)

const recovered = program.pipe(
	Effect.catchTags({
		HttpError: (_HttpError) => Effect.succeed("Recovering from HttpError"),
		ValidationError: (_ValidationError) =>
			Effect.succeed("Recovering from ValidationError"),
	}),
)
