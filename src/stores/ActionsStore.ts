import { makeAutoObservable } from "mobx";
import { PaymentPageConfig } from "../logic/PaymentPageConfig";
import { uuidv7 } from "uuidv7";
import MiniSearch from "minisearch";
import { ActionControllerActionDto } from "@opendonationassistant/oda-actions-service-client";

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
      if (action.category) {
        const category = this._available.find(
          (category) => category.name === action.category,
        );
        if (category) {
          category.actions.push(this.convert(action));
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
      parameters: [],
      cost: action.price.major,
    };
  }

  public search(query: string): (Action | undefined)[] {
    return this._miniSearch
      .search(query, { fuzzy: 0.3 })
      .map((result) => this.byId(result.id));
  }

  public suggest(query: string) {
    return this._miniSearch
      .autoSuggest(query, { fuzzy: 0.3 });
  }

  public byId(id: string) {
    return this._pageConfig.actions
      .filter((action) => action.id === id)
      .map((action) => this.convert(action))
      .at(0);
  }

  public byRef(ref: ActionReference) {
    return this.byId(ref.actionId);
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
