import React, { useEffect, useRef, useState } from "react";
import classes from "./DonationTargetComponent.module.css";
import { Goal } from "../../../../logic/PaymentPageConfig";

export default function DonationTargetComponent({
  target,
  selectHandler,
}: {
  target: Goal;
  selectHandler: (selected: boolean) => void;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<boolean>(target.selected ?? false);

  useEffect(() => {
    setSelected(target.selected ?? false);
  }, [target]);

  function chooseHandler() {
    setSelected((oldValue) => {
      selectHandler(!oldValue);
      return !oldValue;
    });
  }

  useEffect(() => {
    if (!bar.current) {
      return;
    }
    let progress = Number.parseInt(
      (
        (target.accumulatedAmount.major / target.requiredAmount.major) *
        100
      ).toFixed(2),
    );
    if (progress > 100) {
      progress = 100;
    }
    bar.current.style["width"] = `${progress}%`;
  }, [target]);

  return (
    <>
      <div className={`${classes.donationtarget}`}>
        <div className={`${classes.title}`}>{target.briefDescription}</div>
        <div className={`${classes.progress}`}>
          <div ref={bar} className={`${classes.progressbar}`}></div>
        </div>
        <div className={`${classes.description}`}>{target.fullDescription}</div>
        <div className={`${classes.buttoncontainer}`}>
          <div className={`${classes.amount}`}>
            {target.accumulatedAmount.major}&#x20BD; /{" "}
            {target.requiredAmount.major}&#x20BD;
          </div>
          <button
            className={`clickable-button ${classes.choosebutton} ${
              selected
                ? classes.choosebuttonselected
                : classes.choosebuttonnotselected
            }`}
            onClick={chooseHandler}
          >
            {selected ? "Выбрано" : "Выбрать"}
          </button>
        </div>
      </div>
    </>
  );
}
