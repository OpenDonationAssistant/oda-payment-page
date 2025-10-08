import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./HeaderComponent.module.css";
import Markdown from "react-markdown";
import TwitchIcon from "../../../icons/TwitchIcon";
import { PaymentPageConfigContext } from "../../../logic/PaymentPageConfig";
import { PaymentStoreContext } from "../../../stores/PaymentStore";
import VKVLIcon from "../../../icons/VKVLIcon";

const StreamerSocials = observer(({ className }: { className?: string }) => {
  const pageConfig = useContext(PaymentPageConfigContext);
  return (
    <div className={`${classes.streamersocial} ${className ? className : ""}`}>
      {pageConfig.urls.get("twitch") && (
        <div className={`${classes.url}`}>
          <TwitchIcon />
          <a href={pageConfig.urls.get("twitch")}>Twitch</a>
        </div>
      )}
      {pageConfig.urls.get("vk") && (
        <div className={`${classes.url}`}>
          <VKVLIcon />
          <a href={pageConfig.urls.get("vk")}>ВКонтакте</a>
        </div>
      )}
      {pageConfig.urls.get("youtube") && (
        <div className={`${classes.url}`}>
          <a href={pageConfig.urls.get("youtube")}>YouTube</a>
        </div>
      )}
    </div>
  );
});

export const HeaderComponent = observer(({}) => {
  const pageConfig = useContext(PaymentPageConfigContext);
  const payment = useContext(PaymentStoreContext);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const arbitraryRef = useRef<HTMLDivElement>(null);
  const [needToHide, setNeedToHide] = useState<boolean>(false);

  useEffect(() => {
    setNeedToHide(
      (arbitraryRef.current?.scrollHeight ?? 0) >
        (arbitraryRef.current?.clientHeight ?? 0),
    );
  }, [arbitraryRef]);

  return (
    <div className={`${classes.header}`}>
      <div>
        <div className={`${classes.titlecontainer}`}>
          <span className={`${classes.title}`}>Донат для </span>{" "}
          <span className={`${classes.streamer}`}>
            {pageConfig.streamerName}
          </span>
        </div>
        <div
          ref={arbitraryRef}
          className={`${classes.arbitrary} ${showDescription ? classes.unlimited : classes.limited}`}
        >
          <Markdown>{pageConfig.arbitraryText}</Markdown>
        </div>
        {pageConfig.arbitraryText &&
          pageConfig.arbitraryText.length > 0 &&
          needToHide && (
            <div
              className={`${classes.openarbitrary}`}
              onClick={() => {
                setShowDescription((old) => !old);
              }}
            >
              {showDescription ? "Скрыть" : "Смотреть полное описание"}
            </div>
          )}
        <StreamerSocials className={`${classes.mobilesocials}`} />
      </div>
      <div className={`${classes.avatarcontainer}`}>
        <div>
          <img
            className={`${classes.avatar}`}
            src={`https://api.oda.digital/public/logo-${payment.recipientId}.png`}
          />
        </div>
        <StreamerSocials className={`${classes.pcsocials}`} />
      </div>
    </div>
  );
});
