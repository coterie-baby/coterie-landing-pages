import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; voteType: string }> }
) {
  const { id, voteType } = await params;

  const response = await fetch(
    `https://www.coterie.com/api/yotpo/${id}/vote/${voteType}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
