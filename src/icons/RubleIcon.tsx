import React, { useContext } from "react";
import { UserSettingsStoreContext } from "../stores/UserSettingsStore";
import { observer } from "mobx-react-lite";

const RubleIcon = observer(({ color }: { color?: string }) => {
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
          d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM10.5 8.5H13C13.401 8.5 14.0002 8.60166 14.5165 8.92695C15.0597 9.26918 15.5 9.85717 15.5 10.75C15.5 11.6428 15.0597 12.2308 14.5165 12.573C14.0002 12.8983 13.401 13 13 13H11.5V13.75H14V14.75H11.5V16H10.5V14.75H9V13.75H10.5V13H9V12H10.5V8.5ZM11.5 12H13C13.2656 12 13.6665 11.9267 13.9835 11.727C14.2736 11.5442 14.5 11.2572 14.5 10.75C14.5 10.2428 14.2736 9.95582 13.9835 9.77305C13.6665 9.57334 13.2656 9.5 13 9.5H11.5V12Z"
          fill={color ? color : settings.theme === "dark" ? "white" : "black"}
        />
      </svg>
    </>
  );
});

export default RubleIcon;
