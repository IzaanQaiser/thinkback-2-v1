import { NextResponse, type NextRequest } from "next/server";
import {
  deleteMemory,
  getMemory,
  MemoryStoreError,
  updateMemory,
} from "@/lib/memory-store";
import {
  isMemoryPriority,
  isMemoryType,
  normalizeStringArray,
} from "@/lib/memories";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
  return typeof value === "string" ? value.trim() : undefined;
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

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const memory = await getMemory(id);

    if (!memory) {
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }

    return NextResponse.json({ memory });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await parseJsonBody(request);

  if (!body) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const requestedType = body.type;
  const requestedPriority = body.priority;

  if (requestedType !== undefined && !isMemoryType(requestedType)) {
    return NextResponse.json({ error: "Invalid memory type." }, { status: 400 });
  }

  if (requestedPriority !== undefined && !isMemoryPriority(requestedPriority)) {
    return NextResponse.json(
      { error: "Invalid memory priority." },
      { status: 400 },
    );
  }

  try {
    const memory = await updateMemory(id, {
      title: getTextField(body, "title"),
      summary: getTextField(body, "summary"),
      type: requestedType,
      tags: body.tags === undefined ? undefined : normalizeStringArray(body.tags),
      priority: requestedPriority,
    });

    if (!memory) {
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }

    return NextResponse.json({ memory });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const deletedCount = await deleteMemory(id);

    if (deletedCount === 0) {
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
