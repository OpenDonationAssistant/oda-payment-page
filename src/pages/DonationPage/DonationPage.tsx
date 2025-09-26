import React, { useContext } from "react";
import classes from "./DonationPage.module.css";
import { HeaderComponent } from "./sections/HeaderComponent";
import MainComponent from "./sections/MainComponent";
import WidgetsComponent from "./sections/WidgetsComponent";
import PaymentComponent from "./sections/PaymentComponent";
import { Link, useNavigate } from "react-router-dom";
import { UserSettingsStoreContext } from "../../stores/UserSettingsStore";
import { observer } from "mobx-react-lite";
import { PaymentPageConfigContext } from "../../logic/PaymentPageConfig";
import NightIcon from "../../icons/NightIcon";

const DarkTheme = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        :root {
          --oda-control-color: #B2D4FB;
          --oda-panel-color: #1B1B1F;
          --oda-page-color: #000;
          --oda-text-color: #fff;
          --oda-disabled-color: #727080;
          --oda-inactive-color: #141417;
          --oda-selected-panel-color: #1D1D26;
          --oda-border-color: #28282E;
          --oda-alert-color: #231717;
          --oda-invalid-color: var(--oda-attention-700);
        }`,
      }}
    />
  );
};

const LightTheme = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        :root {
          --oda-control-color: #3D47FF;
          --oda-panel-color: #f5f5fa;
          --oda-page-color: #fff;
          --oda-text-color: #000;
          --oda-disabled-color: #9B99A3;
          --oda-inactive-color: #E6E6F0;
          --oda-selected-panel-color: #B2D4FB;
          --oda-border-color: white;
          --oda-alert-color: #FFEDED;
          --oda-invalid-color: var(--oda-attention-500);
        }`,
      }}
    />
  );
};

const DonationPage = observer(({}) => {
  const userSettings = useContext(UserSettingsStoreContext);
  const pageConfig = useContext(PaymentPageConfigContext);

  const goalsEnabled = pageConfig.goals && pageConfig.goals.length > 0;
  const mediaEnabled =
    pageConfig.requestsEnabled && !pageConfig.requestsDisabledPermanently;

  const showWide = goalsEnabled || mediaEnabled;

  return (
    <>
      {userSettings.theme === "dark" && <DarkTheme />}
      {userSettings.theme === "light" && <LightTheme />}
      <div className={`${classes.footerback}`} />
      <div className={`${classes.pagecontainer}`}>
        <div
          className={`${classes.page} ${showWide ? classes.wide : classes.compact}`}
        >
          <HeaderComponent />
          <div className={`${classes.centralsection}`}>
            <MainComponent />
            <WidgetsComponent />
          </div>
          <div>
            <PaymentComponent />
          </div>
        </div>
        <div className={`${classes.footer}`}>
          <div>
            <div className={`${classes.footerdescription}`}>
              {pageConfig.streamerName} - {pageConfig.streamerDescription}
            </div>
            <Link className={`${classes.offerlink}`} to="/offer">
              Пользовательское соглашение
            </Link>
          </div>
          {false && (
            <button className={`${classes.feedback}`}>Обратная связь</button>
          )}
          {false && (
            <button
              className={`${classes.feedback}`}
              onClick={() => {
                userSettings.useOldTheme === true;
                window.location.reload();
              }}
            >
              Старый дизайн
            </button>
          )}
          <button
            className={`${classes.theme}`}
            onClick={() => userSettings.switchTheme()}
          >
            <NightIcon />
            <div className={`${classes.themename}`}>
              {userSettings.theme === "dark"
                ? "Светлая версия"
                : "Темная версия"}
            </div>
          </button>
        </div>
      </div>
    </>
  );
});

export default DonationPage;
