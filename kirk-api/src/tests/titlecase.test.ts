import { toTitleCase } from "../utils";

it("change s. t. vale to title case", () => {
  expect(toTitleCase('s. t. vale')).toBe('S. T. Vale');
});
