import classes from "./Overlay.module.css";
import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

export class ModalState {
  private _show: boolean = false;
  private _level: number;
  private _onTop: boolean = false;
  private _parent: ModalState | null;
  private _onClose: () => void = () => {};

  constructor(parent?: ModalState, onClose?: () => void, show?: boolean) {
    this._onTop = false;
    this._level = (parent?.level ?? -2) + 1;
    this._parent = parent ?? null;
    if (onClose) {
      this._onClose = onClose;
    }
    if (show) {
      this._show = show;
    }
    makeAutoObservable(this);
  }
  public handleEscape() {
    if (this.show && this._onTop) {
      console.log({ state: this }, "handle keypress");
      this._show = false;
      this._onTop = false;
      if (this._parent !== null) {
        this._parent.onTop = true;
      }
    }
  }
  public set onTop(onTop: boolean) {
    this._onTop = onTop;
  }
  public get onTop() {
    return this._onTop;
  }
  public setOnClose(fn: () => void) {
    this._onClose = fn;
  }
  public set show(show: boolean) {
    this._onTop = show;
    if (this._parent !== null) {
      this._parent.onTop = !show;
    }
    this._show = show;
  }
  public get show() {
    return this._show;
  }
  public set level(level: number) {
    this._level = level;
  }
  public get level() {
    return this._level;
  }
  public onClose() {
    console.debug("calling on close");
    this._onClose();
  }
}

export const ModalStateContext = createContext(new ModalState());

export const Panel = ({ children }: { children: ReactNode }) => {
  return <div className={`${classes.modal} ${classes.big}`}>{children}</div>;
};

export const Title = ({ children }: { children: ReactNode }) => {
  return <div className={`${classes.title}`}>{children}</div>;
};

export const Subtitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <div className={`${classes.subtitle}`}>{children}</div>
    </div>
  );
};

export const Overlay = observer(({ children }: { children: ReactNode }) => {
  const state = useContext(ModalStateContext);

  const backRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!event.target) {
        return;
      }
      if (event.target === backRef.current && state.show) {
        state.onClose();
        state.show = false;
        event.stopPropagation();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.show]);

  // TODO difference : + 3 px
  return (
    <>
      {state.show &&
        createPortal(
          <>
            <div
              className={`${classes.back}`}
              style={{ zIndex: state.level * 200 + 3}}
            />
            <div
              ref={backRef}
              className={`${classes.container}`}
              style={{ zIndex: state.level * 200 + 3}}
            >
              {children}
            </div>
          </>,
          document.getElementById("root") ?? document.body,
        )}
    </>
  );
});
