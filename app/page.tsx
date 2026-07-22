import { HomePage } from "@/app/components/HomePage";
import { getAllWorks } from "@/app/lib/work-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const works = await getAllWorks();

  return <HomePage initialWorks={works} />;
}
