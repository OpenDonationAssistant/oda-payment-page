import React, { useContext } from "react";
import classes from "./DonationGoalComponent.module.css";
import {
  Goal,
  PaymentPageConfigContext,
} from "../../../../logic/PaymentPageConfig";
import Amount from "../../../../components/Amount/Amount";
import CheckIcon from "../../../../icons/CheckIcon";
import { observer } from "mobx-react-lite";

function percent(filled: number, required: number) {
  const percent = (filled / required) * 100;
  if (percent > 100) {
    return 100;
  }
  return percent;
}

const DonationGoalComponent = observer(({ goal }: { goal: Goal }) => {
  const pageConfig = useContext(PaymentPageConfigContext);

  return (
    <>
      <div
        className={`${classes.goal} ${goal.selected ? classes.goalactive : classes.goalpassive}`}
        onClick={() => {
          pageConfig.selectGoal(goal.id);
        }}
      >
        <div className={`${classes.goaltitle}`}>
          <div
            className={`${classes.briefdescription} ${goal.selected ? classes.titleactive : classes.titlepassive}`}
          >
            {goal.briefDescription}
          </div>
          {goal.selected && <CheckIcon />}
        </div>
        <div className={`${classes.fulldescription}`}>
          {goal.fullDescription}
        </div>
        <div className={`${classes.barcontainer}`}>
          <div className={`${classes.bar}`} />
          <div
            className={`${classes.filled}`}
            style={{
              width: `${percent(goal.accumulatedAmount.major, goal.requiredAmount.major)}%`,
            }}
          />
        </div>
        <div className={`${classes.amounts}`}>
          <div className={`${classes.collected}`}>
            <Amount amount={goal.accumulatedAmount.major} />
          </div>
          <div className={`${classes.required}`}>
            <Amount amount={goal.requiredAmount.major} />
          </div>
        </div>
      </div>
    </>
  );
});

export default DonationGoalComponent;
