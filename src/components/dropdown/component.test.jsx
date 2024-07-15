import { render } from "@testing-library/react";
import Dropdown from ".";

// Mock implementation of ResizeObserver
describe("Dropdown", () => {
  let fakeTarget;

  beforeAll(() => {
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
