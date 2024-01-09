import React from "react";
import classes from "./AssistingTooltip.module.css";

export default function AssistingTooltip({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <>
      <div className={classes.container}>{text}</div>
    </>
  );
}
