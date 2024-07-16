import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from ".";

describe("Button", async () => {
  it("renders a button element", () => {
    render(<Button>Delete</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Delete");
  });

  it("renders as disabled", () => {
    render(<Button disabled>Delete</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("can change type attribute", () => {
    render(<Button type="submit">Delete</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick prop when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Delete</Button>);
    screen.getByRole("button").click();
    expect(onClick).toHaveBeenCalled();
  });
});
