// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

import { useEffect, useState } from "react";

export default function AppLayout() {
  const [dark, setDark] = useState(false);

useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [dark]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <button
        onClick={() => setDark(!dark)}
        className="p-2 bg-gray-200 dark:bg-gray-700"
      >
        Toggle
      </button>

      {/* resto do app */}
    </div>
  );
}