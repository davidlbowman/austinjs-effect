import { Effect, Exit } from "effect"

const program = Effect.sync(() => {
	console.log("Hello World")
	return 1
})

// const result = Effect.runSync(program)

// const simulation = Effect.runSyncExit(Effect.succeed(1))
const simulation = Effect.runSyncExit(Effect.fail("error"))
Exit.match(simulation, {
	onFailure: (cause) =>
		console.error(`Exit.match: Execution failed with cause: ${cause._tag}`),
	onSuccess: (value) =>
		console.log(`Exit.match: Execution was successful with value: ${value}`),
})
