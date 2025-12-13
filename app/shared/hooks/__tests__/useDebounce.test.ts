import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 400));

    expect(result.current).toBe("initial");
  });

  it("updates the value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      {
        initialProps: { value: "initial" },
      }
    );

    rerender({ value: "updated" });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("updated");
  });

  it("resets the timer if value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      {
        initialProps: { value: "a" },
      }
    );

    rerender({ value: "b" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "c" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("c");
  });

  it("respects a custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      {
        initialProps: { value: "start" },
      }
    );

    rerender({ value: "end" });

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current).toBe("start");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("end");
  });
});
