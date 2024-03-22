import React, { useEffect, useRef, useState } from "react";
import { DonationTarget } from "./DonationTargetInterfaces";
import classes from "./DonationTargetComponent.module.css";

export default function DonationTargetComponent({
  target,
  selectHandler
}: {
  target: DonationTarget;
  selectHandler: (selected: boolean) => void;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<boolean>(target.selected);


  useEffect(() => {
    setSelected(target.selected);
  },[target]);

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
    let progress = (
      (target.collectedAmount / target.requiredAmount) *
      100
    ).toFixed(2);
    bar.current.style["width"] = `${progress}%`;
  }, [target]);

  return (
    <>
      <div className={`${classes.donationtarget}`}>
        <div className={`${classes.title}`}>{target.title}</div>
        <div className={`${classes.progress}`}>
          <div ref={bar} className={`${classes.progressbar}`}></div>
        </div>
        <div className={`${classes.description}`}>{target.description}</div>
        <div className={`${classes.buttoncontainer}`}>
          <div className={`${classes.amount}`}>
              {target.collectedAmount}&#x20BD; / {target.requiredAmount}&#x20BD;
          </div>
          <button
            className={`clickable-button ${classes.choosebutton} ${selected ? classes.choosebuttonselected : classes.choosebuttonnotselected}`}
            onClick={chooseHandler}
          >
            {selected ? "Выбрано":"Выбрать"}
          </button>
        </div>
      </div>
    </>
  );
}
