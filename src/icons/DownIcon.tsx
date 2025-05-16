import React, { useContext } from "react";
import { UserSettingsStoreContext } from "../stores/UserSettingsStore";
import { observer } from "mobx-react-lite";

const DownIcon = observer(({}) => {
  const settings = useContext(UserSettingsStoreContext);

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M19.3536 9.35355L13.7678 14.9393C12.7915 15.9156 11.2085 15.9157 10.2322 14.9393L4.64645 9.35355L5.35355 8.64645L10.9393 14.2322C11.5251 14.818 12.4749 14.818 13.0607 14.2322L18.6464 8.64645L19.3536 9.35355Z"
          fill={settings.theme === "dark" ? "white" : "black"}
        />
      </svg>
    </>
  );
});

export default DownIcon;
