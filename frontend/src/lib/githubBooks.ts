/**
 * Read/write books.json directly via GitHub Contents API.
 * Works on Vercel (no local filesystem writes needed).
 */

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "frontend/src/data/books.json";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !owner || !repo) throw new Error("GitHub env vars missing");
  return { token, owner, repo, branch };
}

export async function readBooksFromGitHub(): Promise<unknown[]> {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    // Always fetch fresh — no cache
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

export async function writeBooksToGitHub(books: unknown[]): Promise<void> {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`;

  // Get current SHA (required for update)
  const shaRes = await fetch(`${url}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!shaRes.ok) throw new Error("Could not get file SHA from GitHub");
  const shaData = await shaRes.json();
  const sha = shaData.sha;

  const content = Buffer.from(JSON.stringify(books, null, 2)).toString("base64");

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Admin: update books data",
      content,
      sha,
      branch,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(err.message ?? "GitHub write failed");
  }
}
