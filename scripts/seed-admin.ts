import { MongoClient } from "mongodb"
import { hash } from "bcryptjs"

async function seedAdmin() {
  // Replace with your MongoDB connection string
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/giftgenius"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@example.com" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await hash("admin123", 12)

    const adminUser = {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    }

    await usersCollection.insertOne(adminUser)
    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Error seeding admin user:", error)
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

seedAdmin()
