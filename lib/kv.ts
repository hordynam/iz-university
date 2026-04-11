import { kv } from "@vercel/kv";
import type { Project } from "./types";

const INDEX_KEY = "projects:index";
const projectKey = (id: string) => `project:${id}`;

export async function getAllProjectIds(): Promise<string[]> {
  const ids = await kv.get<string[]>(INDEX_KEY);
  return ids ?? [];
}

export async function getAllProjects(): Promise<Project[]> {
  const ids = await getAllProjectIds();
  if (ids.length === 0) return [];

  const keys = ids.map(projectKey);
  const projects = await kv.mget<(Project | null)[]>(...keys);

  return projects
    .filter((p): p is Project => p !== null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getProjectById(id: string): Promise<Project | null> {
  const project = await kv.get<Project>(projectKey(id));
  return project ?? null;
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const project: Project = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(projectKey(id), project);

  const ids = await getAllProjectIds();
  ids.unshift(id);
  await kv.set(INDEX_KEY, ids);

  return project;
}

export async function updateProject(
  id: string,
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project | null> {
  const existing = await getProjectById(id);
  if (!existing) return null;

  const updated: Project = {
    ...data,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(projectKey(id), updated);
  return updated;
}

export async function deleteProject(id: string): Promise<Project | null> {
  const project = await getProjectById(id);
  if (!project) return null;

  await kv.del(projectKey(id));

  const ids = await getAllProjectIds();
  const filtered = ids.filter((x) => x !== id);
  await kv.set(INDEX_KEY, filtered);

  return project;
}
