import { Console, Effect, Fiber, Schedule } from "effect"

/*
 * Effect.runFork is a function that executes an effect in a separate fiber and returns a Fiber.
 * A Fiber is a lightweight thread of execution that can be used to run effects concurrently.
 * Effect.runFork is useful for executing effects in a separate fiber, allowing for concurrent
 * execution.
 */

const program = Effect.repeat(Console.log("running..."), Schedule.spaced(1000))
const fiber = Effect.runFork(program)

setTimeout(() => {
	Effect.runFork(Fiber.interrupt(fiber))
}, 500)
