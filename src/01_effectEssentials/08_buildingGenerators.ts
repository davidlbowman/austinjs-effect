import { Effect } from "effect"

/*
 * Effect.gen is a function that allows you to build an effect using a generator function.
 * A generator function is a function that can yield effects to be executed.
 * Effect.gen is useful for building effects that require sequential execution of multiple effects.
 */

const applyDiscount = (total: number, discountRate: number) =>
	discountRate === 0
		? Effect.fail(new Error("Discount rate cannot be zero"))
		: Effect.succeed(total - (total * discountRate) / 100)

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

const finalAmount = Effect.gen(function* (_) {
	const amount = yield* _(fetchTransactionAmount)
	const discountedAmount = yield* _(applyDiscount(amount, 5))
	yield* _(Effect.log(`Amount after discount: ${discountedAmount}`))
	return discountedAmount
})

Effect.runPromise(finalAmount).then(console.log) // Output: 95
