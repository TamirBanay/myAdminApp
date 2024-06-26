import { atom } from "recoil";

export const _modules = atom({
  key: "_modules",
  default: [],
});
export const _logs = atom({
  key: "_logs",
  default: [],
});
export const _userIsLoggedIn = atom({
  key: "_userIsLoggedIn",
  default: localStorage.getItem("isLoggedIn") || false,
});
export const _timeToDesplayLogs = atom({
  key: "_timeToDesplayLogs",
  default: "today",
});
export const _citiesListIsOpen = atom({
  key: "citiesListIsOpen",
  default: false,
});
export const _theCurrentMacAddress = atom({
  key: "_theCurrentMacAddress",
  default: "",
});
