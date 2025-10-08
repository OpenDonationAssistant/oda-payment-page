import { makeAutoObservable } from "mobx";
import { PaymentPageConfig } from "../logic/PaymentPageConfig";
import { uuidv7 } from "uuidv7";

export interface ActionParameter {
  id: string;
  name: string;
  type: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  parameters: ActionParameter[];
  cost: number;
}

export interface ActionReference {
  id: string;
  actionId: string;
}

export interface ActionCategory {
  name: string;
  actions: Action[];
}

export class ActionsStore {
  private _available: ActionCategory[] = [];
  private _added: ActionReference[] = [];
  constructor(pageConfig: PaymentPageConfig) {
    const actions = pageConfig.actions;
    actions.forEach((action) => {
      if (action.category) {
        if (
          !this._available.find((category) => category.name === action.category)
        ) {
          this._available.push({
            name: action.category,
            actions: [],
          });
        }
      }
    });
    actions.map((action) => {
      if (action.category) {
        const category = this._available.find(
          (category) => category.name === action.category,
        );
        if (category) {
          category.actions.push({
            id: action.id,
            name: action.name,
            description: action.name,
            parameters: [],
            cost: action.price.major,
          });
        }
      }
    });
    makeAutoObservable(this);
  }

  public find(ref: ActionReference) {
    const category = this._available
      .filter((category) =>
        category.actions.find((action) => action.id === ref.actionId),
      )
      .at(0);
    const action = category?.actions.find(
      (action) => action.id === ref.actionId,
    );
    return action;
  }

  public get available(): ActionCategory[] {
    return this._available;
  }

  public add(action: Action) {
    this._added = this._added.concat({ id: uuidv7(), actionId: action.id });
  }

  public delete(ref: ActionReference) {
    this._added = this._added.filter((action) => action.id !== ref.id);
  }

  public get added(): ActionReference[] {
    return this._added;
  }
}
