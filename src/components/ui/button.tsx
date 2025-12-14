import React from "react";

export function Button({ children, onClick, ...props }) {
  return (
    <button
      style={{
        padding: "6px 14px",
        backgroundColor: "#f3f4f6",
        color: "#222",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "1rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        outline: "none"
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
