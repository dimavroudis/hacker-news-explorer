import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observations = [];
  }

  observe(target) {
    this.observations.push(target);
  }

  unobserve(target) {
    this.observations = this.observations.filter((obs) => obs !== target);
  }

  disconnect() {
    this.observations = [];
  }

  // Simulate a resize event (optional utility method)
  simulateResize(entry) {
    this.callback([entry], this);
  }
}

global.ResizeObserver = MockResizeObserver;

afterEach(() => {
  cleanup();
});
