import { test, expect } from "vitest"
import { machineFactory } from "@/factories"
import { isMachineSearched } from "./search"

test("isSearched__name", () => {
  const machine = machineFactory("foobar")

  expect(isMachineSearched("f", machine)).toBe(true)
  expect(isMachineSearched("fo", machine)).toBe(true)
  expect(isMachineSearched("Foo", machine)).toBe(true)
  expect(isMachineSearched("oa", machine)).toBe(false)
})

test("isSearched__muscleGroups", () => {
  const machine = machineFactory(undefined, ["foo", "bar"])

  expect(isMachineSearched("f", machine)).toBe(true)
  expect(isMachineSearched("fo", machine)).toBe(true)
  expect(isMachineSearched("foo", machine)).toBe(true)
  expect(isMachineSearched("Bar", machine)).toBe(true)
  expect(isMachineSearched("b", machine)).toBe(true)
  expect(isMachineSearched("oa", machine)).toBe(false)
})

test("isSearched__muscleGroups_and_name", () => {
  const machine = machineFactory("taz", ["foo", "bar"])

  expect(isMachineSearched("f", machine)).toBe(true)
  expect(isMachineSearched("fo", machine)).toBe(true)
  expect(isMachineSearched("foo", machine)).toBe(true)
  expect(isMachineSearched("bar", machine)).toBe(true)
  expect(isMachineSearched("b", machine)).toBe(true)
  expect(isMachineSearched("oa", machine)).toBe(false)
  expect(isMachineSearched("taz", machine)).toBe(true)
  expect(isMachineSearched("tAz", machine)).toBe(true)
  expect(isMachineSearched("t", machine)).toBe(true)
})
