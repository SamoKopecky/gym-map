import { test, expect } from "vitest"
import { machineFactory } from "@/factories"
import { isSearched } from "./search"

test("isSearched__name", () => {
  const machine = machineFactory("foobar")

  expect(isSearched("f", machine)).toBe(true)
  expect(isSearched("fo", machine)).toBe(true)
  expect(isSearched("Foo", machine)).toBe(true)
  expect(isSearched("oa", machine)).toBe(false)
})

test("isSearched__muscleGroups", () => {
  const machine = machineFactory(undefined, ["foo", "bar"])

  expect(isSearched("f", machine)).toBe(true)
  expect(isSearched("fo", machine)).toBe(true)
  expect(isSearched("foo", machine)).toBe(true)
  expect(isSearched("Bar", machine)).toBe(true)
  expect(isSearched("b", machine)).toBe(true)
  expect(isSearched("oa", machine)).toBe(false)
})

test("isSearched__muscleGroups_and_name", () => {
  const machine = machineFactory("taz", ["foo", "bar"])

  expect(isSearched("f", machine)).toBe(true)
  expect(isSearched("fo", machine)).toBe(true)
  expect(isSearched("foo", machine)).toBe(true)
  expect(isSearched("bar", machine)).toBe(true)
  expect(isSearched("b", machine)).toBe(true)
  expect(isSearched("oa", machine)).toBe(false)
  expect(isSearched("taz", machine)).toBe(true)
  expect(isSearched("tAz", machine)).toBe(true)
  expect(isSearched("t", machine)).toBe(true)
})
