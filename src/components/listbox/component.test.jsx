import { render, screen } from "@testing-library/react";
import Listbox from ".";
import Lisitem from "../listitem";

//List of hacker news results
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

describe("Listbox", async () => {
  it("renders a listbox element", () => {
    render(<Listbox />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("renders a listbox element with listitem", () => {
    render(
      <Listbox>
        {ITEMS.map((item) => (
          <Lisitem key={item.objectID} item={item} />
        ))}
      </Listbox>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    const firstListitem = screen.getAllByRole("listitem")[0];
    expect(firstListitem).toHaveTextContent("React");

    const secondListitem = screen.getAllByRole("listitem")[1];
    expect(secondListitem).toHaveTextContent("Redux");
  });

  it("renders a listbox with onSelect prop", () => {
    const onSelect = vi.fn().mockImplementation();
    render(
      <Listbox onSelect={onSelect}>
        {ITEMS.map((item) => (
          <Lisitem key={item.objectID} item={item} />
        ))}
      </Listbox>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);

    const firstListitem = screen.getAllByRole("option")[0];
    expect(firstListitem).toHaveTextContent("React");

    const secondListitem = screen.getAllByRole("option")[1];
    expect(secondListitem).toHaveTextContent("Redux");

    firstListitem.click();
    expect(onSelect).toHaveBeenCalled();
  });
});
