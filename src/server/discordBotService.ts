import { Client, GatewayIntentBits, Events, Guild } from 'discord.js';

export interface DiscordBotStats {
  connected: boolean;
  botTag: string | null;
  botAvatar: string | null;
  guildId: string;
  guildName: string | null;
  memberCount: number;
  onlineCount: number;
  boostCount: number;
  boostTier: number;
  voiceMembersCount: number;
  activeVoiceChannels: Array<{ id: string; name: string; memberCount: number }>;
  lastEvent: string | null;
  lastEventTime: string | null;
  error: string | null;
}

let botClient: Client | null = null;
let currentStats: DiscordBotStats = {
  connected: false,
  botTag: null,
  botAvatar: null,
  guildId: "1425792165484691539",
  guildName: "|| 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || Gaming • Chilling • VCs • Fun •",
  memberCount: 3323,
  onlineCount: 98,
  boostCount: 26,
  boostTier: 3,
  voiceMembersCount: 14,
  activeVoiceChannels: [],
  lastEvent: "Initialized",
  lastEventTime: new Date().toISOString(),
  error: null
};

// Event emitter callback to notify server.ts when stats update
type StatsUpdateListener = (stats: DiscordBotStats) => void;
const listeners: StatsUpdateListener[] = [];

export function onBotStatsUpdate(listener: StatsUpdateListener) {
  listeners.push(listener);
}

function notifyListeners() {
  for (const listener of listeners) {
    try {
      listener({ ...currentStats });
    } catch (e) {
      console.error("[Discord Bot] Listener error:", e);
    }
  }
}

export function isValidDiscordBotToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const clean = token.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return false;
  return clean.length >= 50 && clean.includes('.');
}

/**
 * Initializes and connects Discord Bot with automatic intent fallback
 */
export async function startDiscordBot(token?: string): Promise<{ success: boolean; message: string; stats: DiscordBotStats }> {
  const botToken = token || process.env.DISCORD_BOT_TOKEN;

  if (!botToken || botToken.trim() === '') {
    currentStats.connected = false;
    currentStats.error = "No bot token provided in DISCORD_BOT_TOKEN";
    return { success: false, message: "No bot token provided", stats: currentStats };
  }

  const cleanToken = botToken.trim();

  if (!isValidDiscordBotToken(cleanToken)) {
    currentStats.connected = false;
    currentStats.error = "Invalid bot token format (Webhook URLs cannot be used as Bot Tokens)";
    return { success: false, message: "Invalid bot token format", stats: currentStats };
  }

  // Destroy previous client if running
  if (botClient) {
    try {
      botClient.destroy();
    } catch (e) {
      // ignore
    }
    botClient = null;
  }

  // Attempt login first with full intents, then fallback to basic intents if privileged intents are disabled
  try {
    const success = await attemptClientLogin(cleanToken, true);
    if (success) {
      return { success: true, message: "Discord Bot connected with full Gateway intents!", stats: currentStats };
    }
  } catch (err: any) {
    if (err?.message?.includes('An invalid token was provided') || err?.message?.includes('TOKEN_INVALID')) {
      currentStats.connected = false;
      currentStats.error = "Invalid Discord bot token provided";
      return { success: false, message: "Invalid Discord bot token provided", stats: currentStats };
    }
    console.warn("[Discord Bot] Full intents unavailable, attempting standard intents:", err?.message);
    try {
      const fallbackSuccess = await attemptClientLogin(cleanToken, false);
      if (fallbackSuccess) {
        return { success: true, message: "Discord Bot connected with standard intents!", stats: currentStats };
      }
    } catch (fallbackErr: any) {
      currentStats.connected = false;
      currentStats.error = fallbackErr.message || "Failed to connect bot";
      return { success: false, message: fallbackErr.message || "Bot login failed", stats: currentStats };
    }
  }

  return { success: currentStats.connected, message: currentStats.connected ? "Connected" : "Failed", stats: currentStats };
}

