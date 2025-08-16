"use client";

import { testAction } from "./action";

export const ClientComponent = () => {
  const onClick = async () => {
    const button = document.getElementById("test-action-btn");
    if (!button) return;
    button.setAttribute("disabled", "true");
    button.textContent = "Running...";
    try {
      const result = await testAction({});
      alert(`Result: ${JSON.stringify(result)}`);
    } finally {
      button.removeAttribute("disabled");
      button.textContent = "Run server action";
    }
  };

  return (
    <button
      id="test-action-btn"
      onClick={onClick}
      className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
    >
      Run server action
    </button>
  );
};
