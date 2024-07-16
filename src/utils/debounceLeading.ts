type DebouncedFunction<T extends unknown[]> = (...args: T) => void;

function debounceLeading<T extends unknown[]>(
  func: DebouncedFunction<T>,
  timeout = 300
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: T) => {
    if (!timer) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export default debounceLeading;
