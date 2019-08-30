import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: "Xedriq",
        email: 'xedriq@samplesample.com',
        password: bcrypt.hashSync('cedrick12345')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: "Charlotte",
        email: 'charlotte@sample.com',
        password: bcrypt.hashSync('charlie12345')
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase = async () => {
    // Clear test data
    await prisma.mutation.deleteManyUsers()

    // create userOne
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // Create userTwo
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)
}

export {
    seedDatabase as default,
    userOne,
    userTwo,
}