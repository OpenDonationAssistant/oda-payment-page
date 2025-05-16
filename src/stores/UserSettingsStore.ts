import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class UserSettingsStore {
  private _theme: "dark" | "light";
  private _useOldTheme: boolean;

  constructor() {
    console.log("local storage: " + localStorage.getItem("useOldTheme"));
    this._theme =
      "dark" === (localStorage.getItem("theme") ?? "light") ? "dark" : "light";
    this._useOldTheme =
      "true" === (localStorage.getItem("useOldTheme") ?? "false");
    makeAutoObservable(this);
  }

  public get theme(): "dark" | "light" {
    return this._theme;
  }

  public get useOldTheme(){
    return this._useOldTheme;
  }

  public switchTheme(): void {
    this._theme = this._theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this._theme);
  }

  public set useOldTheme(useOldTheme: boolean){
    localStorage.setItem("useOldTheme", "true");
    this._useOldTheme = useOldTheme;
  }
}

export const UserSettingsStoreContext = createContext(new UserSettingsStore());
