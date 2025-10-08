import { PrismaClient } from '@prisma/client'
import { userScores } from '../../../lib/calcScore'
import questions from '../../questions.json'  // adjust path as needed

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { answers } = body  // flat: { q1: "Danny and Aunt Kim", q2: "Nothing, ..." }

    // Map selected choice to its point value
    const pointsAnswers = {}
    for (const qId in answers) {
      const question = questions.find(q => q.id === qId)
      if (!question) continue

      const choice = answers[qId]
      const points = question.choices[choice] || 0
      pointsAnswers[qId] = { [choice]: points }
    }

    // Upsert into CorrectAnswers table
    const updatedAnswers = await prisma.correctAnswers.upsert({
      where: { id: 1 },
      update: { answers: pointsAnswers, created_at: new Date() },
      create: { id: 1, answers: pointsAnswers }
    })

    await userScores()

    return new Response(JSON.stringify(updatedAnswers), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 })
  }
}

export async function GET() {
  try {
    const correct = await prisma.correctAnswers.findFirst({
      where: { id: 1 }, // You hardcoded `id: 1` in the POST
    });

    if (!correct) {
      return new Response(JSON.stringify({ error: 'No correct answers found' }), { status: 404 });
    }

    // Flatten the answers structure for easier comparison
    const flattened = {};
    for (const qId in correct.answers) {
      const choicesObj = correct.answers[qId];
      const selected = Object.keys(choicesObj)[0]; // get the choice text
      flattened[qId] = selected;
    }

    return new Response(JSON.stringify(flattened), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
}