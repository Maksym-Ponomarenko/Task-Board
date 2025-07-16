
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from './reducers/projectsSlice';

export const store = configureStore({
    reducer: {
        projects: projectsReducer
    },
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
