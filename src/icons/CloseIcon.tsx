import React, { useContext } from "react";
import { UserSettingsStoreContext } from "../stores/UserSettingsStore";
import { observer } from "mobx-react-lite";

const CloseIcon = observer(({}) => {
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
          d="M12.2144 11.3661L8.32527 7.47704L7.61816 8.18414L11.5073 12.0732L7.26461 16.3159L7.95412 17.0054L12.1968 12.7627L16.1034 16.6694L16.8105 15.9623L12.9039 12.0556L16.793 8.16655L16.1034 7.47704L12.2144 11.3661Z"
          fill={settings.theme === "dark" ? "white" : "black"}
        />
      </svg>
    </>
  );
});

export default CloseIcon;
