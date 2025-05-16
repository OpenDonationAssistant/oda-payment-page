import React, { useContext, useState } from "react";
import classes from "./WidgetsComponent.module.css";
import {
  Goal,
  PaymentPageConfigContext,
} from "../../../logic/PaymentPageConfig";
import DonationGoalComponent from "./DonationGoal/DonationGoalComponent";
import { observer } from "mobx-react-lite";
import Media from "./Media/Media";
import { info } from "console";

const GoalWidget = observer(({ goals }: { goals: Goal[] }) => {
  return (
    <>
      {goals.map((goal) => (
        <DonationGoalComponent key={goal.id} goal={goal} />
      ))}
    </>
  );
});

const WidgetsComponent = observer(({}) => {
  const pageConfig = useContext(PaymentPageConfigContext);

  const goalsEnabled = pageConfig.goals && pageConfig.goals.length > 0;
  const mediaEnabled =
    pageConfig.requestsEnabled && !pageConfig.requestsDisabledPermanently;

  const shouldRender = goalsEnabled || mediaEnabled;
  const [selected, setSelected] = useState<"goal" | "media">(() => {
    if (goalsEnabled) {
      return "goal";
    } else {
      return "media";
    }
  });

  return (
    <>
      {shouldRender && (
        <div className={`${classes.widgetcontainer}`}>
          <div className={`${classes.tabbar}`}>
            {pageConfig.goals && pageConfig.goals.length > 0 && (
              <div
                className={`${classes.tab} ${selected === "goal" ? classes.tabactive : classes.tabpassive}`}
                onClick={() => setSelected("goal")}
              >
                <div>Сбор средств</div>
              </div>
            )}
            {pageConfig.requestsEnabled &&
              !pageConfig.requestsDisabledPermanently && (
                <div
                  className={`${classes.tab} ${selected === "media" ? classes.tabactive : classes.tabpassive}`}
                  onClick={() => setSelected("media")}
                >
                  <div>Заказ музыки</div>
                </div>
              )}
          </div>
          <div className={`${classes.tabcontent}`}>
            {selected === "goal" && <GoalWidget goals={pageConfig.goals} />}
            {selected === "media" && <Media />}
          </div>
        </div>
      )}
    </>
  );
});

export default WidgetsComponent;
