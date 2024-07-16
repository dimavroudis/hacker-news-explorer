import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Listbox from ".";
import Lisitem from "./listitem";

const ITEMS = ["React", "Redux"];

describe("Listbox", async () => {
  it("renders a listbox element", () => {
    render(<Listbox />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("renders a listbox element with listitem", () => {
    render(
      <Listbox>
        {ITEMS.map((item) => (
          <Lisitem key={item}>{item}</Lisitem>
        ))}
      </Listbox>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);

    const firstListitem = screen.getAllByRole("option")[0];
    expect(firstListitem).toHaveTextContent("React");

    const secondListitem = screen.getAllByRole("option")[1];
    expect(secondListitem).toHaveTextContent("Redux");
  });

  it("renders a listbox with onSelectItem prop", () => {
    const onSelectItem = vi.fn().mockImplementation();
    render(
      <Listbox onSelectItem={onSelectItem}>
        {ITEMS.map((item) => (
          <Lisitem key={item}>{item}</Lisitem>
        ))}
      </Listbox>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const firstListitem = screen.getAllByRole("option")[0];

    firstListitem.click();
    expect(onSelectItem).toHaveBeenCalled();
  });
});
