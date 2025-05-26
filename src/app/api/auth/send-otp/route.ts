import { NextResponse } from 'next/server';

const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const { mobileNumber } = await request.json();

    if (!mobileNumber) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Call backend to generate and send OTP
    const response = await fetch(`${apiUrl}/admin/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to send OTP' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 