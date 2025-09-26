import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { ActionsStore } from "../../../stores/ActionsStore";
import classes from "./ActionsWidget.module.css";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../../components/Overlay/Overlay";
import SearchIcon from "../../../icons/SearchIcon";
import CloseIcon from "../../../icons/CloseIcon";

export const ActionsWidget = observer(({}) => {
  const [actionStore] = useState<ActionsStore>(() => new ActionsStore());
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");

  return (
    <>
      <ModalStateContext.Provider value={modalState}>
        <Overlay>
          <Panel>
            <Title>
              <div>Добавить действие</div>
            </Title>
            <div className={`${classes.searchcontainer}`}>
              <SearchIcon />
              <input className={`${classes.search}`} onChange={(e) => {}} />
            </div>
            <div className={`${classes.categorylist}`}>
              {actionStore.available.map((category) => (
                <div
                  className={`${classes.category} ${selectedCategory === category.name ? classes.categoryactive : ""}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className={`${classes.categoryname}`}>
                    {category.name}
                  </div>
                </div>
              ))}
            </div>
            <div className={`${classes.actionlist}`}>
              {actionStore.available
                .find((category) => category.name === selectedCategory)
                ?.actions.map((action) => (
                  <div className={`${classes.action} ${selectedAction === action.id ? classes.actionactive : ""}`} onClick={() => {
                    setSelectedAction(action.id);
                  }}>
                    <div>{action.name}</div>
                    <div>{`+ ${action.cost} RUB`}</div>
                  </div>
                ))}
            </div>
            <div className={`${classes.buttoncontainer}`}>
              <div className={`${classes.cancelbutton}`}>Отменить</div>
              <div className={`${classes.addbutton}`}>Добавить</div>
            </div>
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
      <div className={`${classes.actionscontainer}`}>
        {actionStore.added.map((category) => (
          <div key={category.name} className={`${classes.action}`}>
            <div>{category.name}</div>
            <span className={`${classes.delete}`}>
              <CloseIcon />
            </span>
          </div>
        ))}
        <div className={`${classes.action}`}>
          <div
            className={`${classes.addbuttonlabel}`}
            onClick={() => (modalState.show = true)}
          >
            Добавить
          </div>
        </div>
      </div>
    </>
  );
});
