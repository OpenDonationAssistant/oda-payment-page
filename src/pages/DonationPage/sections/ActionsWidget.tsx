import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Action, ActionsStore } from "../../../stores/ActionsStore";
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
import { PaymentPageConfigContext } from "../../../logic/PaymentPageConfig";
import { PaymentStoreContext } from "../../../stores/PaymentStore";

export const ActionsWidget = observer(({}: {}) => {
  const pageConfig = useContext(PaymentPageConfigContext);
  const [actionStore] = useState<ActionsStore>(
    () => new ActionsStore(pageConfig),
  );
  const paymentStore = useContext(PaymentStoreContext);
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [searched, setSearched] = useState<(Action | undefined)[] | null>(null);

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
              <input
                className={`${classes.search}`}
                onChange={(e) => {
                  if (e.target.value) {
                    setSearched(actionStore.search(e.target.value));
                  } else {
                    setSearched(null);
                  }
                }}
              />
            </div>
            {!searched && (
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
            )}
            <div className={`${classes.actionlist}`}>
              {actionStore.available
                .find((category) => category.name === selectedCategory)
                ?.actions.map((action) => (
                  <div
                    className={`${classes.action} ${selectedAction === action ? classes.actionactive : ""}`}
                    onClick={() => {
                      setSelectedAction(action);
                    }}
                  >
                    <div>{action.name}</div>
                    <div>{`+ ${action.cost} RUB`}</div>
                  </div>
                ))}
            </div>
            <div className={`${classes.buttoncontainer}`}>
              <div
                className={`${classes.cancelbutton}`}
                onClick={() => {
                  setSelectedAction(null);
                  setSearched(null);
                  modalState.show = false;
                }}
              >
                Отменить
              </div>
              <button
                disabled={!selectedAction}
                className={`${classes.addbutton}`}
                onClick={() => {
                  if (selectedAction) {
                    actionStore.add(selectedAction);
                  }
                  setSelectedAction(null);
                  setSearched(null);
                  modalState.show = false;
                }}
              >
                Добавить
              </button>
            </div>
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
      {actionStore.available.length > 0 && (
        <div className={`${classes.actionscontainer}`}>
          {actionStore.added.map((added) => (
            <div key={added.id} className={`${classes.action}`}>
              <div>{actionStore.byRef(added)?.name}</div>
              <span
                className={`${classes.delete}`}
                onClick={() => actionStore.delete(added)}
              >
                <CloseIcon />
              </span>
            </div>
          ))}
          <div
            className={`${classes.action}`}
            onClick={() => (modalState.show = true)}
          >
            <div className={`${classes.addbuttonlabel}`}>Добавить</div>
          </div>
        </div>
      )}
    </>
  );
});
