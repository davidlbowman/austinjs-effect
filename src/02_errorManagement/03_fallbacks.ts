import { Effect } from "effect"

const success = Effect.succeed("success")
const failure = Effect.fail("failure")
const fallback = Effect.succeed("fallback")

/*
 * Effect.orElse is a function that allows you to provide a fallback value for an effect.
 * If the effect fails, the fallback value is returned.
 * Effect.orElse is useful for providing a fallback value for an effect.
 */

const program1 = Effect.orElse(success, () => fallback)
console.log(Effect.runSync(program1)) // Output: "success"

const program2 = Effect.orElse(failure, () => fallback)
console.log(Effect.runSync(program2)) // Output: "fallback"

/*
 * Effect.orElseFail is a function that allows you to provide a fallback value for an effect.
 * If the effect fails, the fallback value is returned.
 * Effect.orElseFail is useful for providing a fallback value for an effect.
 */

class NegativeAgeError {
	readonly _tag = "NegativeAgeError"
	constructor(readonly age: number) {}
}

class IllegalAgeError {
	readonly _tag = "IllegalAgeError"
	constructor(readonly age: number) {}
}

const validate = (
	age: number,
): Effect.Effect<number, NegativeAgeError | IllegalAgeError> => {
	if (age < 0) Effect.fail(new NegativeAgeError(age))
	if (age < 18) Effect.fail(new IllegalAgeError(age))
	return Effect.succeed(age)
}

const program3 = Effect.orElseFail(validate(3), () => "invalid age")
const program4 = Effect.orElseSucceed(validate(3), () => 19)
