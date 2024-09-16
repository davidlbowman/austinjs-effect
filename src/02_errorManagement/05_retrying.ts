import { Console, Effect, Schedule } from "effect"

const simulateFailure = (maxFailures: number) => {
	let count = 0
	return Effect.gen(function* (_) {
		if (count < maxFailures) {
			count++
			yield* _(Console.log(`Attempt ${count} failed`))
			return yield* _(Effect.fail(new Error(`Failure ${count}`)))
		}
		yield* _(Console.log("Success!"))
		return "Operation succeeded"
	})
}

const retryPolicy = Schedule.exponential("100 millis").pipe(
	Schedule.upTo("5 seconds"),
)

const program = Effect.gen(function* (_) {
	const result = yield* _(simulateFailure(3).pipe(Effect.retry(retryPolicy)))
	yield* _(Console.log(`Final result: ${result}`))
})

Effect.runPromise(program).catch(console.error)
