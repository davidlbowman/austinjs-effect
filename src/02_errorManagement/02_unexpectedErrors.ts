import { Cause, Console, Effect } from "effect"

/*
 * Unexpected errors are errors that are not expected to happen in the program.
 * They are used to handle errors in a structured way.
 */

const task = Effect.dieMessage("Boom!")

const program = Effect.catchAllDefect(task, (defect) => {
	if (Cause.isRuntimeException(defect)) {
		return Console.log(`RuntimeException defect caught: ${defect.message}`)
	}
	return Console.log("Unknown defect caught.")
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
RuntimeException defect caught: Boom!
{
  _id: "Exit",
  _tag: "Success",
  value: undefined
}
*/
