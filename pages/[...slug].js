
import { GITHUB_USERNAME, GITHUB_REPO } from "../lib/config";

export default async function handler(req, res) {
  const slug = req.query.slug || [];
  if (slug.length !== 1) return res.status(404).send("Not Found");

  const filename = slug[0];
  const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/uploads/${filename}`;

  const response = await fetch(url);
  if (!response.ok) return res.status(404).send("Image not found");

  res.setHeader("Content-Type", response.headers.get("content-type"));
  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
}
