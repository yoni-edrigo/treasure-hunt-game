// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teachers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
  }),

  games: defineTable({
    teacherId: v.id("teachers"),
    title: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    joinCode: v.string(),
    status: v.string(), // draft, published, archived
    categoryId: v.optional(v.id("categories")),
    privacySettings: v.object({
      isPublic: v.boolean(),
      allowJoinAfterStart: v.boolean(),
    }),
    displaySettings: v.object({
      primaryColor: v.optional(v.string()),
      coverImage: v.optional(v.string()),
    }),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    estimatedDuration: v.number(),
    playerCountMin: v.optional(v.number()),
    playerCountMax: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_joinCode", ["joinCode"]),

  categories: defineTable({
    name: v.string(),
    description: v.string(),
    displayOrder: v.number(),
    createdAt: v.number(),
  }),

  gameMedia: defineTable({
    gameId: v.id("games"),
    type: v.string(), // cover, gallery, etc.
    url: v.string(),
    altText: v.optional(v.string()),
    displayOrder: v.number(),
    createdAt: v.number(),
  }).index("by_gameId", ["gameId"]),

  locations: defineTable({
    gameId: v.id("games"),
    name: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    sequenceOrder: v.number(),
    radiusMeters: v.number(),
    settings: v.object({
      requireSequential: v.boolean(),
      hints: v.optional(v.array(v.string())),
    }),
  }).index("by_gameId", ["gameId"]),

  challenges: defineTable({
    locationId: v.id("locations"),
    typeId: v.id("challengeTypes"),
    title: v.string(),
    content: v.object({
      // Dynamic based on challenge type
      question: v.optional(v.string()),
      options: v.optional(v.array(v.string())),
      correctOption: v.optional(v.number()),
      targetWord: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      // ... other type-specific fields
    }),
    completionRules: v.object({
      timeLimit: v.optional(v.number()),
      points: v.number(),
      requiredAccuracy: v.optional(v.number()),
    }),
    prerequisites: v.optional(v.array(v.id("challenges"))),
    createdAt: v.number(),
  }).index("by_locationId", ["locationId"]),

  challengeTypes: defineTable({
    name: v.string(),
    description: v.string(),
    validationRules: v.any(), // JSON for validation
    uiSchema: v.any(), // JSON for UI rendering
    defaultSettings: v.any(), // JSON default settings
    isActive: v.boolean(),
  }),

  teams: defineTable({
    name: v.string(),
    maxPlayers: v.number(),
    createdAt: v.number(),
  }),

  players: defineTable({
    nickname: v.string(),
    websocketSession: v.optional(v.string()),
    lastActive: v.number(),
    joinedAt: v.number(),
  }),

  sessions: defineTable({
    gameId: v.id("games"),
    teamId: v.optional(v.id("teams")),
    status: v.string(), // active, paused, completed
    startTime: v.number(),
    endTime: v.optional(v.number()),
    score: v.number(),
    metadata: v.any(), // JSON for flexible state
  })
    .index("by_gameId", ["gameId"])
    .index("by_teamId", ["teamId"]),

  sessionStates: defineTable({
    sessionId: v.id("sessions"),
    currentLocationId: v.optional(v.id("locations")),
    currentChallengeId: v.optional(v.id("challenges")),
    progressState: v.any(), // JSON for progress tracking
    updatedAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  submissions: defineTable({
    sessionId: v.id("sessions"),
    challengeId: v.id("challenges"),
    typeId: v.id("challengeTypes"),
    answer: v.any(), // JSON for flexible answers
    isCorrect: v.boolean(),
    pointsEarned: v.number(),
    metadata: v.any(), // JSON for submission details
    submittedAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_challengeId", ["challengeId"]),

  hints: defineTable({
    challengeId: v.id("challenges"),
    content: v.string(),
    pointsPenalty: v.number(),
    unlockDelayMinutes: v.number(),
  }).index("by_challengeId", ["challengeId"]),

  chatMessages: defineTable({
    sessionId: v.id("sessions"),
    playerId: v.id("players"),
    content: v.string(),
    type: v.string(), // text, system, etc.
    sentAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),
});
