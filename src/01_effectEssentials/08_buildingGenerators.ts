import { Effect } from "effect"

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
