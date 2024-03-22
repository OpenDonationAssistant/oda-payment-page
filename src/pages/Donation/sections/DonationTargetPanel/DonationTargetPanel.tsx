import React, { useState } from "react";
import classes from "./DonationTargetPanel.module.css";
import { DonationTarget } from "./DonationTargetInterfaces";
import DonationTargetComponent from "./DonationTargetComponent";

export default function DonationTargetPanel({
  targets,
}: {
  targets: DonationTarget[];
}) {
  const [goals, setGoals] = useState<DonationTarget[]>(targets);
  return (
    <>
      <div className={`${classes.panel}`}>
        {goals.map((target, index) => (
          <DonationTargetComponent
            key={target.title}
            target={target}
            selectHandler={(selected: boolean) => {
              console.log(`goals before: ${JSON.stringify(goals)}`);
              const updatedGoals = goals.map((it, number) => {
                it.selected = number === index ? selected : false;
                return structuredClone(it);
              });
              console.log(`updated goals: ${JSON.stringify(updatedGoals)}`);
              setGoals([...updatedGoals]);
            }}
          />
        ))}
      </div>
    </>
  );
}
