// src/types.ts

import { Id } from "../convex/_generated/dataModel";

// Basic entity types
export type Teacher = {
  id: Id<"teachers">;
  email: string;
  passwordHash: string;
  createdAt: number;
};

export type Game = {
  id: Id<"games">;
  teacherId: Id<"teachers">;
  title: string;
  description: string;
  shortDescription: string;
  joinCode: string;
  status: GameStatus;
  categoryId?: Id<"categories">;
  privacySettings: PrivacySettings;
  displaySettings: DisplaySettings;
  startTime?: number;
  endTime?: number;
  estimatedDuration: number;
  playerCountMin?: number;
  playerCountMax?: number;
  createdAt: number;
};

export type Category = {
  id: Id<"categories">;
  name: string;
  description: string;
  displayOrder: number;
  createdAt: number;
};

export type GameMedia = {
  id: Id<"gameMedia">;
  gameId: Id<"games">;
  type: MediaType;
  url: string;
  altText?: string;
  displayOrder: number;
  createdAt: number;
};

export type Location = {
  id: Id<"locations">;
  gameId: Id<"games">;
  name: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
  radiusMeters: number;
  settings: LocationSettings;
};

export type Challenge = {
  id: Id<"challenges">;
  locationId: Id<"locations">;
  typeId: Id<"challengeTypes">;
  title: string;
  content: ChallengeContent;
  completionRules: CompletionRules;
  prerequisites?: Id<"challenges">[];
  createdAt: number;
};

export type ChallengeType = {
  id: Id<"challengeTypes">;
  name: string;
  description: string;
  validationRules: any;
  uiSchema: any;
  defaultSettings: any;
  isActive: boolean;
};

export type Team = {
  id: Id<"teams">;
  name: string;
  maxPlayers: number;
  createdAt: number;
};

export type Player = {
  id: Id<"players">;
  nickname: string;
  websocketSession?: string;
  lastActive: number;
  joinedAt: number;
};

export type Session = {
  id: Id<"sessions">;
  gameId: Id<"games">;
  teamId?: Id<"teams">;
  status: SessionStatus;
  startTime: number;
  endTime?: number;
  score: number;
  metadata: any;
};

export type SessionState = {
  id: Id<"sessionStates">;
  sessionId: Id<"sessions">;
  currentLocationId?: Id<"locations">;
  currentChallengeId?: Id<"challenges">;
  progressState: any;
  updatedAt: number;
};

export type Submission = {
  id: Id<"submissions">;
  sessionId: Id<"sessions">;
  challengeId: Id<"challenges">;
  typeId: Id<"challengeTypes">;
  answer: any;
  isCorrect: boolean;
  pointsEarned: number;
  metadata: any;
  submittedAt: number;
};

export type Hint = {
  id: Id<"hints">;
  challengeId: Id<"challenges">;
  content: string;
  pointsPenalty: number;
  unlockDelayMinutes: number;
};

export type ChatMessage = {
  id: Id<"chatMessages">;
  sessionId: Id<"sessions">;
  playerId: Id<"players">;
  content: string;
  type: MessageType;
  sentAt: number;
};

// Specific content types
export type ChallengeContent = {
  question?: string;
  options?: string[];
  correctOption?: number;
  targetWord?: string;
  imageUrl?: string;
  [key: string]: any;
};

export type CompletionRules = {
  timeLimit?: number;
  points: number;
  requiredAccuracy?: number;
};

export type LocationSettings = {
  requireSequential: boolean;
  hints?: string[];
};

export type PrivacySettings = {
  isPublic: boolean;
  allowJoinAfterStart: boolean;
};

export type DisplaySettings = {
  primaryColor?: string;
  coverImage?: string;
};

// Enums
export type GameStatus = "draft" | "published" | "archived";
export type SessionStatus = "active" | "paused" | "completed";
export type MediaType = "cover" | "gallery" | "tutorial";
export type MessageType = "text" | "system" | "join" | "leave";

// Challenge type specific types
export type MultipleChoiceChallenge = Challenge & {
  content: {
    question: string;
    options: string[];
    correctOption: number;
  };
};

export type PhotoChallenge = Challenge & {
  content: {
    question: string;
    imageUrl?: string;
  };
};

export type WordGameChallenge = Challenge & {
  content: {
    question: string;
    targetWord: string;
  };
};

// Helper types
export type LatLng = {
  lat: number;
  lng: number;
};

export type GameWithDetails = Game & {
  category?: Category;
  locations?: Location[];
  media?: GameMedia[];
};

export type LocationWithChallenges = Location & {
  challenges: Challenge[];
};

// Type guards
export function isMultipleChoiceChallenge(
  challenge: Challenge
): challenge is MultipleChoiceChallenge {
  return (
    challenge.content.options !== undefined &&
    challenge.content.correctOption !== undefined
  );
}

export function isPhotoChallenge(
  challenge: Challenge
): challenge is PhotoChallenge {
  return (
    challenge.content.imageUrl !== undefined &&
    !isMultipleChoiceChallenge(challenge)
  );
}

export function isWordGameChallenge(
  challenge: Challenge
): challenge is WordGameChallenge {
  return challenge.content.targetWord !== undefined;
}
