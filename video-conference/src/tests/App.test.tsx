import { render, screen } from "@testing-library/react";
import React from "react";
import App from "../App";

test("render start new meeting button", () => {
  render(<App />);
  const buttonElement = screen.getByText(/Connect to Room/i);
  expect(buttonElement).toBeInTheDocument();
});

test("renders name input", () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  expect(input).toBeInTheDocument();
});
