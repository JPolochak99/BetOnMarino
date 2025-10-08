import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Remove the most recent correct answers as an admin
export async function DELETE(request) {
  try {
    // Check if the user is authorized to delete (e.g., check for an admin header or token)
    //const isAdmin = request.headers.get('Admin-Authorization') === 'your-admin-token'; // You can set up your own method for verifying admins

    //if (!isAdmin) {
      //return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    //}

    // Delete the most recent correct answers
    const deleted = await prisma.correctAnswers.deleteMany({
      where: {
        // Optional: Add any condition if needed (e.g., only delete answers from a certain period)
      },
    });

    if (deleted.count > 0) {
      return NextResponse.json({ message: 'Correct answers removed successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No correct answers found to delete' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error removing correct answers:', error);
    return NextResponse.json({ error: 'Error removing correct answers' }, { status: 500 });
  }
}
