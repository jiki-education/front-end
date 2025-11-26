/**
 * Performance optimization utilities for keyboard handling
 */

interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * Creates a throttled version of a function that only executes at most once per interval
 * @param func - The function to throttle
 * @param delay - The minimum delay between executions in milliseconds
 * @returns The throttled function with cancel and flush methods
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): ThrottledFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  function throttled(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    const now = Date.now();
    const timeSinceLastExec = now - lastExecTime;

    if (timeSinceLastExec >= delay) {
      // Enough time has passed, execute immediately
      lastExecTime = now;
      func.apply(this, args);
    } else {
      // Not enough time has passed, schedule execution
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const remainingTime = delay - timeSinceLastExec;
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        if (lastArgs) {
          func.apply(lastThis, lastArgs);
        }
        timeoutId = null;
      }, remainingTime);
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  throttled.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastExecTime = Date.now();
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };

  return throttled as ThrottledFunction<T>;
}

/**
 * Creates a debounced version of a function that delays execution until after
 * a specified wait time has elapsed since the last call
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @param options - Debounce options
 * @returns The debounced function with cancel and flush methods
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): ThrottledFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;

  let timeoutId: NodeJS.Timeout | null = null;
  let maxTimeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let result: any;

  const invokeFunc = (time: number) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;

    if (args) {
      result = func.apply(thisArg, args);
    }
    return result;
  };

  const leadingEdge = (time: number) => {
    lastInvokeTime = time;
    // Start the timer for the trailing edge
    timeoutId = setTimeout(timerExpired, wait);
    // Invoke the leading edge function if requested
    return leading ? invokeFunc(time) : result;
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeWaiting = wait - timeSinceLastCall;

    timeoutId = setTimeout(timerExpired, timeWaiting);
  };

  const trailingEdge = (time: number) => {
    timeoutId = null;

    // Only invoke if we have lastArgs (trailing is enabled and func has been debounced at least once)
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return result;
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  function debounced(this: any, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Handle invocations in a maxWait cycle
        timeoutId = setTimeout(timerExpired, wait);
        if (maxTimeoutId === null) {
          maxTimeoutId = setTimeout(() => {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            maxTimeoutId = null;
            invokeFunc(Date.now());
          }, maxWait);
        }
        return invokeFunc(time);
      }
    }
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = null;
    lastThis = null;
    timeoutId = null;
    maxTimeoutId = null;
  };

  debounced.flush = () => {
    return timeoutId === null ? result : trailingEdge(Date.now());
  };

  return debounced as ThrottledFunction<T>;
}

/**
 * Performance monitoring for keyboard events
 */
export class PerformanceMonitor {
  private eventCount = 0;
  private lastResetTime = Date.now();
  private readonly RESET_INTERVAL = 1000; // Reset every second
  private readonly WARNING_THRESHOLD = 100; // Warn if more than 100 events per second

  /**
   * Track an event and check if we're getting too many
   * @returns true if performance might be impacted
   */
  trackEvent(): boolean {
    const now = Date.now();

    // Reset counter every second
    if (now - this.lastResetTime > this.RESET_INTERVAL) {
      const eventsPerSecond = (this.eventCount * 1000) / (now - this.lastResetTime);

      if (process.env.NODE_ENV === "development" && eventsPerSecond > this.WARNING_THRESHOLD) {
        console.warn(`[Keyboard] High event rate detected: ${Math.round(eventsPerSecond)} events/sec`);
      }

      this.eventCount = 0;
      this.lastResetTime = now;
      return false;
    }

    this.eventCount++;
    return this.eventCount > this.WARNING_THRESHOLD;
  }

  reset(): void {
    this.eventCount = 0;
    this.lastResetTime = Date.now();
  }
}
