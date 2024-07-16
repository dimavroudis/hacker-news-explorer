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
    _highlightResult: {
      title: {
        value: "React",
        matchLevel: "none",
        matchedWords: [],
      },
      url: {
        value: "https://reactjs.org/",
        matchLevel: "none",
        matchedWords: [],
      },
      author: {
        value: "Jordan Walke",
        matchLevel: "none",
        matchedWords: [],
      },
    },
  },
  {
    story_title: "Redux",
    story_url: "https://redux.js.org/",
    points: null,
    author: "Dan Abramov",
    objectID: "1",
    _highlightResult: {
      story_title: {
        value: "Redux",
        matchLevel: "none",
        matchedWords: [],
      },
      story_url: {
        value: "https://redux.js.org/",
        matchLevel: "none",
        matchedWords: [],
      },
      author: {
        value: "Dan Abramov",
        matchLevel: "none",
        matchedWords: [],
      },
    },
  },
];

describe("Autosuggest", async () => {
  it("should render", () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    render(
      <Autosuggest
        label="Search"
        Item={"div"}
        itemIdKey="objectID"
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

  it("should render listbox if value is 3 characters or more", async () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    const { getByRole } = render(
      <Autosuggest
        label="Search"
        Item={"div"}
        itemIdKey="objectID"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "rea" } });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("rea");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("should not render listbox if value is less than 3 characters", async () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    const { getByRole } = render(
      <Autosuggest
        label="Search"
        Item={"div"}
        itemIdKey="objectID"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "re" } });

    expect(callback).toHaveBeenCalledTimes(0);
    expect(await screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should not render listbox if no items are returned", async () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve([]));

    const { getByRole } = render(
      <Autosuggest
        label="Search"
        Item={"div"}
        itemIdKey="objectID"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "rea" } });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("rea");

    expect(await screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should navigate listbox with keyboard", async () => {
    const callback = vi.fn().mockImplementation(() => Promise.resolve(ITEMS));

    const { getByRole } = render(
      <Autosuggest
        label="Search"
        Item={"div"}
        itemIdKey="objectID"
        placeholder="Placeholder search..."
        searchCallback={callback}
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "rea" } });

    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    const items = screen.getAllByRole("option");

    expect(items[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(items[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "End" });
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "Home" });
    expect(items[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(await screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Enter" });
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(await screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(await screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("");
  });
});
