export interface LeadershipProfile {
  id: string;
  name: string;
  tag: string;
  userId: string;
  role: string;
  avatar: string;
  banner?: string;
  profileLink: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  bio: string;
  badges: string[];
  joinedDate?: string;
}

export interface LeadershipData {
  owner: LeadershipProfile;
  coOwners: LeadershipProfile[];
  developers?: LeadershipProfile[];
}

export interface GuildInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  splash?: string | null;
  features: string[];
  verificationLevel: number;
  vanityUrlCode: string;
}

export interface DiscordServerData {
  success: boolean;
  inviteCode: string;
  guild: GuildInfo;
  approximateMemberCount: number;
  approximatePresenceCount: number;
  premiumSubscriptionCount?: number;
  premiumTier?: number;
  expiresAt?: string | null;
  fetchedAt: string;
  isFallback?: boolean;
  integrationMode?: 'discord_bot_api' | 'discord_bot_gateway' | 'discord_invite_api' | 'discord_incoming_webhook' | 'discord_webhook_connected' | 'direct_cors_invite';
  lastWebhookSender?: string;
  botTag?: string | null;
  botAvatar?: string | null;
  voiceMembersCount?: number;
  lastEvent?: string | null;
}

export interface AiLiveInsights {
  success: boolean;
  hasApiKey: boolean;
  statusMessage: string;
  communityVibe: string;
  activityLevel: string;
  aiForecast: string;
  voiceRecommendation: string;
  summary: string;
  source: string;
  model: string;
  message?: string;
  generatedAt: string;
}

export interface VoiceRoom {
  id: string;
  name: string;
  type: 'voice' | 'gaming' | 'music' | 'stage';
  activeUsers: number;
  limit: number;
  currentSpeakers?: string[];
  currentTrack?: string;
  moderators?: string[];
  topic?: string;
}

export interface TrendingGame {
  game: string;
  players: number;
  icon: string;
}

export interface ActivityData {
  activeRooms: VoiceRoom[];
  gamesTrending: TrendingGame[];
  serverBoostLevel: number;
  boostCount: number;
  totalVoiceUsers: number;
  onlineMembers: number;
  timestamp: string;
}
