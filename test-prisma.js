import prisma from './lib/prisma.js'

async function main() {
  try {
    const streams = await prisma.stream.findMany()
    console.log('SUCCESS:', streams)
  } catch (error) {
    console.error('ERROR:', error.message)
  }
}

main()