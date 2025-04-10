import clientPromise from "./mongodb"
import type { Gift } from "@/types/gift"
import { ObjectId } from "mongodb"

// Collection names
const USERS_COLLECTION = "users"
const GIFTS_COLLECTION = "gifts"
const RECOMMENDATIONS_COLLECTION = "recommendations"

// User-related functions
export async function saveUser(userData: any) {
  const client = await clientPromise
  const db = client.db()

  return db.collection(USERS_COLLECTION).insertOne(userData)
}

export async function findUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db()

  return db.collection(USERS_COLLECTION).findOne({ email })
}

export async function updateUser(userId: string, updateData: any) {
  const client = await clientPromise
  const db = client.db()

  return db.collection(USERS_COLLECTION).updateOne({ _id: new ObjectId(userId) }, { $set: updateData })
}

// Gift-related functions
export async function saveGiftToDB(gift: Gift) {
  const client = await clientPromise
  const db = client.db()

  return db.collection(GIFTS_COLLECTION).insertOne(gift)
}

export async function findGiftById(giftId: string) {
  const client = await clientPromise
  const db = client.db()

  try {
    // Try to find by ObjectId first
    return await db.collection(GIFTS_COLLECTION).findOne({ _id: new ObjectId(giftId) })
  } catch (e) {
    // If not a valid ObjectId, try to find by string id
    return db.collection(GIFTS_COLLECTION).findOne({ id: giftId })
  }
}

export async function getAllGifts() {
  const client = await clientPromise
  const db = client.db()

  return db.collection(GIFTS_COLLECTION).find({}).toArray()
}

// Recommendation-related functions
export async function saveRecommendation(userId: string, surveyData: any, gifts: Gift[]) {
  const client = await clientPromise
  const db = client.db()

  const recommendation = {
    userId,
    surveyData,
    gifts,
    createdAt: new Date(),
  }

  return db.collection(RECOMMENDATIONS_COLLECTION).insertOne(recommendation)
}

export async function getUserRecommendations(userId: string) {
  const client = await clientPromise
  const db = client.db()

  return db.collection(RECOMMENDATIONS_COLLECTION).find({ userId }).sort({ createdAt: -1 }).toArray()
}

export async function getAllRecommendations() {
  const client = await clientPromise
  const db = client.db()

  return db.collection(RECOMMENDATIONS_COLLECTION).find({}).sort({ createdAt: -1 }).toArray()
}

export async function getRecommendationStats() {
  const client = await clientPromise
  const db = client.db()

  const totalCount = await db.collection(RECOMMENDATIONS_COLLECTION).countDocuments()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayCount = await db.collection(RECOMMENDATIONS_COLLECTION).countDocuments({
    createdAt: { $gte: today },
  })

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthlyCount = await db.collection(RECOMMENDATIONS_COLLECTION).countDocuments({
    createdAt: { $gte: thisMonth },
  })

  return {
    total: totalCount,
    today: todayCount,
    monthly: monthlyCount,
  }
}
