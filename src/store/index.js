import { useState, useCallback } from "react";
import { configureStore } from "@reduxjs/toolkit";

import heroes from "../components/heroesList/heroesSlice";
import filters from "../components/heroesFilters/filtersSlice";

const stringMiddleware = () => (next) => (action) => {
	if (typeof action === "string") {
		return next({
			type: action,
		});
	}

	return next(action);
};

const enhancer =
	(createStore) =>
	(...args) => {
		const store = createStore(...args);

		const oldDispatch = store.dispatch;
		store.dispatch = (action) => {
			if (typeof action === "string") {
				return oldDispatch({
					type: action,
				});
			}
			return oldDispatch(action);
		};
		return store;
	};

const store = configureStore({
	reducer: { heroes, filters },
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(stringMiddleware),
	devTools: process.env.NODE_ENV !== "production",
});

export default store;

const useToggle = (initialState = false) => {
	const [state, setState] = useState(initialState);
	const toggle = useCallback(() => setState((state) => !state), []);
	return [state, toggle];
};
