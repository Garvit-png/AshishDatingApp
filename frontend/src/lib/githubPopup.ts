/**
 * Read/write popup.json directly via GitHub Contents API.
 */

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "frontend/src/data/popup.json";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !owner || !repo) throw new Error("GitHub env vars missing");
  return { token, owner, repo, branch };
}

export interface PopupData {
  enabled: boolean;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: "red" | "white" | "black";
}

export async function readPopupFromGitHub(): Promise<PopupData> {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  return JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
}

export async function writePopupToGitHub(popup: PopupData): Promise<void> {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`;

  const shaRes = await fetch(`${url}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (!shaRes.ok) throw new Error("Could not get file SHA");
  const { sha } = await shaRes.json();

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Admin: update popup",
      content: Buffer.from(JSON.stringify(popup, null, 2)).toString("base64"),
      sha,
      branch,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(err.message ?? "GitHub write failed");
  }
}
