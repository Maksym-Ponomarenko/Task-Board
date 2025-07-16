import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {db} from "@/lib/firebase/firebaseConfig";
import {addDoc, collection, updateDoc} from "@firebase/firestore";
import {Project, ProjectsState} from "@/types/projects.types";
import {doc} from "firebase/firestore";

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (project: Omit<Project, 'id'>, thunkAPI) => {
        try {
            const projectsRef = collection(db, 'projects');
            const docRef = await addDoc(projectsRef, project);
            await updateDoc(doc(db, 'projects', docRef.id), {
                id: docRef.id,
            })
            return docRef.id;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            } else {
                return thunkAPI.rejectWithValue("Неизвестная ошибка");
            }
        }
    }
);
const initialState: ProjectsState = {
    loading: false,
    error: null,
    createdProjectId: null,
};
const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        resetCreatedProject: (state) => {
            state.createdProjectId = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.createdProjectId = null;
                state.error = null;
                state.loading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.createdProjectId = action.payload;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "не удалось создать проект";
            })
    }
})

export const {resetCreatedProject} = projectsSlice.actions;
export default projectsSlice.reducer;