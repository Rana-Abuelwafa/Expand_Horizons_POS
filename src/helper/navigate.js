// src/utils/navigate.js
let navigator;

export const setNavigator = (nav) => {
  navigator = nav;
};

export const navigate = (to) => {
  if (navigator) navigator(to);
};
