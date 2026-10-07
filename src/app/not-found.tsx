import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
};

const NotFoundPage = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: 700, margin: 0 }}>404</h1>
      <p style={{ opacity: 0.7, margin: 0 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" style={{ marginTop: "1rem", textDecoration: "underline" }}>
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;