import { test, expect } from "vitest"
import { exerciseFactory, machineFactory } from "@/factories"
import { isExerciseSearched, isMachineSearched } from "./search"
import { Difficulty } from "@/types/exercise"

test("isSearched__name", () => {
  const machine = machineFactory("foobar")

  expect(isMachineSearched({ text: "f", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "fo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "Foo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "oa", difficulties: [] }, machine)).toBe(false)
})

test("isSearched__muscleGroups", () => {
  const machine = machineFactory(undefined, ["foo", "bar"])

  expect(isMachineSearched({ text: "f", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "fo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "Foo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "Bar", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "b", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "oa", difficulties: [] }, machine)).toBe(false)
})

test("isSearched__muscleGroups_and_name", () => {
  const machine = machineFactory("taz", ["foo", "bar"])

  expect(isMachineSearched({ text: "f", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "fo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "foo", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "bar", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "b", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "oa", difficulties: [] }, machine)).toBe(false)
  expect(isMachineSearched({ text: "taz", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "tAz", difficulties: [] }, machine)).toBe(true)
  expect(isMachineSearched({ text: "t", difficulties: [] }, machine)).toBe(true)
})

test("isSearched__name__exercise", () => {
  const exercise = exerciseFactory("foobar")

  expect(isExerciseSearched({ text: "f", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "fo", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "Foo", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "oa", difficulties: [] }, exercise)).toBe(false)
})

test("isSearched__muscleGroups__exercise", () => {
  const machine = exerciseFactory(undefined, ["foo", "bar"])

  expect(isExerciseSearched({ text: "f", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "fo", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "Foo", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "Bar", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "b", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "oa", difficulties: [] }, machine)).toBe(false)
})

test("isSearched__muscleGroups_and_name__exercise", () => {
  const machine = exerciseFactory("taz", ["foo", "bar"])

  expect(isExerciseSearched({ text: "f", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "fo", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "foo", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "bar", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "b", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "oa", difficulties: [] }, machine)).toBe(false)
  expect(isExerciseSearched({ text: "taz", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "tAz", difficulties: [] }, machine)).toBe(true)
  expect(isExerciseSearched({ text: "t", difficulties: [] }, machine)).toBe(true)
})

test("isSearched__difficulty__exercise", () => {
  const exercise = exerciseFactory("taz", [], Difficulty.Easy)

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
  const exercise = exerciseFactory("taz", [])

  expect(isExerciseSearched({ text: "", difficulties: [] }, exercise)).toBe(true)
  expect(isExerciseSearched({ text: "", difficulties: [Difficulty.Normal] }, exercise)).toBe(false)
})
