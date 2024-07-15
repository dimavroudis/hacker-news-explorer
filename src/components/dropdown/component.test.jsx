import { render } from "@testing-library/react";
import Dropdown from ".";

// Mock implementation of ResizeObserver
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

describe("Dropdown", () => {
  let fakeTarget;

  beforeAll(() => {
    global.ResizeObserver = MockResizeObserver;
    fakeTarget = document.createElement("button");
  });

  afterAll(() => {
    delete global.ResizeObserver;
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <Dropdown target={fakeTarget}>Content</Dropdown>
    );
    expect(container.querySelector("div")).not.toBeInTheDocument();
  });

  it("renders dropdown when open", () => {
    const { container } = render(
      <Dropdown open target={fakeTarget}>
        Content
      </Dropdown>
    );
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(container.querySelector("div")).toHaveTextContent("Content");
  });
});
