//restaurants/[id]/route.ts
import { handleRequest } from "@/components/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Directly await context.params before using `id`
   const params = await context.params;

  try {
    if (!params.id) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    return await handleRequest(request, 'GET', `/restaurants/${params.id}`);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurant' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    const body = await request.json();
    return await handleRequest(request, 'PUT', `/restaurants/${id}`, body);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    return await handleRequest(request, 'DELETE', `/restaurants/${id}`);
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
  }
}
