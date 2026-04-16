import { useEffect, useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar") === "collapsed";
  });

  useEffect(() => {
    localStorage.setItem("sidebar", collapsed ? "collapsed" : "open");
  }, [collapsed]);

  return { collapsed, setCollapsed };
}