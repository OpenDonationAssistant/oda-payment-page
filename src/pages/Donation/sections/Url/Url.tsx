import React from "react";
import { PaymentPageConfig } from "../../../../logic/PaymentPageConfig";

export default function Url({ config }: { config: PaymentPageConfig }) {
  const urls = config.urls;

  if (urls.size < 1) {
    return <></>;
  }

  if (urls.size == 1) {
    return (
      <>
        <a
          className="stream-link"
          href={urls.get("twitch")}
        >
          {config.streamerName}
        </a>
      </>
    );
  }
  return <></>;
}