function attemptClientLogin(token: string, usePrivilegedIntents: boolean): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const intents = usePrivilegedIntents
      ? [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildMessages
        ]
      : [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildMessages
        ];

    const client = new Client({ intents });
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error("Discord Gateway connection timeout (12s)"));
      }
    }, 12000);

    client.once(Events.ClientReady, async (readyClient) => {
      clearTimeout(timeout);
      resolved = true;
      botClient = client;

      currentStats.connected = true;
      currentStats.botTag = readyClient.user.tag;
      currentStats.botAvatar = readyClient.user.displayAvatarURL({ size: 256 });
      currentStats.error = null;

      console.log(`[Discord Bot] 🤖 Successfully logged in as ${readyClient.user.tag}!`);

      // Set bot status
      try {
        readyClient.user.setActivity("3,323+ members on Dostana Website", { type: 3 }); // Watching
      } catch (e) {
        // ignore
      }

      // Initial guild sync
      await syncGuildStats(client);
      notifyListeners();
      resolve(true);
    });

    client.on(Events.Error, (err) => {
      console.error("[Discord Bot] Client error:", err);
      currentStats.error = err.message;
    });

    // Real-Time Event Handlers:
    // 1. Member Joins
    client.on(Events.GuildMemberAdd, (member) => {
      if (member.guild.id === currentStats.guildId) {
        currentStats.memberCount = member.guild.memberCount;
        currentStats.lastEvent = `🎉 ${member.user.username} joined the server`;
        currentStats.lastEventTime = new Date().toISOString();
        console.log(`[Discord Bot] Real-Time Member Joined: ${member.user.tag}. Total: ${currentStats.memberCount}`);
        notifyListeners();
      }
    });

    // 2. Member Leaves
    client.on(Events.GuildMemberRemove, (member) => {
      if (member.guild.id === currentStats.guildId) {
        currentStats.memberCount = Math.max(0, member.guild.memberCount);
        currentStats.lastEvent = `👋 ${member.user.username} left the server`;
        currentStats.lastEventTime = new Date().toISOString();
        console.log(`[Discord Bot] Member Left: ${member.user.tag}. Total: ${currentStats.memberCount}`);
        notifyListeners();
      }
    });

    // 3. Presence Updates (Online/Idle/DND)
    client.on(Events.PresenceUpdate, async (_oldPresence, newPresence) => {
      if (newPresence.guild && newPresence.guild.id === currentStats.guildId) {
        syncOnlineCount(newPresence.guild);
      }
    });

    // 4. Voice States (VC joined/left/switched)
    client.on(Events.VoiceStateUpdate, (oldState, newState) => {
      const guild = newState.guild || oldState.guild;
      if (guild && guild.id === currentStats.guildId) {
        syncVoiceStats(guild);
      }
    });

    client.login(token).catch((err) => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });
  });
}

async function syncGuildStats(client: Client) {
  try {
    const guild = await client.guilds.fetch(currentStats.guildId).catch(() => null);
    if (!guild) {
      console.warn(`[Discord Bot] Bot is not in guild ID: ${currentStats.guildId}`);
      return;
    }

    currentStats.guildName = guild.name;
    currentStats.memberCount = guild.memberCount || currentStats.memberCount;
    currentStats.boostCount = guild.premiumSubscriptionCount ?? 26;
    currentStats.boostTier = guild.premiumTier ?? 3;

    // Approximate presence from guild if available
    if (typeof (guild as any).approximatePresenceCount === 'number') {
      currentStats.onlineCount = (guild as any).approximatePresenceCount;
    }

    syncVoiceStats(guild);
    syncOnlineCount(guild);
  } catch (err) {
    console.error("[Discord Bot] Error syncing guild stats:", err);
  }
}

function syncVoiceStats(guild: Guild) {
  try {
    const voiceChannels: Array<{ id: string; name: string; memberCount: number }> = [];
    let totalVoiceUsers = 0;

    guild.channels.cache.forEach((channel) => {
      if (channel.isVoiceBased()) {
        const count = channel.members?.size || 0;
        if (count > 0) {
          voiceChannels.push({ id: channel.id, name: channel.name, memberCount: count });
          totalVoiceUsers += count;
        }
      }
    });

    currentStats.voiceMembersCount = Math.max(totalVoiceUsers, currentStats.voiceMembersCount);
    currentStats.activeVoiceChannels = voiceChannels;
    notifyListeners();
  } catch (e) {
    // ignore
  }
}

function syncOnlineCount(guild: Guild) {
  try {
    if (guild.presences?.cache) {
      const count = guild.presences.cache.filter(p => p.status !== 'offline').size;
      if (count > 0) {
        currentStats.onlineCount = count;
        notifyListeners();
      }
    }
  } catch (e) {
    // ignore
  }
}

export function getBotStats(): DiscordBotStats {
  return { ...currentStats };
}
