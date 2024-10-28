// app/api/agents/assign/route.ts
import { handleRequest } from "@/components/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await handleRequest(req, 'POST', '/agents/assign', body);
    return response
  } catch (error: any) {
    console.error('Error assigning delivery agent:', error);
    
    // If there's a specific error message from the backend
    if (error.response?.data?.message) {
        return NextResponse.json(
            { message: error.response.data.message },
            { status: error.response.status }
        );
    }

    // Default error response
    return NextResponse.json(
        { message: 'Failed to assign delivery agent' },
        { status: 500 }
    );
}
}