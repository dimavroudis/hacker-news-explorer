type DebouncedFunction<T extends any[]> = (...args: T) => void;

function debounceLeading<T extends any[]>(
  func: DebouncedFunction<T>,
  timeout = 300
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: T) => {
    if (!timer) {
      // @ts-ignore
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export default debounceLeading;
