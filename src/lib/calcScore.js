import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function userScores(){
    const correct= await prisma.correctAnswers.findFirst({
        orderBy: { created_at: 'desc'},
    })

    if (!correct) {
        console.log('No correct answers found')
        return
    }
    
    const correctAnswers = correct.answers
    
    
    const users = await prisma.userResponse.findMany()
    
    const results = []

    for (const user of users){
        let totalPoints = 0
        let numCorrectAnswers = 0
        const breakdown = {}

        for (const qId in user.answers) {
            const userChoice = user.answers[qId]
            const correctPointsObj = correctAnswers[qId] || {}
            const points = correctPointsObj[userChoice] || 0
            
            breakdown[qId] = {
              choice: userChoice,
              points,
              correctChoice: Object.keys(correctPointsObj)[0],
              correctPoints: Object.values(correctPointsObj)[0],
            }
      
            totalPoints += points
            numCorrectAnswers += (points > 0 ? 1 : 0);
          }
          await prisma.userResponse.update({
        where: { id: user.id },
        data: { score: totalPoints, 
        numberOfCorrectAnswers: numCorrectAnswers},
    })

    results.push({
      name: user.name,
      totalPoints,
      breakdown,
    })
    }

}