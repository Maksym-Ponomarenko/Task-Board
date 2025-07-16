'use client'

import React, {FC, useState} from 'react';
import {getAuth} from "firebase/auth";
import {Project, Visibility} from "@/types/projects.types";
import {useAppDispatch} from "@/hooks/ReduxHooks";
import {createProject} from '@/store/reducers/projectsSlice'
import {useRouter} from 'next/navigation';
import Input from '@/components/UI/Input/Input'
import styles from './CreateProject.module.scss'
import Select from "@/components/UI/Select/Select";
import {Option} from "@/components/UI/Select/Select";
import Button from "@/components/UI/Button/Button";

const auth = getAuth();
const user = auth.currentUser;
const CreateProject: FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [name, setName] = useState('');
    const [key, setKey] = useState('');
    const [type, setType] = useState<Option | null>(null);
    const [isDisabled, setDisabled] = useState<boolean>(false);
    const handleCreate = async () => {

        const now = new Date().toISOString();
        const newProject: Project = {
            name: name,
            id: '',
            createdAt: now,
            updatedAt: [],
            ownerId: user?.email || 'user',
            accessUsers: [{userId: user?.email || 'user', role: 'admin'}],
            accessEmails: [user?.email || 'user'],
            settings: {visibility: type?.name as Visibility, color: '#544ae2'},
            tasks: [],
            status: 'active',
            priority: 'medium',
            key: key

        }
        setDisabled(true)
        try {
            const resultAction = await dispatch(createProject(newProject));
            console.log('Создан проект с ID:', resultAction.payload);
            router.push('/')

        } catch (err) {
            console.error('Ошибка при создании проекта', err);
            setDisabled(false)
        }
    }
    return (
        <div className={styles.main}>
            <div className={styles.title}>Project Creation</div>
            <div className={styles.text}>You can change the project details at any time in the project settings.</div>
            <Input id="name"
                   label="Название"
                   required
                   placeholder="Попробуйте использовать название команды, цель проекта"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
            />
            <Input label="Key" id="KEY" required placeholder='' value={key}
                   onChange={(e) => setKey(e.target.value?.toUpperCase())} width='50%'/>

            <Select defaultText={''}
                    optionsList={[{id: 1, name: 'Private'}, {id: 2, name: 'Public'}, {id: 3, name: 'Team'}]}
                    onChange={setType} id={'typeSelect'} label={'Select Type'}/>
            <Button onClick={handleCreate} disabled={isDisabled}>create project</Button>
        </div>
    );
};

export default CreateProject;