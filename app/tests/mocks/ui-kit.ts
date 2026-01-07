/**
 * Mock utilities for UI Kit components
 * Provides mock icons and test helpers for consistent UI Kit testing
 */

import React from "react";

// Mock icon components for testing
export function MockIcon(props: { "data-testid"?: string } = {}) {
  const testId = props["data-testid"] || "mock-icon";
  return React.createElement("svg", {
    "data-testid": testId,
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  });
}

export function MockEmailIcon() {
  return React.createElement(MockIcon, { "data-testid": "email-icon" } as any);
}

export function MockEmailIconFocused() {
  return React.createElement(MockIcon, { "data-testid": "email-icon-focused" } as any);
}

export function MockGoogleIcon() {
  return React.createElement(MockIcon, { "data-testid": "google-icon" } as any);
}

export function MockProjectsIcon() {
  return React.createElement(MockIcon, { "data-testid": "projects-icon" } as any);
}

// Helper to create tab items for testing
export function createMockTabItems(count: number = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: `tab-${i + 1}`,
    label: `Tab ${i + 1}`,
    icon: React.createElement(MockIcon, { "data-testid": `tab-${i + 1}-icon` } as any)
  }));
}

// Helper to create form field test data
export function createMockFormFieldProps(overrides: Record<string, unknown> = {}) {
  return {
    label: "Test Field",
    placeholder: "Enter test value",
    icon: React.createElement(MockIcon, { "data-testid": "field-icon" } as any),
    focusedIcon: React.createElement(MockIcon, { "data-testid": "field-icon-focused" } as any),
    ...overrides
  };
}

// Helper to create page header test data
export function createMockPageHeaderProps(overrides: Record<string, unknown> = {}) {
  return {
    title: "Test Page",
    description: "Test description",
    icon: React.createElement(MockProjectsIcon, {} as any),
    ...overrides
  };
}

// Mock handlers for testing
export function createMockHandlers() {
  return {
    onClick: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onSubmit: jest.fn(),
    onTabChange: jest.fn()
  };
}

// Animation testing helper
export function waitForAnimation(duration: number = 100) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
