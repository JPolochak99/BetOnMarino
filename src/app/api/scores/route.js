import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all users ordered by score descending
    const leaderboard = await prisma.userResponse.findMany({
      orderBy: { score: "desc" },
      select: { id: true, name: true, score: true, numberOfCorrectAnswers: true, answers: true},
    })

    return new Response(JSON.stringify(leaderboard), { status: 200 })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return new Response(JSON.stringify({ error: "Error fetching leaderboard" }), { status: 500 })
  }
}
