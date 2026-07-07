let navigator;

// Registers app-level navigate function for non-component usage.
export const setNavigator = (nav) => {
  navigator = nav;
};

// Executes navigation if navigator has been initialized.
export const navigate = (to) => {
  if (navigator) navigator(to);
};
