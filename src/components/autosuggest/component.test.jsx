import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import Autosuggest from ".";

const ITEMS = [
  {
    title: "React",
    url: "https://reactjs.org/",
    points: 100,
    num_comments: 10,
    author: "Jordan Walke",
    objectID: "0",
  },
  {
    story_title: "Redux",
    story_url: "https://redux.js.org/",
    points: null,
    author: "Dan Abramov",
    objectID: "1",
  },
];

describe("Autosuggest", async () => {
  it("should render", () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    render(
      <Autosuggest
        label="Search"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Placeholder search...")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("should call searchCallback if value is 3 characters or more", async () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    const { getByRole } = render(
      <Autosuggest
        label="Search"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "rea" } });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("rea");
  });

  it("should not call searchCallback if value is less than 3 characters", async () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    const { getByRole } = render(
      <Autosuggest
        label="Search"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "re" } });

    expect(callback).toHaveBeenCalledTimes(0);
  });
});
