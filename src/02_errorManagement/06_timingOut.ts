import { Effect } from "effect"

/*
 * Effect.timeout is a function that allows you to timeout an effect.
 * If the effect fails to complete within the specified timeout, the effect is interrupted.
 * Effect.timeout is useful for preventing effects from running indefinitely.
 */

const effect = Effect.gen(function* () {
	console.log("Starting")
	yield* Effect.sleep(1500)
	console.log("Ending")
	return "Operation succeeded"
})

const timedEffect = effect.pipe(
	Effect.timeout(Math.random() * 3000),
	Effect.orElse(() => Effect.succeed("Whatever, I'm done")), // Checkout the TimeoutException
)

Effect.runPromise(timedEffect).then(console.log)
