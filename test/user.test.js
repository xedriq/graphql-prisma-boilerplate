import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, getUsers, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

// jest.setTimeout(10000)

test('Should create new user and verify it exists in db.', async () => {
    const variables = {
        data: {
            name: "Cedrick",
            email: "xedriq@test.com",
            password: "password123"
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const userExist = await prisma.exists.User({
        id: response.data.createUser.user.id
    })
    expect(userExist).toBe(true)

})

test('Should expose public author profile.', async () => {
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Xedriq')
})

test('Should fail login with bad credentials.', async () => {
    const variables = {
        data: {
            email: "myemail@mail.com",
            password: "asdfaseoi343"
        }
    }

    await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
})

test('Should fail account creation with less than 8 characters.', async () => {
    const variables = {
        data: {
            name: "Myname",
            email: "validemail@mail.com",
            password: "abc123"
        }
    }

    await expect(client.mutate({ mutation: createUser, variables })).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    const { data } = await client.query({ query: getProfile })
    expect(data.me.id).toBe(userOne.user.id)
})