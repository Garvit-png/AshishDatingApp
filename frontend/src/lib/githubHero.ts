const GITHUB_API = "https://api.github.com";
const FILE_PATH = "frontend/src/data/hero.json";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !owner || !repo) throw new Error("GitHub env vars missing");
  return { token, owner, repo, branch };
}

export interface HeroData {
  line1: string;
  line2: string;
  line3: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  photo: string;
}

export async function readHeroFromGitHub(): Promise<HeroData> {
  const { token, owner, repo, branch } = getConfig();
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  return JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
}

export async function writeHeroToGitHub(hero: HeroData): Promise<void> {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`;
  const shaRes = await fetch(`${url}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }, cache: "no-store",
  });
  const { sha } = await shaRes.json();
  const putRes = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Admin: update hero", content: Buffer.from(JSON.stringify(hero, null, 2)).toString("base64"), sha, branch }),
  });
  if (!putRes.ok) { const e = await putRes.json(); throw new Error(e.message ?? "GitHub write failed"); }
}
