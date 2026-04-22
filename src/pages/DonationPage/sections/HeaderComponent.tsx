import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./HeaderComponent.module.css";
import Markdown from "react-markdown";
import TwitchIcon from "../../../icons/TwitchIcon";
import { PaymentPageConfigContext } from "../../../logic/PaymentPageConfig";
import { PaymentStoreContext } from "../../../stores/PaymentStore";
import VKVLIcon from "../../../icons/VKVLIcon";
import BoostyIcon from "../../../icons/BoostyIcon";
import YouTubeIcon from "../../../icons/YouTubeIcon";
import KickIcon from "../../../icons/KickIcon";

const StreamerSocials = observer(({ className }: { className?: string }) => {
  const pageConfig = useContext(PaymentPageConfigContext);
  return (
    <div className={`${classes.streamersocial} ${className ? className : ""}`}>
      {[...pageConfig.urls]
        .map(([k, v]) => ({ key: k, url: v }))
        .map((entry, index) => (
          <>
            {entry.key === "twitch" && (
              <div className={`${classes.url}`}>
                <TwitchIcon />
                <a href={entry.url}>Twitch</a>
              </div>
            )}
            {entry.key === "vk" && (
              <div className={`${classes.url}`}>
                <VKVLIcon />
                <a href={entry.url}>ВКонтакте</a>
              </div>
            )}
            {entry.key === "youtube" && (
              <div className={`${classes.url}`}>
                <YouTubeIcon />
                <a href={entry.url}>YouTube</a>
              </div>
            )}
            {entry.key === "telegram" && (
              <div className={`${classes.url}`}>
                <a href={entry.url}>Telegram</a>
              </div>
            )}
            {entry.key === "kick" && (
              <div className={`${classes.url}`}>
                <KickIcon />
                <a href={entry.url}>Kick</a>
              </div>
            )}
            {entry.key === "boosty" && (
              <div className={`${classes.url}`}>
                <BoostyIcon />
                <a href={entry.url}>Boosty</a>
              </div>
            )}
            {entry.key === "trovo" && (
              <div className={`${classes.url}`}>
                <a href={entry.url}>Trovo</a>
              </div>
            )}
          </>
        ))}
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
      <div className={`${classes.row}`}>
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
        </div>
        <div className={`${classes.avatarcontainer}`}>
          {payment && payment.recipientId && (
            <div>
              <img
                className={`${classes.avatar}`}
                src={`https://api.oda.digital/public/logo-${payment.recipientId}.png`}
              />
            </div>
          )}
          <StreamerSocials className={`${classes.pcsocials}`} />
        </div>
      </div>
    </div>
  );
});
