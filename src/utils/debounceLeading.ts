type DebouncedFunction<T extends any[]> = (...args: T) => void;

interface DebounceLeadingOptions {
  timeout?: number;
}

function debounceLeading<T extends any[]>(
  func: (...args: T) => void,
  options: DebounceLeadingOptions = {}
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
    }, options.timeout || 300);
  };
}

export default debounceLeading;
