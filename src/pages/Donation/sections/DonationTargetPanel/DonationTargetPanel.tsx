import React, { useState } from "react";
import classes from "./DonationTargetPanel.module.css";
import { DonationTarget } from "./DonationTargetInterfaces";
import DonationTargetComponent from "./DonationTargetComponent";
import { Goal } from "../../../../logic/PaymentPageConfig";
import { PaymentController } from "../../../../logic/payment/PaymentController";

export default function DonationTargetPanel({
  targets,
  controller,
}: {
  targets: Goal[];
  controller: PaymentController;
}) {
  const [goals, setGoals] = useState<Goal[]>(targets);
  return (
    goals &&
    goals.length > 0 && (
      <>
        <div className={`${classes.panel}`}>
          <div className={`${classes.title}`}>Сбор средств</div>
          {goals.map((target, index) => (
            <DonationTargetComponent
              key={target.id}
              target={target}
              selectHandler={(selected: boolean) => {
                console.log({ oldGoals: goals });
                const updatedGoals = goals.map((it, number) => {
                  if (number === index){
                      it.selected = true;
                      controller.goal = it.id;
                  }
                  it.selected = number === index ? selected : false;
                  return structuredClone(it);
                });
                console.log({ updatedGoals: updatedGoals });
                setGoals([...updatedGoals]);
              }}
            />
          ))}
        </div>
      </>
    )
  );
}
