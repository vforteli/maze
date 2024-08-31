import { expect, test } from "vitest";
import App from "./App";
import { renderWithProviders } from "./store/testUtils";
import { fireEvent, screen } from "@testing-library/react";

test("fetches & receives a user after clicking the fetch user button", async () => {
  // const foo = renderWithProviders(<App />);
  // expect(screen.queryByText("Sup")).not.toBeInTheDocument();
  // fireEvent.click(screen.getByText("Modify stuff"));
  // expect(screen.getByText("sup")).toBeInTheDocument();
  // fireEvent.click(screen.getByRole("button", { name: "42" }));
  // expect(foo.store.getState().someTable.selectedId).toEqual(42);
});
