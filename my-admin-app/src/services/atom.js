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