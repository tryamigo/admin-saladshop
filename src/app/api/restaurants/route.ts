//restaurants/route.ts
import { handleRequest } from "@/components/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      return await handleRequest(req, 'GET', '/restaurants');
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
  }
  
  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      return await handleRequest(req, 'POST', '/restaurants', body);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
    }
  }