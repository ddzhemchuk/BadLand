import { configureStore, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "storage",
  initialState: {
    currencies: [
      {
        code: "KZT",
        icon: "₸",
        rate: 1,
      },
    ],
    currentCurrency: {
      code: "KZT",
      icon: "₸",
      rate: 1,
    },
    servers: [],
    contacts: [],
    modal: {
      show: false,
      type: "contacts",
      message: "",
    },
  },
  reducers: {
    setCurrencies(state, action) {
      state.currencies = action.payload;
    },
    setCurrentCurrency(state, action) {
      state.currentCurrency = action.payload;
    },
    setServers(state, action) {
      state.servers = action.payload;
    },
    setContacts(state, action) {
      state.contacts = action.payload;
    },
    showModal(state, action) {
      state.modal.show = true;
      state.modal.type = action.payload.type;
      state.modal.message = action.payload.message
        ? action.payload.message
        : "Произошла неизвестная ошибка";
    },
    hideModal(state) {
      state.modal.show = false;
    },
  },
});

const store = configureStore({
  reducer: slice.reducer,
});

export const storageActions = slice.actions;
export default store;
