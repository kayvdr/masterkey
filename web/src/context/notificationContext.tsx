import { createContext, Dispatch, Reducer, useReducer } from "react";

type Severity = "success" | "error";

type State = {
  show: boolean;
  severity: Severity;
  message: string;
};

type Action =
  | {
      type: "SHOW_NOTIFICATION";
      severity: Severity;
      message: string;
    }
  | { type: "HIDE_NOTIFICATION" };

const showNotification = (severity: Severity, message: string): Action => ({
  type: "SHOW_NOTIFICATION",
  severity,
  message,
});

export const showSuccessNotification = (message: string): Action =>
  showNotification("success", message);

export const showErrorNotification = (message: string): Action =>
  showNotification("error", message);

export const hideNotification = (): Action => ({
  type: "HIDE_NOTIFICATION",
});

const initialState: State = {
  show: false,
  severity: "success",
  message: "",
};

const notificationReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "SHOW_NOTIFICATION":
      return {
        ...state,
        show: true,
        severity: action.severity,
        message: action.message,
      };
    case "HIDE_NOTIFICATION":
      return initialState;
  }
};

export const useNotification = () =>
  useReducer(notificationReducer, initialState);

const NotificationContext = createContext<Dispatch<Action>>(() => {});

export default NotificationContext;
