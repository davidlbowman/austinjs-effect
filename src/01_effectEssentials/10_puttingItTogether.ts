import { Effect, pipe } from "effect"

class FetchUserDataError {
	readonly _tag = "OrderProcessingError"
	constructor(readonly message: string) {}
}

class OrderProcessingError {
	readonly _tag = "OrderProcessingError"
	constructor(readonly message: string) {}
}

const generateRandomNumber = Effect.sync(() => Math.random() * 100)

const fetchUserData = Effect.tryPromise({
	try: () =>
		new Promise<string>((resolve, reject) => {
			setTimeout(() => {
				if (Math.random() > 0.8) {
					reject(new FetchUserDataError("Failed to fetch user data"))
				}
				resolve("John Doe")
			}, 1000)
		}),
	catch: (unknown) =>
		new FetchUserDataError(`Failed to fetch user data: ${unknown}`),
})

const calculateDiscount = (amount: number) => Effect.sync(() => amount * 0.1)

const saveOrder = (userName: string, amount: number) =>
	Effect.tryPromise({
		try: () =>
			new Promise<string>((resolve, reject) => {
				setTimeout(() => {
					if (Math.random() > 0.9) {
						reject(new OrderProcessingError("Failed to save order"))
					}
					resolve(`Order saved for ${userName}: $${amount.toFixed(2)}`)
				}, 500)
			}),
		catch: (unknown) =>
			new OrderProcessingError(`Failed to save order: ${unknown}`),
	})

const processOrder = pipe(
	generateRandomNumber,
	Effect.flatMap((amount) =>
		pipe(
			fetchUserData,
			Effect.map((userName) => ({ userName, amount })),
		),
	),
	Effect.flatMap(({ userName, amount }) =>
		pipe(
			calculateDiscount(amount),
			Effect.map((discount) => ({ userName, amount: amount - discount })),
		),
	),
	Effect.flatMap(({ userName, amount }) => saveOrder(userName, amount)),
	Effect.tap((result) => Effect.log(result)),
)

const result = Effect.runPromise(processOrder)
	.then(() => console.log("Order processing completed"))
	.catch((error) => {
		if (error instanceof OrderProcessingError) {
			console.error("Order processing error:", error.message)
		}
		if (error instanceof FetchUserDataError) {
			console.error("User data fetch error:", error.message)
		}
		console.error("Unknown error:", error)
	})
