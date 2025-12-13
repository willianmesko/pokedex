import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  it("initializes with default page = 1", () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(1);
  });

  it("initializes with custom initialPage", () => {
    const { result } = renderHook(() => usePagination({ initialPage: 3 }));

    expect(result.current.page).toBe(3);
  });

  it("increments page with nextPage", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
  });

  it("decrements page with prevPage but never goes below 1", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.page).toBe(1);
  });

  it("respects totalPages limit when calling nextPage", () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 2, totalPages: 3 })
    );

    act(() => {
      result.current.nextPage();
      result.current.nextPage();
    });

    expect(result.current.page).toBe(3);
  });

  it("goes to a specific page using setPage", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(5);
    });

    expect(result.current.page).toBe(5);
  });

  it("setPage never sets page below 1", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(-10);
    });

    expect(result.current.page).toBe(1);
  });
});
