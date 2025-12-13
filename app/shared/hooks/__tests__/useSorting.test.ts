import { renderHook, act } from "@testing-library/react";
import { useSorting } from "../useSorting";

describe("useSorting", () => {
  it("initializes with default sort option", () => {
    const { result } = renderHook(() => useSorting());

    expect(result.current.sortOption).toBe("id-asc");
    expect(result.current.apiSort).toBe("id");
    expect(result.current.apiOrder).toBe("asc");
  });

  it("initializes with custom sort option", () => {
    const { result } = renderHook(() => useSorting("name-desc"));

    expect(result.current.sortOption).toBe("name-desc");
    expect(result.current.apiSort).toBe("name");
    expect(result.current.apiOrder).toBe("desc");
  });

  it("updates apiSort and apiOrder when sortOption changes", () => {
    const { result } = renderHook(() => useSorting());

    act(() => {
      result.current.setSortOption("id-desc");
    });

    expect(result.current.sortOption).toBe("id-desc");
    expect(result.current.apiSort).toBe("id");
    expect(result.current.apiOrder).toBe("desc");
  });

  it("handles all supported sort options correctly", () => {
    const cases = [
      ["id-asc", "id", "asc"],
      ["id-desc", "id", "desc"],
      ["name-asc", "name", "asc"],
      ["name-desc", "name", "desc"],
    ] as const;

    for (const [option, field, order] of cases) {
      const { result } = renderHook(() => useSorting(option));

      expect(result.current.apiSort).toBe(field);
      expect(result.current.apiOrder).toBe(order);
    }
  });
});
