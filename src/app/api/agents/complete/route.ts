// app/api/agents/complete/route.ts
import { handleRequest } from "@/components/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await handleRequest(req, 'POST', '/agents/complete', body);
  } catch (error) {
    console.error('Error completing delivery:', error);
    return NextResponse.json(
      { error: 'Failed to complete delivery' }, 
      { status: 500 }
    );
  }
}