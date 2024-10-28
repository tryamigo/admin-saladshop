// app/api/delivery-agents/route.ts
import { handleRequest } from "@/components/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Get specific delivery agent
      return await handleRequest(req, 'GET', `/agents/${id}`);
    } else {
      // Get all delivery agents
      return await handleRequest(req, 'GET', '/agents');
    }
  } catch (error) {
    console.error('Error fetching delivery agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery agents' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Create new delivery agent
    return await handleRequest(req, 'POST', '/agents', body);
  } catch (error) {
    console.error('Error creating delivery agent:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery agent' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('id');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Delivery Agent ID is required' }, 
        { status: 400 }
      );
    }

    return await handleRequest(req, 'PUT', `/agents/${agentId}`, body);
  } catch (error) {
    console.error('Error updating delivery agent:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery agent' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('id');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Delivery Agent ID is required' }, 
        { status: 400 }
      );
    }

    return await handleRequest(req, 'DELETE', `/agents/${agentId}`);
  } catch (error) {
    console.error('Error deleting delivery agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery agent' }, 
      { status: 500 }
    );
  }
}