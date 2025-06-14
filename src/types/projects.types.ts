export type Project = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;

    ownerId: string;
    accessUsers: {
        userId: string;
        role: 'admin' | 'editor' | 'viewer';
    }[];
    settings: {
        color?: string;
        iconUrl?: string;
        visibility: 'private' | 'public' | 'team';
    };

    tasks: Task[];
    status: 'active' | 'archived' | 'deleted';
    priority: 'lowest' | 'low' | 'medium' | 'high' | 'highest';
};
export type Task = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ProjectsState {
    loading: boolean;
    error: string | null;
    createdProjectId: string | null;
}