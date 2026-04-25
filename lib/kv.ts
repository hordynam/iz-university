import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";
import type { Project } from "./types";

const INDEX_KEY = "projects:index";
const projectKey = (id: string) => `project:${id}`;
const votesKey = (id: string) => `votes:${id}`;

export async function getAllProjectIds(): Promise<string[]> {
  noStore();
  const ids = await kv.get<string[]>(INDEX_KEY);
  return ids ?? [];
}

export async function getAllProjects(): Promise<Project[]> {
  noStore();
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
  noStore();
  const project = await kv.get<Project>(projectKey(id));
  return project ?? null;
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt" | "ratingSum" | "ratingCount">
): Promise<Project> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const project: Project = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    ratingSum: 0,
    ratingCount: 0,
  };

  await kv.set(projectKey(id), project);

  const ids = await getAllProjectIds();
  ids.unshift(id);
  await kv.set(INDEX_KEY, ids);

  return project;
}

export async function updateProject(
  id: string,
  data: Omit<Project, "id" | "createdAt" | "updatedAt" | "ratingSum" | "ratingCount">
): Promise<Project | null> {
  const existing = await getProjectById(id);
  if (!existing) return null;

  const updated: Project = {
    ...data,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    ratingSum: existing.ratingSum ?? 0,
    ratingCount: existing.ratingCount ?? 0,
  };

  await kv.set(projectKey(id), updated);
  return updated;
}

export async function getVotes(id: string): Promise<{ sum: number; count: number }> {
  noStore();
  const raw = await kv.hgetall<{ sum: string; count: string }>(votesKey(id));
  return {
    sum: Number(raw?.sum ?? 0),
    count: Number(raw?.count ?? 0),
  };
}

export async function addVote(
  id: string,
  value: number
): Promise<{ sum: number; count: number } | null> {
  const exists = await getProjectById(id);
  if (!exists) return null;

  // Atomic increments — no read-modify-write race condition
  const [sum, count] = await Promise.all([
    kv.hincrby(votesKey(id), "sum", value),
    kv.hincrby(votesKey(id), "count", 1),
  ]);

  // Best-effort: cache the totals in the project object for card display
  try {
    await kv.set(projectKey(id), {
      ...exists,
      ratingSum: sum,
      ratingCount: count,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // Card will show stale data until next successful update — acceptable
  }

  return { sum, count };
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
