import React from "react";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol role="list">
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <>
                <a href={item.href} rel="nofollow">
                  {item.label}
                </a>
                {index < items.length - 1 && <span aria-hidden="true"> → </span>}
              </>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}