import React, { useContext } from "react";
import { UserSettingsStoreContext } from "../stores/UserSettingsStore";
import { observer } from "mobx-react-lite";

const CheckIcon = observer(({}) => {
  const settings = useContext(UserSettingsStoreContext);

  return (
    <>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="18" height="18" rx="9" fill="#B2D4FB" />
        <path d="M13 7L8.04762 12L5 8.92308" stroke="black" />
      </svg>
    </>
  );
});

export default CheckIcon;
