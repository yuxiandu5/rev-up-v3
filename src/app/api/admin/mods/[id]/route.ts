import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {}