import { render, screen } from "@testing-library/react";
import Autosuggest from ".";

describe("Autosuggest", async () => {
  const callback = vi.fn().mockImplementation(() => Promise.resolve([]));

  it("should render", () => {
    render(<Autosuggest label="Search" searchCallback={callback} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
