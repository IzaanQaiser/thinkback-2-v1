import { NextResponse, type NextRequest } from "next/server";
import {
  createManualMemory,
  listMemories,
  MemoryStoreError,
} from "@/lib/memory-store";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof MemoryStoreError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { error: "Unexpected memory API error." },
    { status: 500 },
  );
}

function getTextField(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

async function parseJsonBody(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 50;
  const limit = Number.isFinite(parsedLimit) ? parsedLimit : 50;

  try {
    const memories = await listMemories(limit);
    return NextResponse.json({ memories });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request);

  if (!body) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const rawText = getTextField(body, "raw_text") ?? getTextField(body, "rawText");

  if (!rawText) {
    return NextResponse.json(
      { error: "raw_text is required and must be a non-empty string." },
      { status: 400 },
    );
  }

  try {
    const memory = await createManualMemory({
      rawText,
      title: getTextField(body, "title"),
      summary: getTextField(body, "summary"),
      tags: body.tags,
      searchKeywords: body.search_keywords,
      type: body.type,
      priority: body.priority,
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
