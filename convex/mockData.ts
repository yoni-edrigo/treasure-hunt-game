import { mutation } from "./_generated/server";

export const generateJerusalemGameMockData = mutation({
  handler: async (ctx) => {
    // Create a teacher
    const teacherId = await ctx.db.insert("teachers", {
      email: "teacher@example.com",
      passwordHash: "hashed_password_here",
      createdAt: Date.now(),
    });

    // Create category
    const historicalCategoryId = await ctx.db.insert("categories", {
      name: "Historical Sites",
      description: "Explore the rich history of Jerusalem",
      displayOrder: 1,
      createdAt: Date.now(),
    });

    // Create game
    const gameId = await ctx.db.insert("games", {
      teacherId,
      title: "Old City Jerusalem Adventure",
      description:
        "Explore the ancient wonders of Jerusalem's Old City in this educational treasure hunt.",
      shortDescription: "Historic treasure hunt in Jerusalem's Old City",
      joinCode: "JLMOLD",
      status: "published",
      categoryId: historicalCategoryId,
      privacySettings: {
        isPublic: true,
        allowJoinAfterStart: true,
      },
      displaySettings: {
        primaryColor: "#3b82f6",
        coverImage: "/images/jerusalem-old-city.jpg",
      },
      startTime: Date.now(),
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
      estimatedDuration: 120,
      playerCountMin: 1,
      playerCountMax: 10,
      createdAt: Date.now(),
    });

    // Create challenge types
    const multipleChoiceTypeId = await ctx.db.insert("challengeTypes", {
      name: "Multiple Choice",
      description: "Answer a question by selecting from options",
      validationRules: { type: "multipleChoice" },
      uiSchema: { component: "MultipleChoiceChallenge" },
      defaultSettings: { timeLimit: 60, points: 100 },
      isActive: true,
    });

    const photoTypeId = await ctx.db.insert("challengeTypes", {
      name: "Photo Task",
      description: "Take a photo of a specific object or landmark",
      validationRules: { type: "photo" },
      uiSchema: { component: "PhotoChallenge" },
      defaultSettings: { points: 150 },
      isActive: true,
    });

    const wordGameTypeId = await ctx.db.insert("challengeTypes", {
      name: "Word Game",
      description: "Solve a word puzzle or anagram",
      validationRules: { type: "wordGame" },
      uiSchema: { component: "WordGameChallenge" },
      defaultSettings: { timeLimit: 120, points: 200 },
      isActive: true,
    });

    // Location data
    const locations = [
      {
        name: "Western Wall",
        latitude: 31.7767,
        longitude: 35.2345,
        sequenceOrder: 1,
        radiusMeters: 50,
        settings: {
          requireSequential: true,
          hints: ["Look for the large prayer plaza", "Near the Temple Mount"],
        },
      },
      {
        name: "Church of the Holy Sepulchre",
        latitude: 31.7784,
        longitude: 35.2297,
        sequenceOrder: 2,
        radiusMeters: 30,
        settings: {
          requireSequential: true,
          hints: ["In the Christian Quarter", "Look for the large dome"],
        },
      },
      {
        name: "Mahane Yehuda Market",
        latitude: 31.7857,
        longitude: 35.212,
        sequenceOrder: 3,
        radiusMeters: 100,
        settings: {
          requireSequential: false,
          hints: [
            "Follow the smell of fresh bread and spices",
            "The busiest market in Jerusalem",
          ],
        },
      },
    ];

    // Create locations and challenges
    for (const loc of locations) {
      const locationId = await ctx.db.insert("locations", {
        gameId,
        ...loc,
      });

      // Find location challenge
      const findChallengeId = await ctx.db.insert("challenges", {
        locationId,
        typeId:
          loc.name === "Church of the Holy Sepulchre"
            ? photoTypeId
            : wordGameTypeId,
        title: `Find ${loc.name}`,
        content: {
          question:
            loc.name === "Western Wall"
              ? "Unscramble the letters: STERWEN LALW"
              : loc.name === "Church of the Holy Sepulchre"
                ? "Find the main entrance to the Church"
                : "Solve this riddle: 'Where vendors call and flavors meet, Jerusalem's heart with things to eat'",
          targetWord:
            loc.name === "Western Wall" ? "WESTERN WALL" : "MAHANE YEHUDA",
          imageUrl:
            loc.name === "Church of the Holy Sepulchre"
              ? "/images/holy-sepulchre-entrance.jpg"
              : undefined,
        },
        completionRules: {
          timeLimit: 300,
          points: 150,
          requiredAccuracy: 100,
        },
        createdAt: Date.now(),
      });

      // At location challenge
      await ctx.db.insert("challenges", {
        locationId,
        typeId:
          loc.name === "Mahane Yehuda Market"
            ? photoTypeId
            : multipleChoiceTypeId,
        title: `${loc.name} Challenge`,
        content: {
          question:
            loc.name === "Western Wall"
              ? "What is the Western Wall a remnant of?"
              : loc.name === "Church of the Holy Sepulchre"
                ? "Count the number of lamps hanging above the Edicule. How many are there?"
                : "Find and photograph these three spices: Za'atar, Sumac, and Baharat",
          options:
            loc.name !== "Mahane Yehuda Market"
              ? loc.name === "Western Wall"
                ? [
                    "The First Temple",
                    "The Second Temple",
                    "The Church of the Holy Sepulchre",
                    "Herod's Palace",
                  ]
                : ["12", "13", "15", "17"]
              : undefined,
          correctOption: loc.name === "Western Wall" ? 1 : 1,
          imageUrl:
            loc.name === "Mahane Yehuda Market"
              ? "/images/spices.jpg"
              : undefined,
        },
        completionRules: {
          timeLimit: loc.name !== "Mahane Yehuda Market" ? 60 : undefined,
          points: loc.name === "Mahane Yehuda Market" ? 250 : 100,
        },
        createdAt: Date.now(),
      });

      // Add hint
      if (
        loc.name === "Western Wall" ||
        loc.name === "Church of the Holy Sepulchre"
      ) {
        await ctx.db.insert("hints", {
          challengeId: findChallengeId,
          content:
            loc.name === "Western Wall"
              ? "It's the holiest place where Jews are permitted to pray"
              : "It's in the Christian Quarter, follow the pilgrims",
          pointsPenalty: loc.name === "Western Wall" ? 30 : 20,
          unlockDelayMinutes: loc.name === "Western Wall" ? 5 : 3,
        });
      }
    }

    return { gameId };
  },
});
