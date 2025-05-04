
import { Octokit } from "@octokit/rest";
import { v4 as uuidv4 } from "uuid";
import { GITHUB_TOKEN, GITHUB_USERNAME, GITHUB_REPO } from "../../lib/config";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const filename = `${uuidv4()}.png`;
  const path = `uploads/${filename}`;
  const content = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path,
      message: `Upload ${filename}`,
      content,
      committer: {
        name: "KatsuXD55",
        email: "untukkontakku@gmail.com",
      },
      author: {
        name: "KatsuXD55",
        email: "untukkontakku@gmail.com",
      },
    });

    const proxyUrl = `${req.headers.origin}/${filename}`;
    res.status(200).json({ url: proxyUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
