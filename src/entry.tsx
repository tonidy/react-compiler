import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

function App() {
  const [count, setCount] = useState(0);
  const now = formatDate(new Date());

  return (
    <div style={{ padding: "1rem", backgroundColor: "white" }}>
      <h2>Fully Compiled with Bundling!</h2>
      <p>
        This uses <code>esbuild.build()</code> to bundle multiple files
        together.
      </p>
      <p>Formatted time: {now}</p>
      <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
