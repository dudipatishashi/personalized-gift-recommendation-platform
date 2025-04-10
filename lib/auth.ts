import { compare, hash } from "bcryptjs"
import clientPromise from "./mongodb"
import type { ObjectId } from "mongodb"

export interface User {
  _id?: string | ObjectId
  name: string
  email: string
  password: string
  role: "user" | "admin"
  createdAt: Date
}

export async function createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
  const client = await clientPromise
  const db = client.db()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await hash(userData.password, 12)

  // Create the user
  const newUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(newUser)

  return {
    ...newUser,
    _id: result.insertedId,
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ email })
  return user as User | null
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return null
  }

  return user
}
