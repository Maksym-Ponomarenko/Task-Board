
import { cookies } from "next/headers";
import { db, auth } from "@/lib/firebase/firebaseAdmin";
import { Project } from "@/types/projects.types";
import Client from "./client";

export default async function HomePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return <div>Not authenticated</div>;
    }

    let decodedToken;
    try {
        decodedToken = await auth.verifyIdToken(token);
    } catch (err) {
        console.error("Failed to verify token", err);
        return <div>Invalid token</div>;
    }

    const userEmail = decodedToken.email;

    if (!userEmail) return <div>Email not found</div>;

    const snapshot = await db
        .collection("projects")
        .where("accessEmails", "array-contains", userEmail)
        .get();

    const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Project[];
    console.log(projects);
    return <Client projects={projects} />;
}
