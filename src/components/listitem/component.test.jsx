import { render } from "@testing-library/react";
import Listitem from ".";

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

describe("ListItem", () => {
  it("should render correctly with default result", () => {
    const { container } = render(<Listitem item={ITEMS[0]} />);
    expect(container).toMatchSnapshot();
  });
  it("should render correctly with story result", () => {
    const { container } = render(<Listitem item={ITEMS[1]} />);
    expect(container).toMatchSnapshot();
  });
});
