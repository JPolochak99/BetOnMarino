// /src/app/api/hasCorrectAnswers/route.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // Import NextResponse
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if correct answers exist in your database
    const correctAnswers = await prisma.correctAnswers.findFirst({
      orderBy: { created_at: 'desc' },
    });

    if (correctAnswers) {
      return NextResponse.json({ hasCorrectAnswers: true });
    } else {
      return NextResponse.json({ hasCorrectAnswers: false });
    }
  } catch (error) {
    console.error("Error fetching correct answers:", error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
