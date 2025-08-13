import { Question } from '@/types/question'

const QUESTIONS_PER_QUIZ = 10
const ANSWER_OPTIONS = 5

export function generateQuiz(questionPool: Question[]) {
  const questionsPerQuiz = questionPool.length < QUESTIONS_PER_QUIZ ? questionPool.length : QUESTIONS_PER_QUIZ
  const questions = questionPool.reduce(
    (acc, cur) => {
      if (cur.hasUserAnswered) {
        acc.answered.push(cur)
      } else {
        acc.unanswered.push(cur)
      }
      return acc
    },
    { answered: [], unanswered: [] } as { answered: Question[]; unanswered: Question[] }
  )

  const unfilledSpotsCount = questionsPerQuiz - questions.unanswered.length
  const quizQuestionPool: Question[] = []

  // Roll for answeredPool first
  const answeredPool = [...questions.answered]
  for (let i = 0; i < unfilledSpotsCount; i++) {
    const index = Math.round(Math.random() * (answeredPool.length - 1))
    quizQuestionPool.push(answeredPool[index])
    answeredPool.splice(index, 1)
  }

  // Roll for unanswered
  const unansweredPool = [...questions.unanswered]
  const rollsNeeded = questionsPerQuiz - quizQuestionPool.length
  for (let i = 0; i < rollsNeeded; i++) {
    const index = Math.round(Math.random() * (unansweredPool.length - 1))
    quizQuestionPool.push(unansweredPool[index])
    unansweredPool.splice(index, 1)
  }

  shuffleArrayOrder(quizQuestionPool)
  return generateAnswers(quizQuestionPool)
}

// Mutates the array in place
function shuffleArrayOrder<T>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i--) {
    const rolledIndex = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[rolledIndex]
    array[rolledIndex] = temp
  }
}

// Mutates the answers field to include random (5) answers including the correctAnswer
function generateAnswers(questions: Question[]): Question[] {
  return questions.map((question) => {
    const questionAnswers = [...question.answers]
    const randomizedAnswers: string[] = [questionAnswers.shift()!]
    for (let i = 0; i < ANSWER_OPTIONS - 1; i++) {
      //  -1 because we are adding correctAnswer to answer options
      const answerIndex = Math.round(Math.random() * (questionAnswers.length - 1))
      randomizedAnswers.push(questionAnswers[answerIndex])
      questionAnswers.splice(answerIndex, 1)
    }
    shuffleArrayOrder(randomizedAnswers)
    return {
      ...question,
      answers: randomizedAnswers,
    }
  })
}
