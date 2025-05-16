import React, { useContext } from "react";
import { UserSettingsStoreContext } from "../stores/UserSettingsStore";
import { observer } from "mobx-react-lite";

const UpIcon = observer(({}) => {
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
          d="M10.2322 9.06066L4.64645 14.6464L5.35355 15.3536L10.9393 9.76777C11.5251 9.18198 12.4749 9.18198 13.0607 9.76777L18.6464 15.3536L19.3536 14.6464L13.7678 9.06066C12.7915 8.08435 11.2085 8.08435 10.2322 9.06066Z"
          fill={settings.theme === "dark" ? "white" : "black"}
        />
      </svg>
    </>
  );
});
export default UpIcon;
