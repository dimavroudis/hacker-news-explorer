type DebouncedFunction<T extends any[]> = (...args: T) => void;

function debounce<T extends any[]>(
  func: DebouncedFunction<T>,
  timeout = 300
): DebouncedFunction<T> {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

export default debounce;
