import { test, expect } from "vitest"
import { exerciseFactory, instructionFactory, machineFactory } from "@/factories"
import { isExerciseSearched, isInstructionSearched, isMachineSearched } from "./search"
import { Difficulty } from "@/types/exercise"

test("isSearched__name", () => {
  const machine = machineFactory("foobar")

  expect(isMachineSearched({ text: "f", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "fo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "Foo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "oa", difficulties: [] }, machine)).toBe(false)
})

test("isSearched__name__exercise", () => {
  const exercise = exerciseFactory("foobar")

  expect(isExerciseSearched({ text: "f", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "fo", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "Foo", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "oa", difficulties: [] }, exercise)).toBe(false)
})

test("isSearched__difficulty__exercise", () => {
  const exercise = exerciseFactory("taz", Difficulty.Easy)

  expect(isExerciseSearched({ text: "", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "", difficulties: [Difficulty.Hard] }, exercise)).toBe(false)
  expect(isExerciseSearched({ text: "", difficulties: [Difficulty.Easy] }, exercise)).toBe(true)
  expect(
    isExerciseSearched({ text: "", difficulties: [Difficulty.Easy, Difficulty.Normal] }, exercise),
  ).toBe(true)
  expect(isExerciseSearched({ text: "taz", difficulties: [Difficulty.Easy] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "taz", difficulties: [Difficulty.Normal] }, exercise)).toBe(
    false,
  )
})

test("isSearched__difficulty__exercise__missing_diffculty", () => {
  const exercise = exerciseFactory("taz")

  expect(isExerciseSearched({ text: "", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "", difficulties: [Difficulty.Normal] }, exercise)).toBe(false)
})

test("isSearch__instruction", () => {
  const instruction = instructionFactory("foo", "bar")

  expect(isInstructionSearched({ text: "", difficulties: [] }, instruction)).toBe(true)
  expect(isInstructionSearched({ text: "foo", difficulties: [] }, instruction)).toBe(true)
  expect(isInstructionSearched({ text: "bar", difficulties: [] }, instruction)).toBe(true)
  expect(isInstructionSearched({ text: "fo", difficulties: [] }, instruction)).toBe(true)
  expect(isInstructionSearched({ text: "baz", difficulties: [] }, instruction)).toBe(false)
})
