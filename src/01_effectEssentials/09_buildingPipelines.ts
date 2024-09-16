import { Effect, pipe } from "effect"

const increment = (x: number) => x + 1
const double = (x: number) => x * 2
const square = (x: number) => x ** 2
const examplePipe = pipe(1, increment, double, square)
// console.log(examplePipe) // 16

const anotherExamplePipe = pipe(
	1,
	(x) => x + 1,
	(y) => y * 2,
	(z) => z ** 2,
)
// console.log(anotherExamplePipe) // 16

/*
 * Effect.map is a function that takes a function and applies it to the value inside
 * the Effect. Effect.flatMap is a function that takes a function and applies it
 * to the value inside the Effect, but the result of the function is an Effect.
 */

const applyDiscount = (total: number, discountRate: number) =>
	discountRate === 0
		? Effect.fail(new Error("Discount rate cannot be zero"))
		: Effect.succeed(total - (total * discountRate) / 100)

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

const finalAmount = pipe(
	fetchTransactionAmount,
	Effect.flatMap((amount) => applyDiscount(amount, 5)),
	Effect.tap((amount) => console.log(`Amount after discount: ${amount}`)),
)

Effect.runPromise(finalAmount) // Output: 95
