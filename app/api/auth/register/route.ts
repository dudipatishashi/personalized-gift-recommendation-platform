import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { findUserByEmail, saveUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await saveUser({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role is user
      createdAt: new Date(),
    })

    // Return success without exposing password
    return NextResponse.json({
      user: {
        id: user.insertedId,
        name,
        email,
        role: "user",
      },
      message: "User created successfully",
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
