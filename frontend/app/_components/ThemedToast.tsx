"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

type Theme = "light" | "dark";

export function ThemedToast() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const read = () =>
      ((document.documentElement.getAttribute("data-theme") as Theme) ||
        "light");

    setTheme(read());

    const onChange = () => setTheme(read());
    window.addEventListener("themechange", onChange);

    // Catch changes from other tabs / outside the toggle.
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("themechange", onChange);
      observer.disconnect();
    };
  }, []);

  return <ToastContainer position="top-right" autoClose={4000} theme={theme} />;
}
