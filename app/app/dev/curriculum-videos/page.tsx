import fs from "node:fs";
import path from "node:path";
import CurriculumVideosClient, { type VideoCatalog } from "./CurriculumVideosClient";

export const dynamic = "force-dynamic";

function loadCatalog(): VideoCatalog {
  const filePath = path.resolve(process.cwd(), "../curriculum/src/videos/videos.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as VideoCatalog;
}

export default function CurriculumVideosPage() {
  return <CurriculumVideosClient catalog={loadCatalog()} />;
}
