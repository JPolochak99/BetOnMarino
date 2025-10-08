import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    console.log("Request body:", body)
    const { name, answers } = body

    const response = await prisma.UserResponse.create({
      data: { name, answers },
    })

    return new Response(
      JSON.stringify({ success: true, userId: response.id }),
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 })
  }
}
