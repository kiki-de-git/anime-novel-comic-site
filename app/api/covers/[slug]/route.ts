import { getCoverImageBySlug } from "@/app/lib/work-data";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const image = await getCoverImageBySlug(slug);
  const match = image?.match(/^data:([^;,]+);base64,(.+)$/);

  if (!match) {
    return new Response(null, { status: 404 });
  }

  return new Response(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
