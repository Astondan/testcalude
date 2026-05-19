import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: ToolInvocation["state"] = "result"
): ToolInvocation {
  return { toolCallId: "test-id", toolName, args, state, result: "ok" } as ToolInvocation;
}

// str_replace_editor labels

test("shows 'Creating' label for create command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/components/Button.jsx" })} />);
  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/components/Card.jsx" })} />);
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("shows 'Editing' label for insert command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/App.jsx" })} />);
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Reading' label for view command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/App.jsx" })} />);
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("shows 'Undoing edit in' label for undo_edit command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })} />);
  expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
});

// file_manager labels

test("shows 'Deleting' label for delete command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/components/Old.jsx" })} />);
  expect(screen.getByText("Deleting Old.jsx")).toBeDefined();
});

test("shows 'Renaming' label for rename command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/components/Old.jsx", new_path: "/components/New.jsx" })} />);
  expect(screen.getByText("Renaming Old.jsx to New.jsx")).toBeDefined();
});

// Fallback

test("falls back to tool name for unknown tool", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("unknown_tool", {})} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

// State indicators

test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result")} />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("shows spinner when state is call (in progress)", () => {
  const invocation = { toolCallId: "id", toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" }, state: "call" } as ToolInvocation;
  const { container } = render(<ToolInvocationBadge toolInvocation={invocation} />);
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

// Filename extraction

test("extracts filename from nested path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/src/components/deep/Button.tsx" })} />);
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});
