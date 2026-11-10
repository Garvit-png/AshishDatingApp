/**
 * Tiny wrapper around the GitHub Contents API.
 * The dashboard saves to GitHub → Vercel redeploys → the live site updates.
 */

const API = "https://api.github.com";
export const CONTENT_PATH = "frontend/src/data/site.json";

export class GitHubError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function config() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !owner || !repo) throw new GitHubError("GitHub is not configured (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO).", 500);
  return { token, owner, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

function fileUrl(path: string) {
  const { owner, repo } = config();
  return `${API}/repos/${owner}/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** Returns the file's text and its sha, or null when the file does not exist. */
export async function readFile(path: string): Promise<{ text: string; sha: string } | null> {
  const { token, branch } = config();
  const res = await fetch(`${fileUrl(path)}?ref=${branch}`, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new GitHubError(`GitHub read failed (${res.status})`, 502);
  const data = await res.json();
  return { text: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
}

/**
 * Create or update a file. Pass `sha` to make sure nobody else changed the
 * file in between (GitHub answers 409 if they did).
 */
export async function writeFile(path: string, content: Buffer | string, message: string, sha?: string): Promise<void> {
  const { token, branch } = config();
  const body: Record<string, string> = {
    message,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;
  const res = await fetch(fileUrl(path), { method: "PUT", headers: headers(token), body: JSON.stringify(body) });
  if (res.ok) return;
  const err = await res.json().catch(() => ({}));
  if (res.status === 409 || res.status === 422) {
    throw new GitHubError("The website was changed somewhere else in the meantime. Reload the dashboard and try again.", 409);
  }
  throw new GitHubError(err.message ?? `GitHub write failed (${res.status})`, 502);
}
