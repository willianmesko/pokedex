import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useSearch } from "../useSearch";

describe("useSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.search).toBe("");
    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.hasSearch).toBe(false);
  });

  it("initializes with custom initialValue", () => {
    const { result } = renderHook(() => useSearch({ initialValue: "pikachu" }));

    expect(result.current.search).toBe("pikachu");
    expect(result.current.debouncedSearch).toBe("pikachu");
    expect(result.current.hasSearch).toBe(true);
  });

  it("updates debouncedSearch after debounce delay", () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 400 }));

    act(() => {
      result.current.setSearch("bulbasaur");
    });

    expect(result.current.debouncedSearch).toBe("");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.debouncedSearch).toBe("bulbasaur");
    expect(result.current.hasSearch).toBe(true);
  });

  it("resets debounce timer when search changes quickly", () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 400 }));

    act(() => {
      result.current.setSearch("a");
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    act(() => {
      result.current.setSearch("ab");
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.debouncedSearch).toBe("");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.debouncedSearch).toBe("ab");
  });

  it("hasSearch is false for whitespace-only values", () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 200 }));

    act(() => {
      result.current.setSearch("   ");
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.hasSearch).toBe(false);
  });
});
