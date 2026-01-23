export const testStyles = {
  container: {
    border: "1px solid #e0e0e0",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  title: {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "16px",
    color: "#333"
  },
  inputGroup: {
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap" as const
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
    minWidth: "fit-content"
  },
  input: {
    padding: "6px 10px",
    border: "1px solid #d0d0d0",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "white",
    minWidth: "80px"
  },
  select: {
    padding: "6px 10px",
    border: "1px solid #d0d0d0",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "white",
    cursor: "pointer"
  },
  button: {
    padding: "8px 12px",
    border: "1px solid #2563eb",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#2563eb"
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginTop: "8px"
  },
  secondaryButton: {
    padding: "8px 12px",
    border: "1px solid #6b7280",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#f9fafb",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  dangerButton: {
    padding: "8px 12px",
    border: "1px solid #dc2626",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  helpText: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "12px",
    lineHeight: "1.4"
  },
  statusText: {
    fontWeight: "500",
    color: "var(--color-green-600)"
  },
  checkbox: {
    marginRight: "8px",
    cursor: "pointer"
  }
};
