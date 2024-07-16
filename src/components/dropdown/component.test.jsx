import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render } from "@testing-library/react";
import Dropdown from ".";

describe("Dropdown", () => {
  let fakeTarget;

  beforeAll(() => {
    fakeTarget = document.createElement("button");
  });

  afterAll(() => {
    fakeTarget = null;
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
