import { render, screen } from "@testing-library/react";
import Button from ".";

describe("Button", async () => {
  it("should render", () => {
    render(<Button>Delete</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Delete");
  });
});
