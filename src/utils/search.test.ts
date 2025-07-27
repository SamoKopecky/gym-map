import { expect, describe, it } from "vitest"
import { exerciseFactory, machineFactory } from "@/factories"
import { isMachineSearched, isExerciseSearched } from "./search"
import { Difficulty } from "@/types/exercise"

describe("isMachineSearched", () => {
  it.each([
    {
      text: "f",
      difficulties: [],
      properties: [],
      expected: true,
      description: "matches machine name partial",
    },
    {
      text: "baz",
      difficulties: [],
      properties: [],
      expected: true,
      description: "matches muscle group exact",
    },
    {
      text: "xyz",
      difficulties: [],
      properties: [],
      expected: false,
      description: "no match found",
    },
    {
      text: "FOO",
      difficulties: [],
      properties: [],
      expected: true,
      description: "case insensitive machine name",
    },
    {
      text: "BAZ",
      difficulties: [],
      properties: [],
      expected: true,
      description: "case insensitive muscle group",
    },
    {
      text: "",
      difficulties: [],
      properties: [],
      expected: true,
      description: "empty search text",
    },
    {
      text: "chest",
      difficulties: [],
      properties: [],
      machine: machineFactory("test", ["CHEST"]),
      expected: true,
      description: "case insensitive muscle group match",
    },
    {
      text: "leg",
      difficulties: [],
      properties: [],
      machine: machineFactory("bench", ["chest"]),
      expected: false,
      description: "no match in name or muscle groups",
    },
    {
      text: "quad",
      difficulties: [],
      properties: [],
      machine: machineFactory("test", ["quadriceps"]),
      expected: true,
      description: "partial muscle group match",
    },
    {
      text: "leg-",
      difficulties: [],
      properties: [],
      machine: machineFactory("leg-press", []),
      expected: true,
      description: "special characters in machine name",
    },
    {
      text: "missing",
      difficulties: [],
      properties: [],
      machine: machineFactory("test", []),
      expected: false,
      description: "no match with empty muscle groups",
    },
  ])(
    "$description: $text -> $expected",
    ({ text, difficulties, properties, expected, machine }) => {
      const testMachine = machine || machineFactory("foobar", ["baz"])

      expect(isMachineSearched({ text, difficulties, properties }, testMachine)).toBe(expected)
    },
  )
})

describe("isExerciseSearched", () => {
  it.each([
    {
      text: "b",
      difficulties: [],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "baz" }),
      description: "exercise matches name partially",
    },
    {
      text: "baz",
      difficulties: [],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "baz" }),
      description: "exercise matches name exactly",
    },
    {
      text: "BAZ",
      difficulties: [],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "baz" }),
      description: "exercise matches name case insensitive",
    },
    {
      text: "xyz",
      difficulties: [],
      properties: [],
      expected: false,
      exercise: exerciseFactory({ name: "baz" }),
      description: "exercise name no match",
    },
    {
      text: "",
      difficulties: [],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "baz" }),
      description: "empty search text matches all",
    },
    {
      text: "push",
      difficulties: [],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "push-up" }),
      description: "partial match with hyphenated name",
    },
    {
      text: "",
      difficulties: [Difficulty.Easy],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "baz", diffculty: Difficulty.Easy }),
      description: "difficulty filter matches",
    },
    {
      text: "",
      difficulties: [Difficulty.Hard],
      properties: [],
      expected: false,
      exercise: exerciseFactory({ name: "baz", diffculty: Difficulty.Easy }),
      description: "difficulty filter no match",
    },
    {
      text: "",
      difficulties: [Difficulty.Easy, Difficulty.Normal],
      properties: [],
      expected: true,
      exercise: exerciseFactory({ name: "baz", diffculty: Difficulty.Normal }),
      description: "multiple difficulties filter matches",
    },
    {
      text: "",
      difficulties: [Difficulty.Easy],
      properties: [],
      expected: false,
      exercise: exerciseFactory({ name: "baz" }),
      description: "difficulty filter with no exercise difficulty",
    },
    {
      text: "",
      difficulties: [],
      properties: [{ id: 1, name: "test", category_id: 1 }],
      expected: true,
      exercise: exerciseFactory({ name: "baz", propertyIds: [1] }),
      description: "property filter matches",
    },
    {
      text: "",
      difficulties: [],
      properties: [{ id: 2, name: "test", category_id: 1 }],
      expected: false,
      exercise: exerciseFactory({ name: "baz", propertyIds: [1] }),
      description: "property filter no match",
    },
    {
      text: "",
      difficulties: [],
      properties: [
        { id: 1, name: "test1", category_id: 1 },
        { id: 2, name: "test2", category_id: 1 },
      ],
      expected: true,
      exercise: exerciseFactory({ name: "baz", propertyIds: [2, 3] }),
      description: "multiple properties filter matches one",
    },
    {
      text: "",
      difficulties: [],
      properties: [{ id: 3, name: "test", category_id: 1 }],
      expected: false,
      exercise: exerciseFactory({ name: "baz", propertyIds: [] }),
      description: "property filter with no exercise properties",
    },
    {
      text: "push",
      difficulties: [Difficulty.Easy],
      properties: [{ id: 1, name: "test", category_id: 1 }],
      expected: true,
      exercise: exerciseFactory({ name: "push-up", diffculty: Difficulty.Easy, propertyIds: [1] }),
      description: "all criteria match",
    },
    {
      text: "push",
      difficulties: [Difficulty.Hard],
      properties: [{ id: 1, name: "test", category_id: 1 }],
      expected: false,
      exercise: exerciseFactory({ name: "push-up", diffculty: Difficulty.Easy, propertyIds: [1] }),
      description: "text and property match but difficulty fails",
    },
    {
      text: "run",
      difficulties: [Difficulty.Easy],
      properties: [{ id: 1, name: "test", category_id: 1 }],
      expected: false,
      exercise: exerciseFactory({ name: "push-up", diffculty: Difficulty.Easy, propertyIds: [1] }),
      description: "difficulty and property match but text fails",
    },
    {
      text: "push",
      difficulties: [Difficulty.Easy],
      properties: [{ id: 2, name: "test", category_id: 1 }],
      expected: false,
      exercise: exerciseFactory({ name: "push-up", diffculty: Difficulty.Easy, propertyIds: [1] }),
      description: "text and difficulty match but property fails",
    },
  ])("$description", ({ text, difficulties, properties, expected, exercise }) => {
    expect(isExerciseSearched({ text, difficulties, properties }, exercise)).toBe(expected)
  })
})
