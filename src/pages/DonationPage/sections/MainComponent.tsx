import React, { useContext, useRef, useState } from "react";
import classes from "./MainComponent.module.css";
import CommentIcon from "../../../icons/CommentIcon";
import PersonIcon from "../../../icons/PersonIcon";
import RubleIcon from "../../../icons/RubleIcon";
import Amount from "../../../components/Amount/Amount";
import { PaymentStoreContext } from "../../../stores/PaymentStore";
import { observer } from "mobx-react-lite";
import {
  CharLimitTreshold,
  PaymentPageConfigContext,
} from "../../../logic/PaymentPageConfig";

const MessageComponent = observer(({}) => {
  const payment = useContext(PaymentStoreContext);
  const pageConfig = useContext(PaymentPageConfigContext);

  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const [inputHeight, setInputHeight] = useState<number>(150);
  const [limit, setLimit] = useState<number>(calcCharLimit());

  // TODO: use reaction to paymentController.amount
  function calcCharLimit(): number {
    if (pageConfig.charLimit.type === "fixed") {
      return pageConfig.charLimit.value as number;
    }
    const tresholds = pageConfig.charLimit.value as CharLimitTreshold[];
    console.log({tresholds: tresholds}, "finding limits");
    return (
      tresholds
        .sort((a, b) => -(a.treshold - b.treshold))
        .find((value) => value.treshold <= payment.amount)?.limit ?? 300
    );
  }

  function handleMessage(text: string) {
    let newValue = text.slice(0, limit);
    const scrollHeight = descriptionInputRef.current?.scrollHeight ?? 150;
    setInputHeight(scrollHeight > 150 ? scrollHeight : 150);
    payment.text = newValue;
  }

  return (
    <>
      <div className={`${classes.section} ${classes.messagesection}`}>
        <div className={`${classes.messagecontainer}`}>
          <span className={`${classes.iconcontainer}`}>
            <CommentIcon />
          </span>
          <textarea
            ref={descriptionInputRef}
            className={`${classes.message}`}
            style={{ height: inputHeight }}
            value={payment.text}
            placeholder="Сообщение"
            maxLength={limit}
            onChange={(e) => handleMessage(e.target.value)}
          />
        </div>
        <div className={`${classes.messagestats}`}>
          <div>
            Минимальная сумма при данном количестве символов -{" "}
            <Amount amount={payment.minimalPayment} />
          </div>
          <div>
            {payment.text.length} / {limit}
          </div>
        </div>
      </div>
    </>
  );
});

const NicknameComponent = observer(({}) => {
  const payment = useContext(PaymentStoreContext);

  return (
    <>
      <div className={`${classes.section}`}>
        <div className={`${classes.nicknamecontainer}`}>
          <span className={`${classes.iconcontainer}`}>
            <PersonIcon />
          </span>
          <input
            className={`${classes.nickname}`}
            placeholder="Аноним"
            onChange={(e) => {
              payment.nickname = e.target.value;
            }}
          />
          <div className={`${classes.anonymcontainer}`}>
            <div
              className={`${classes.anonymdescription} ${payment.isAnonym ? classes.anonymdescriptionactive : classes.anonymdescriptionpassive}`}
            >
              Отправить анонимно
            </div>
            <div
              className={`${classes.switchcontainer} ${payment.isAnonym ? classes.switchactive : classes.switchpassive}`}
              onClick={() => (payment.isAnonym = !payment.isAnonym)}
            >
              <div className={`${classes.switch}`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

const AmountComponent = observer(({}) => {
  const payment = useContext(PaymentStoreContext);

  return (
    <>
      <div className={`${classes.section}`}>
        <div
          className={`${classes.nicknamecontainer}  ${payment.error ? classes.error : ""}`}
        >
          <span className={`${classes.iconcontainer}`}>
            <RubleIcon
              color={payment.error ? "var(--oda-invalid-color)" : undefined}
            />
          </span>
          <input
            className={`${classes.nickname}`}
            value={payment.amount}
            onChange={(e) => {
              if (!e.target.value) {
                payment.amount = 0;
              }
              const parsed = parseInt(e.target.value);
              if (!isNaN(parsed)) {
                payment.amount = parsed;
              }
            }}
          />
          <div className={`${classes.minimal}`}>
            <div className={`${classes.minimaldescription}`}>
              Минимальная сумма
            </div>
            <div
              className={`${classes.minimalamount}`}
              onClick={() => {
                payment.amount = payment.minimalPayment;
              }}
            >
              <Amount amount={payment.minimalPayment} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default function MainComponent({}) {
  return (
    <>
      <div className={`${classes.mainsection}`}>
        <AmountComponent />
        <NicknameComponent />
        <MessageComponent />
      </div>
    </>
  );
}
