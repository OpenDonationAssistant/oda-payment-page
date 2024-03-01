import React, { useEffect, useState } from "react";
import classes from "./ArbitraryTextPanel.module.css";
import Markdown from "react-markdown";
import { Tooltip } from "react-tooltip";

export default function ArbitraryTextPanel({
  text,
  collapse,
}: {
  text: string;
  collapse: boolean;
}) {
  const arbitrary_panel_hidden_property_name = "arbitrary_panel_hidden";
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [panelHidden, setPanelHidden] = useState(() => {
    const prevState = localStorage.getItem(
      arbitrary_panel_hidden_property_name,
    );
    if (prevState) {
      const state = JSON.parse(prevState);
      return text.hashCode() === state.hash ? state.hidden : false;
    }
    return false;
  });

  useEffect(() => {
    setCollapsed(collapse);
  }, [collapse]);

  function togglePanel(newState: boolean) {
    setPanelHidden(newState);
    localStorage.setItem(
      arbitrary_panel_hidden_property_name,
      JSON.stringify({ hidden: newState, hash: text.hashCode() }),
    );
  }

  return (
    <>
      <div className={`${classes.text}`}>
        <div
          className={`${
            panelHidden ? classes.collapsedpanel : classes.expandedpanel
          }`}
        >
          <Markdown className={`${collapsed ? classes.collapsed : ""}`}>
            {text}
          </Markdown>
          {collapsed && <div className={classes.overflowTextShadow}></div>}
        </div>
        <button
          className={`${classes.hidebutton} clickable-button`}
          style={{display: "none"}}
          onClick={() => togglePanel(!panelHidden)}
          data-tooltip-id="arbitrary-panel-tooltip"
        >
          <span className={`material-symbols-sharp`}>
            {panelHidden ? "chevron_right" : "chevron_left"}
          </span>
        </button>
        {!panelHidden && <Tooltip
          id="arbitrary-panel-tooltip"
          place="right"
          variant="info"
          content={
            <>
              <div className={`${classes.tooltip}`}>
                Скрыть панель до тех пор, пока текст не поменяется (пока стример не обновит описание)
              </div>
            </>
          }
          className="nickname-gif-tooltip"
        />}
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
