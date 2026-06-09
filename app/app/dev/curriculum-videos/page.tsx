import fs from "node:fs";
import path from "node:path";
import CurriculumVideosClient, { type CurriculumLevel } from "./CurriculumVideosClient";

export const dynamic = "force-dynamic";

interface Curriculum {
  levels: CurriculumLevel[];
}

function loadCurriculum(): Curriculum {
  const filePath = path.resolve(process.cwd(), "../../api/db/seeds/curriculum.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Curriculum;
}

export default function CurriculumVideosPage() {
  const curriculum = loadCurriculum();
  return <CurriculumVideosClient levels={curriculum.levels} />;
}
