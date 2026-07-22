import { HomePage } from "@/app/components/HomePage";
import { getAllWorksForListing } from "@/app/lib/work-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const works = await getAllWorksForListing();

  return <HomePage initialWorks={works} />;
}
