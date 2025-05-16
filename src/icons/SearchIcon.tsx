import React, { useContext } from "react";
import { UserSettingsStoreContext } from "../stores/UserSettingsStore";

export default function SearchIcon({}) {
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
          d="M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10ZM15.0225 15.7296C13.8844 16.53 12.4971 17 11 17C7.13401 17 4 13.866 4 10C4 6.13401 7.13401 3 11 3C14.866 3 18 6.13401 18 10C18 12.0075 17.1549 13.8176 15.8011 15.094L20.3536 19.6464L19.6464 20.3536L15.0225 15.7296Z"
          fill={settings.theme === "dark" ? "white" : "black"}
        />
      </svg>
    </>
  );
}
