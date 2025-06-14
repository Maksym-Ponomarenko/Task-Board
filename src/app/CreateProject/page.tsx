'use client'

import React, {FC, useState} from 'react';
import { getAuth } from "firebase/auth";
import {Project} from "@/types/projects.types";
import {useAppDispatch} from "@/hooks/ReduxHooks";
import { createProject } from '@/store/reducers/projectsSlice'
import { useRouter } from 'next/router'

const auth = getAuth();
const user = auth.currentUser;
const CreateProject:FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [name, setName] = useState('');
    const handleCreate = async () => {

        const now = new Date().toISOString();
        const newProject: Project = {
            name: name,
            id:'',
            createdAt: now,
            updatedAt: [],
            ownerId: user?.email || 'user',
            accessUsers:[{userId: user?.email||'user', role:'admin'}],
            settings:{visibility:'private', color:'#544ae2'},
            tasks: [{id: now, createdAt: now, updatedAt:[], name:'understand the website interface'}],
            status:'active',
            priority:'medium'
        }
        try {
            const resultAction = await dispatch(createProject(newProject));
            console.log('Создан проект с ID:', resultAction.payload);
            await router.push('/')
        } catch (err) {
            console.error('Ошибка при создании проекта', err);
        }
    }
    return (
        <div>
            <input onChange={(e)=>setName(e.target.value)} value={name}/>
            <button onClick={handleCreate}>Create project</button>
        </div>
    );
};

export default CreateProject;