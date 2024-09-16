import { Effect } from "effect"

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

const program1 = Effect.orElseFail(validate(3), () => "invalid age")
const program2 = Effect.orElseSucceed(validate(3), () => 19)
