import { makeAutoObservable } from "mobx";
import { PaymentPageConfig } from "../logic/PaymentPageConfig";
import { uuidv7 } from "uuidv7";
import MiniSearch from "minisearch";
import { ActionControllerActionDto } from "@opendonationassistant/oda-actions-service-client";
import { createContext } from "react";

export interface ActionParameter {
  id: string;
  name: string;
  type: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  category?: string;
  parameters: ActionParameter[];
  cost: number;
}

export interface ActionReferenceParameter {
  id: string;
  value: any;
}

export interface ActionReference {
  id: string;
  amount: number;
  action: Action;
  parameters: ActionReferenceParameter[];
}

export interface ActionCategory {
  name: string;
  actions: ActionReference[];
}

export class ActionsStore {
  private _pageConfig: PaymentPageConfig;
  private _available: ActionCategory[] = [];
  private _added: ActionReference[] = [];
  private _miniSearch = new MiniSearch({
    fields: ["name"],
    storeFields: ["id"],
  });

  constructor(pageConfig: PaymentPageConfig) {
    this._pageConfig = pageConfig;
    this._pageConfig.actions.forEach((action) => {
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
    this._pageConfig.actions.map((action) => {
      const converted = this.convert(action);
      if (action.category) {
        const category = this._available.find(
          (category) => category.name === action.category,
        );
        if (category) {
          category.actions.push({
            id: uuidv7(),
            amount: 0,
            action: converted,
            parameters: [],
          });
        }
      }
    });
    makeAutoObservable(this);
    this._miniSearch.addAll(pageConfig.actions);
  }

  private convert(action: ActionControllerActionDto): Action {
    return {
      id: action.id,
      name: action.name,
      description: action.name,
      category: action.category,
      parameters: [],
      cost: action.price.major,
    };
  }

  public get available(): ActionCategory[] {
    return this._available;
  }

  public get selected(): ActionReference[] {
    return this._available
      .flatMap((category) => category.actions)
      .filter((action) => action.amount > 0);
  }

  public search(query: string): (Action | undefined)[] {
    return this._miniSearch
      .search(query, { fuzzy: 0.3 })
      .map((result) => this.byId(result.id));
  }

  public suggest(query: string) {
    return this._miniSearch.autoSuggest(query, { fuzzy: 0.2 });
  }

  public byId(id: string) {
    return this._pageConfig.actions
      .filter((action) => action.id === id)
      .map((action) => this.convert(action))
      .at(0);
  }

  public clearSelection() {
    this._available
      .flatMap((category) => category.actions)
      .forEach((action) => (action.amount = 0));
  }

  public saveSelection() {
    this._available
      .flatMap((category) => category.actions)
      .filter((action) => action.amount > 0)
      .forEach((action) => {
        this._added.push({
          id: uuidv7(),
          amount: action.amount,
          action: action.action,
          parameters: action.parameters,
        });
        action.amount = 0;
      });
  }

  public get added(): ActionReference[] {
    return this._added;
  }

  public get cost() {
    return this._added
      .map((added) => added.action.cost * added.amount)
      .reduce((a, b) => a + b, 0);
  }

  public delete(action: ActionReference) {
    action.amount = 0;
    this._added = this._added.filter((added) => added.id !== action.id);
  }
}

export const ActionsStoreContext = createContext<ActionsStore | null>(null);
