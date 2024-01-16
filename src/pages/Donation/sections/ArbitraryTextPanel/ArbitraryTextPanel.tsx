import React, { useEffect, useState } from "react";
import classes from "./ArbitraryTextPanel.module.css";
import Markdown from "react-markdown";

export default function ArbitraryTextPanel({
  text,
  collapse,
}: {
  text: string;
  collapse: boolean;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  useEffect(() => {
    setCollapsed(collapse);
  },[collapse]);

  return (
    <>
      <div className={`${classes.text}`}>
        <div>
          <Markdown className={`${collapsed ? classes.collapsed : ""}`}>
            {text}
          </Markdown>
          <div className={classes.overflowTextShadow}></div>
        </div>
        {collapsed && (
          <button
            className={classes.collapseButton}
            onClick={() => setCollapsed(false)}
          >
            <span className={`material-symbols-sharp`}>expand_more</span>
          </button>
        )}
      </div>
    </>
  );
}
