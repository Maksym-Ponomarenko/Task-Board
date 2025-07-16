'use client'

import React from 'react';
import styles from "@/app/Home.module.scss";
import {Project} from "@/types/projects.types";
import {useRouter} from "next/navigation";


interface Props {
    projects: Project[];
}

const Client = ({projects}: Props) => {
    const router = useRouter();

    function toProjectCreation() {
        router.push("/CreateProject");
    }

    return (
        <div style={{userSelect: 'none'}}>
            <div className={styles.container}>
                <h2 className={styles.title}>Projects</h2>
                <button className={styles.btn} onClick={toProjectCreation}>Create Project</button>
            </div>

            <div className={styles.projects__frame}>
                <div className={styles.projects__table}>
                    <div>Marked</div>
                    <div>Name</div>
                    <div>Type</div>
                    <div>Key</div>
                    <div>Leader</div>
                </div>
                    {projects.map(project => (

                            <div key={project.id} className={styles.projects__table}>
                                <div>{project.name}</div>
                                <div>{project.name}</div>
                                <div>{project.settings.visibility}</div>
                                <div>{project.key}</div>
                                <div>{project.ownerId}</div>
                            </div>

                    ))}
            </div>

        </div>
    );
};

export default Client;