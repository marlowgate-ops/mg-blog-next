import React from "react";

export default function Container({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={["mg-container", className].filter(Boolean).join(" ")}
      data-container-root
    >
      {children}
    </div>
  );
}
