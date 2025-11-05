import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import {
  Action,
  ActionCategory,
  ActionReference,
  ActionsStoreContext,
} from "../../../stores/ActionsStore";
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
import { PaymentStoreContext } from "../../../stores/PaymentStore";

const SelectActionComponent = observer(
  ({ action }: { action: ActionReference }) => {
    console.debug({ ref: action }, "rendering action");
    return (
      <div
        className={`${classes.action} ${action.amount > 0 ? classes.actionactive : ""}`}
      >
        <div>{action.action.name}</div>
        <div className={`${classes.actioncost}`}>
          <div>{`+ ${action.action.cost} RUB`}</div>
          <div className={`${classes.actioncount}`}>
            <div onClick={() => action.amount--}>-</div>
            <input
              type="number"
              value={action.amount}
              onChange={(e) => {
                action.amount = parseInt(e.target.value);
              }}
            />
            <div onClick={() => action.amount++}>+</div>
          </div>
        </div>
      </div>
    );
  },
);

export const ActionsWidget = observer(({}: {}) => {
  const paymentStore = useContext(PaymentStoreContext);
  const actionStore = useContext(ActionsStoreContext);
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ActionCategory | null>(null);
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
                    setSearched(actionStore?.search(e.target.value) ?? null);
                  } else {
                    setSearched(null);
                  }
                }}
              />
            </div>
            {!searched && (
              <div className={`${classes.categorylist}`}>
                {actionStore?.available.map((category) => (
                  <div
                    className={`${classes.category} ${selectedCategory?.name === category.name ? classes.categoryactive : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className={`${classes.categoryname}`}>
                      {category.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={`${classes.actionlist}`}>
              {selectedCategory?.actions.map((action) => (
                <SelectActionComponent action={action} />
              ))}
            </div>
            <div className={`${classes.buttoncontainer}`}>
              <div
                className={`${classes.cancelbutton}`}
                onClick={() => {
                  setSearched(null);
                  modalState.show = false;
                }}
              >
                Отменить
              </div>
              <button
                disabled={actionStore?.selected.length === 0}
                className={`${classes.addbutton}`}
                onClick={() => {
                  actionStore?.saveSelection();
                  setSearched(null);
                  modalState.show = false;
                  paymentStore?.checkAmount();
                }}
              >
                Добавить
              </button>
            </div>
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
      {actionStore && actionStore.available.length > 0 && (
        <div className={`${classes.actionscontainer}`}>
          {actionStore.added.map((added) => (
            <div key={added.id} className={`${classes.action}`}>
              <div>{added.amount}x</div>
              <div>{added.action.name}</div>
              <span
                className={`${classes.delete}`}
                onClick={() => {
                  actionStore.delete(added);
                  paymentStore?.checkAmount();
                }}
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
