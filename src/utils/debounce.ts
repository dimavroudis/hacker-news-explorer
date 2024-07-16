type DebouncedFunction<T extends unknown[]> = (...args: T) => void;

function debounce<T extends unknown[]>(
  func: DebouncedFunction<T>,
  timeout = 300
): DebouncedFunction<T> {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      func.apply(this, args);
    }, timeout);
  };
}

export default debounce;
