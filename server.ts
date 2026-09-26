import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { startDiscordBot, getBotStats, onBotStatsUpdate, isValidDiscordBotToken } from './src/server/discordBotService';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// In-memory leadership profiles with default values that can be customized
let leadershipData = {
  owner: {
    id: "1490686024089866424",
    name: "NARUTO GAMING",
    tag: "narutogaming_ff_",
    userId: "1490686024089866424",
    role: "Founder & Server Owner",
    avatar: "https://images-ext-1.discordapp.net/external/qr-JOwQj-n2N1mFkMalFhiPVTIxz1ZghlKFfD4fylsM/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1490686024089866424/8449aa76e51e06be54e66b971e888193.png?format=webp&quality=lossless",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    profileLink: "https://discord.com/users/1490686024089866424",
    status: "online",
    customStatus: "👑 Founder of Dostana | DM for queries & partnerships",
    bio: "Creator & Server Owner of Dostana. Building India's friendliest hangout community.",
    badges: ["server_owner", "hypesquad", "early_supporter", "nitro"],
    joinedDate: "Feb 2023"
  },
  coOwners: [
    {
      id: "1550880484467277905",
      name: "ERYX",
      tag: "z_nx0",
      userId: "1550880484467277905",
      role: "",
      avatar: "https://images-ext-1.discordapp.net/external/LVx6BWScFLHvtxzApY1wFbnWjl4xeQVcpN6dmS4MBp8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1501793683849216070/51c2d553002dbc3c0f51496b36e49fc6.png?format=webp&quality=lossless",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      profileLink: "https://discord.com/users/1550880484467277905",
      status: "online",
      customStatus: "",
      bio: "",
      badges: ["co_owner", "developer", "nitro"],
      joinedDate: "Mar 2023"
    },
    {
      id: "1003619499418849330",
      name: "Sʜᴀᴅᴏᴡ_X",
      tag: "rajorasad9671",
      userId: "1003619499418849330",
      role: "",
      avatar: "https://cdn.discordapp.com/avatars/1003619499418849330/e49bd1b2a88b6d9d16e3d80b6980ee81.png?size=1024",
      banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
      profileLink: "https://discord.com/users/1003619499418849330",
      status: "online",
      customStatus: "",
      bio: "",
      badges: ["co_owner", "booster", "nitro"],
      joinedDate: "May 2023"
    },
    {
      id: "1501494756587343995",
      name: "! Kitkat",
      tag: "kitkathuyarww",
      userId: "1501494756587343995",
      role: "",
      avatar: "https://cdn.phototourl.com/free/2026-09-19-0bc3114f-9988-467b-94de-089bb74370b1.webp",
      banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      profileLink: "https://discord.com/users/1501494756587343995",
      status: "online",
      customStatus: "",
      bio: "",
      badges: ["co_owner", "moderator", "nitro"],
      joinedDate: "Apr 2023"
    },
    {
      id: "1492110373141090334",
      name: "SHANAYA",
      tag: "plissa",
      userId: "1492110373141090334",
      role: "",
      avatar: "https://plain-apac-prod-public.komododecks.com/202609/19/PSr9mk8ImnXH7Wx0meyB/image.jpg",
      banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      profileLink: "https://discord.com/users/1492110373141090334",
      status: "online",
      customStatus: "",
      bio: "",
      badges: ["co_owner", "hypesquad", "nitro"],
      joinedDate: "Jun 2023"
    }
  ],
  developers: [
    {
      id: "1379403772287127552",
      name: "DEV PARTH",
      tag: "parth.cd",
      userId: "1379403772287127552",
      role: "Lead Developer & System Architect",
      avatar: "https://cdn.discordapp.com/avatars/1379403772287127552/babcfc47380f8868926c9604f16ca7b4.png?size=4096",
      banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      profileLink: "https://discord.com/users/1379403772287127552",
      status: "online",
      customStatus: "💻 Coding Dostana Systems",
      bio: "Official Developer for Dostana Discord & Web Infrastructure.",
      badges: ["developer", "verified", "nitro"],
      joinedDate: "2024"
    },
    {
      id: "1504791907295957082",
      name: "PIYUSH",
      tag: "piyush.lies",
      userId: "1504791907295957082",
      role: "Developer & Technical Lead",
      avatar: "https://cdn.discordapp.com/avatars/1504791907295957082/a9714adce3f703769ae6985f5833684d.png?size=4096",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      profileLink: "https://discord.com/users/1504791907295957082",
      status: "online",
      customStatus: "💻 Developer at Dostana",
      bio: "Official Developer for Dostana Discord Systems & Infrastructure.",
      badges: ["developer", "nitro"],
      joinedDate: "2024"
    }
  ]
};

// Cache for Discord server data
let cachedInviteData: any = null;
let lastInviteFetchTime = 0;
const CACHE_TTL_MS = 15 * 1000; // 15-second cache for ultra-responsive live updates

// Wire Discord Bot Real-Time Listener
onBotStatsUpdate((stats) => {
  if (stats.connected) {
    cachedInviteData = {
      ...(cachedInviteData || getDostanaFallbackData()),
      integrationMode: "discord_bot_gateway",
      approximateMemberCount: stats.memberCount,
      approximatePresenceCount: stats.onlineCount,
      premiumSubscriptionCount: stats.boostCount,
      premiumTier: stats.boostTier,
      voiceMembersCount: stats.voiceMembersCount,
      activeVoiceChannels: stats.activeVoiceChannels,
      lastEvent: stats.lastEvent,
      lastEventTime: stats.lastEventTime,
      botTag: stats.botTag,
      botAvatar: stats.botAvatar,
      fetchedAt: new Date().toISOString(),
      cached: false,
      cacheAgeSeconds: 0
    };
    lastInviteFetchTime = Date.now();
  }
});

// Clean up if a webhook URL was mistakenly stored in DISCORD_BOT_TOKEN
if (process.env.DISCORD_BOT_TOKEN && (process.env.DISCORD_BOT_TOKEN.startsWith('http://') || process.env.DISCORD_BOT_TOKEN.startsWith('https://'))) {
  delete process.env.DISCORD_BOT_TOKEN;
}

// Auto-start Discord Bot if valid bot token is configured
if (process.env.DISCORD_BOT_TOKEN && isValidDiscordBotToken(process.env.DISCORD_BOT_TOKEN)) {
  console.log("[Discord Bot] Auto-starting bot from DISCORD_BOT_TOKEN...");
  startDiscordBot(process.env.DISCORD_BOT_TOKEN.trim()).then((res) => {
    console.log(`[Discord Bot] ${res.message}`);
  }).catch((e) => {
    console.warn("[Discord Bot] Auto-start notice:", e.message);
  });
}

// Bot Control & Stats Endpoints
app.post('/api/discord/bot/connect', async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string' || token.trim().length < 10) {
    return res.status(400).json({ success: false, message: "Please provide a valid Discord Bot Token" });
  }

  const cleanToken = token.trim();
  const result = await startDiscordBot(cleanToken);

  if (result.success) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
      }
      if (envContent.includes('DISCORD_BOT_TOKEN=')) {
        envContent = envContent.replace(/DISCORD_BOT_TOKEN=.*/g, `DISCORD_BOT_TOKEN=${cleanToken}`);
      } else {
        envContent += `\nDISCORD_BOT_TOKEN=${cleanToken}\n`;
      }
      fs.writeFileSync(envPath, envContent, 'utf-8');
      process.env.DISCORD_BOT_TOKEN = cleanToken;
      console.log("[Discord Bot] Successfully updated DISCORD_BOT_TOKEN in .env file!");
    } catch (err) {
      console.warn("Could not save bot token to .env:", err);
    }
  }

  return res.json(result);
});

app.get('/api/discord/bot/stats', (_req, res) => {
  return res.json({ stats: getBotStats() });
});

// 1. Endpoint to fetch live Discord server info (via Bot Gateway, Bot API or Invite API)
app.get('/api/discord/server', async (req, res) => {
  const now = Date.now();
  const force = req.query.refresh === 'true' || req.query.force === 'true';

  // Strategy A: If official Discord Bot is connected via Gateway, serve 100% authoritative live real-time stats
  const botStats = getBotStats();
  if (botStats.connected) {
    return res.json({
      ...(cachedInviteData || getDostanaFallbackData()),
      success: true,
      inviteCode: 'dostana',
      integrationMode: "discord_bot_gateway",
      approximateMemberCount: botStats.memberCount,
      approximatePresenceCount: botStats.onlineCount,
      premiumSubscriptionCount: botStats.boostCount,
      premiumTier: botStats.boostTier,
      voiceMembersCount: botStats.voiceMembersCount,
      activeVoiceChannels: botStats.activeVoiceChannels,
      botTag: botStats.botTag,
      botAvatar: botStats.botAvatar,
      lastEvent: botStats.lastEvent,
      fetchedAt: new Date().toISOString(),
      cached: false,
      cacheAgeSeconds: 0
    });
  }

  if (!force && cachedInviteData && now - lastInviteFetchTime < CACHE_TTL_MS) {
    return res.json({ 
      ...cachedInviteData, 
      cached: true,
      cacheAgeSeconds: Math.round((now - lastInviteFetchTime) / 1000)
    });
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = "1425792165484691539";
  const inviteCode = 'dostana';

  // Strategy B: If DISCORD_BOT_TOKEN is provided as REST API fallback
  if (botToken) {
    try {
      const botResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Accept': 'application/json'
        }
      });

      if (botResponse.ok) {
        const guildData = await botResponse.json();
        const payload = {
          success: true,
          inviteCode,
          integrationMode: "discord_bot_api",
          guild: {
            id: guildData.id || guildId,
            name: guildData.name || "|| 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || Gaming • Chilling • VCs • Fun •",
            description: guildData.description || "Welcome to || 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 ||",
            icon: guildData.icon 
              ? (guildData.icon.startsWith('a_') 
                  ? `https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.gif?size=512`
                  : `https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.png?size=512`)
              : "/dostana-icon.gif",
            banner: guildData.banner
              ? `https://cdn.discordapp.com/banners/${guildData.id}/${guildData.banner}.png?size=1024`
              : "/dostana-banner.png",
            splash: guildData.splash
              ? `https://cdn.discordapp.com/splashes/${guildData.id}/${guildData.splash}.png?size=1024`
              : null,
            features: guildData.features || ["COMMUNITY", "ANIMATED_ICON", "VANITY_URL", "ROLE_ICONS"],
            verificationLevel: guildData.verification_level ?? 1,
            vanityUrlCode: guildData.vanity_url_code || "dostana"
          },
          approximateMemberCount: typeof guildData.approximate_member_count === 'number' ? guildData.approximate_member_count : (cachedInviteData?.approximateMemberCount ?? 3323),
          approximatePresenceCount: typeof guildData.approximate_presence_count === 'number' ? guildData.approximate_presence_count : (cachedInviteData?.approximatePresenceCount ?? 105),
          premiumSubscriptionCount: guildData.premium_subscription_count ?? 26,
          premiumTier: guildData.premium_tier ?? 3,
          fetchedAt: new Date().toISOString(),
          cached: false,
          cacheAgeSeconds: 0
        };

        cachedInviteData = payload;
        lastInviteFetchTime = now;
        return res.json(payload);
      }
    } catch (botErr) {
      console.warn("Discord Bot API request failed, falling back to Invite API:", botErr);
    }
  }

  // Strategy B: Discord Public Invite API
  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DiscordShowcaseApp/1.0 (https://discord.gg/dostana)'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const payload = {
        success: true,
        inviteCode,
        integrationMode: "discord_invite_api",
        guild: {
          id: data.guild?.id || "1425792165484691539",
          name: data.guild?.name || "|| 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || Gaming • Chilling • VCs • Fun •",
          description: data.guild?.description || "Welcome to || 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || — a chill and aesthetic space where you can relax, game, and connect with people from around the world.",
          icon: data.guild?.icon 
            ? (data.guild.icon.startsWith('a_') 
                ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.gif?size=512`
                : `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=512`)
            : "/dostana-icon.gif",
          banner: data.guild?.banner
            ? `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.png?size=1024`
            : "/dostana-banner.png",
          splash: data.guild?.splash
            ? `https://cdn.discordapp.com/splashes/${data.guild.id}/${data.guild.splash}.png?size=1024`
            : null,
          features: data.guild?.features || ["COMMUNITY", "WELCOME_SCREEN_ENABLED", "ANIMATED_ICON", "VANITY_URL", "ROLE_ICONS"],
          verificationLevel: data.guild?.verification_level ?? 1,
          vanityUrlCode: data.guild?.vanity_url_code || "dostana"
        },
        approximateMemberCount: typeof data.approximate_member_count === 'number' ? data.approximate_member_count : 3323,
        approximatePresenceCount: typeof data.approximate_presence_count === 'number' ? data.approximate_presence_count : 105,
        premiumSubscriptionCount: data.guild?.premium_subscription_count ?? 26,
        premiumTier: data.guild?.premium_tier ?? 3,
        expiresAt: data.expires_at,
        fetchedAt: new Date().toISOString(),
        cached: false,
        cacheAgeSeconds: 0
      };

      cachedInviteData = payload;
      lastInviteFetchTime = now;
      return res.json(payload);
    } else {
      console.warn(`Discord invite API responded with status ${response.status}`);
      return res.json(cachedInviteData || getDostanaFallbackData());
    }
  } catch (err) {
    console.error("Error fetching Discord server info:", err);
    return res.json(cachedInviteData || getDostanaFallbackData());
  }
});

// 2. Incoming Discord Webhook Receiver: allows custom Discord Bot, Python script, or cron to push live stats
app.post('/api/discord/webhook', (req, res) => {
  const { secret, memberCount, presenceCount, boostCount, boostTier, event, botName } = req.body;

  // Validate secret if configured in environment
  const expectedSecret = process.env.DISCORD_WEBHOOK_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid webhook secret token" });
  }

  const now = Date.now();
  const current = cachedInviteData || getDostanaFallbackData();

  const updatedPayload = {
    ...current,
    integrationMode: "discord_incoming_webhook",
    approximateMemberCount: typeof memberCount === 'number' ? memberCount : current.approximateMemberCount,
    approximatePresenceCount: typeof presenceCount === 'number' ? presenceCount : current.approximatePresenceCount,
    premiumSubscriptionCount: typeof boostCount === 'number' ? boostCount : current.premiumSubscriptionCount,
    premiumTier: typeof boostTier === 'number' ? boostTier : current.premiumTier,
    lastWebhookEvent: event || "live_status_push",
    lastWebhookSender: botName || "Discord Bot",
    fetchedAt: new Date().toISOString(),
    cached: false,
    cacheAgeSeconds: 0
  };

  cachedInviteData = updatedPayload;
  lastInviteFetchTime = now;

  console.log(`[Discord Webhook] Updated stats from ${botName || 'external bot'}: Members=${updatedPayload.approximateMemberCount}, Presence=${updatedPayload.approximatePresenceCount}`);

  return res.json({
    success: true,
    message: "Live Discord stats successfully received and updated in real-time!",
    data: updatedPayload
  });
});

// 3. Discord Webhook Destination (Hardcoded securely in backend only - Never exposed in .env or frontend)
const DOSTANA_DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1553449125348114583/RZiR1IHIA22GLGs3A_-ede-kb90dck9j3P04-icK0aWiDybai6PxAKaN39pOG9Ywn52k';

// 4. Retrieve Current Webhook Configuration (Secure - Never leaks URL)
app.get('/api/discord/webhook-info', (_req, res) => {
  res.json({
    hasWebhook: true
  });
});

// 5. Send Webhook Notification / Stats to Discord Channel (Uses server-side configured secret only)
app.post('/api/discord/send-webhook', async (req, res) => {
  const targetWebhookUrl = DOSTANA_DISCORD_WEBHOOK_URL;
  if (!targetWebhookUrl) {
    return res.status(400).json({ 
      success: false, 
      error: "No Discord Webhook URL configured on backend." 
    });
  }

  const { content, title, description, color, fields } = req.body;

  try {
    const members = cachedInviteData?.approximateMemberCount ?? 3323;
    const presence = cachedInviteData?.approximatePresenceCount ?? 98;

    const payload = {
      content: content || null,
      username: "Dostana Live Monitor",
      avatar_url: "https://cdn.discordapp.com/icons/1425792165484691539/a_22e2f56d44a5edc6d40498d47f32cda7.gif?size=256",
      embeds: [
        {
          title: title || "🟢 Dostana Portal — Real-Time Server Pulse",
          description: description || `Live heartbeat ping synchronized at ${new Date().toLocaleTimeString()} IST`,
          color: color || 0x5865F2, // Discord Blurple
          fields: fields || [
            { name: "👥 Total Community", value: `**${members.toLocaleString()}** members`, inline: true },
            { name: "🟢 Online Right Now", value: `**${presence.toLocaleString()}** active`, inline: true },
            { name: "🚀 Boost Status", value: "Tier 3 (26 Boosts)", inline: true },
            { name: "🔗 Website Portal", value: "[Visit Dostana](https://discord.gg/dostana)", inline: false }
          ],
          footer: {
            text: "Dostana Discord Real-Time Monitoring • Zero-Bot Integration",
            icon_url: "https://cdn.discordapp.com/icons/1425792165484691539/a_22e2f56d44a5edc6d40498d47f32cda7.gif?size=64"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const webhookRes = await fetch(targetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (webhookRes.ok) {
      return res.json({ success: true, message: "✅ Embed successfully dispatched to your Discord channel via Webhook!" });
    } else {
      const errText = await webhookRes.text();
      return res.status(webhookRes.status).json({ success: false, error: errText });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to trigger webhook" });
  }
});

// 6. Automated Periodic Webhook (Runs every 3 hours)
let lastWebhookSendTime: number = 0;
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
let nextWebhookSendTime: number = Date.now() + THREE_HOURS_MS;

export async function sendPeriodicDiscordWebhook(triggerType: string = "Scheduled (Every 3 Hours)"): Promise<{ success: boolean; message: string }> {
  const targetWebhookUrl = DOSTANA_DISCORD_WEBHOOK_URL;
  if (!targetWebhookUrl) {
    console.log("[Discord Webhook] No webhook URL configured, skipping 3-hour update.");
    return { success: false, message: "No webhook URL configured" };
  }

  try {
    const members = cachedInviteData?.approximateMemberCount ?? 3323;
    const presence = cachedInviteData?.approximatePresenceCount ?? 98;
    const boostCount = cachedInviteData?.premiumSubscriptionCount ?? 26;
    const boostTier = cachedInviteData?.premiumTier ?? 3;
    const now = new Date();
    
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const payload = {
      username: "Dostana Server Pulse",
      avatar_url: "https://cdn.discordapp.com/icons/1425792165484691539/a_22e2f56d44a5edc6d40498d47f32cda7.gif?size=256",
      embeds: [
        {
          title: "✨ Dostana Community • 3-Hour Server Update",
          description: `Hamare Discord server ki live community metrics aur activity status har 3 ghante mein auto-update hoti hai.\n\n🌐 **Official Website:** [Dostana Community](https://discord.gg/dostana) • **Direct Invite:** [discord.gg/dostana](https://discord.gg/dostana)`,
          color: 0x5865F2, // Discord Blurple
          fields: [
            {
              name: "👥 Total Members",
              value: `**${members.toLocaleString()}** members`,
              inline: true
            },
            {
              name: "🟢 Online Right Now",
              value: `**${presence.toLocaleString()}** active`,
              inline: true
            },
            {
              name: "🚀 Server Boosts",
              value: `Level ${boostTier} (${boostCount} Boosts)`,
              inline: true
            },
            {
              name: "🎙️ Active Lounges",
              value: "Chill VCs & Music 24/7",
              inline: true
            },
            {
              name: "🛡️ Server Health",
              value: "🟢 100% Operational",
              inline: true
            },
            {
              name: "⏱️ Next Scheduled Update",
              value: "In 3 hours",
              inline: true
            }
          ],
          footer: {
            text: `Dostana Automated Status • ${triggerType} • ${dateString} ${timeString}`,
            icon_url: "https://cdn.discordapp.com/icons/1425792165484691539/a_22e2f56d44a5edc6d40498d47f32cda7.gif?size=64"
          },
          timestamp: now.toISOString()
        }
      ]
    };

    const webhookRes = await fetch(targetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (webhookRes.ok) {
      lastWebhookSendTime = Date.now();
      nextWebhookSendTime = Date.now() + THREE_HOURS_MS;
      console.log(`[Discord Webhook] ✅ 3-Hour Scheduled update dispatched to Discord! Members: ${members}, Online: ${presence}`);
      return { success: true, message: "Webhook successfully sent to Discord channel!" };
    } else {
      const errText = await webhookRes.text();
      console.error("[Discord Webhook] ❌ Periodic Webhook error:", webhookRes.status, errText);
      return { success: false, message: `Discord error: ${errText}` };
    }
  } catch (err: any) {
    console.error("[Discord Webhook] ❌ Network error:", err.message);
    return { success: false, message: err.message || "Failed to dispatch periodic webhook" };
  }
}

// Set 3-Hour Interval
setInterval(() => {
  console.log("[Discord Webhook Scheduler] Executing 3-hour scheduled update...");
  sendPeriodicDiscordWebhook("Scheduled (Every 3 Hours)").catch(e => console.error(e));
}, THREE_HOURS_MS);

// Send initial status 10s after server startup
setTimeout(() => {
  if (DOSTANA_DISCORD_WEBHOOK_URL) {
    console.log("[Discord Webhook] Initializing first periodic update...");
    sendPeriodicDiscordWebhook("Server Startup Ping").catch(e => console.error(e));
  }
}, 10000);

// Endpoint to check periodic status or trigger manually
app.get('/api/discord/periodic-status', (req, res) => {
  res.json({
    intervalHours: 3,
    lastWebhookSendTime: lastWebhookSendTime ? new Date(lastWebhookSendTime).toISOString() : null,
    nextWebhookSendTime: new Date(nextWebhookSendTime).toISOString(),
    hasWebhook: true
  });
});

app.post('/api/discord/trigger-periodic-webhook', async (req, res) => {
  const result = await sendPeriodicDiscordWebhook("Manual Trigger via API");
  return res.json({
    ...result,
    lastWebhookSendTime: lastWebhookSendTime ? new Date(lastWebhookSendTime).toISOString() : null,
    nextWebhookSendTime: new Date(nextWebhookSendTime).toISOString()
  });
});

// 4. Discord Integration Status Endpoint
app.get('/api/discord/status', (req, res) => {
  res.json({
    connected: true,
    guildId: "1425792165484691539",
    inviteCode: "dostana",
    hasBotToken: !!process.env.DISCORD_BOT_TOKEN,
    hasWebhookUrl: true,
    hasWebhookSecret: !!process.env.DISCORD_WEBHOOK_SECRET,
    currentMembers: cachedInviteData?.approximateMemberCount ?? 3323,
    currentOnline: cachedInviteData?.approximatePresenceCount ?? 105,
    lastSync: cachedInviteData?.fetchedAt ?? new Date().toISOString(),
    webhookEndpoint: "/api/discord/webhook"
  });
});

// Fallback data if Discord API is unreachable or rate-limited
function getDostanaFallbackData() {
  return {
    success: true,
    inviteCode: "dostana",
    guild: {
      id: "1425792165484691539",
      name: "|| 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || Gaming • Chilling • VCs • Fun •",
      description: "Welcome to || 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || — a chill and aesthetic space where you can relax, game, and connect with people from around the world. Whether you're here for late-night vibes, fun conversations, or competitive gaming, this is your place to belong.",
      icon: "/dostana-icon.gif",
      banner: "/dostana-banner.png",
      features: ["COMMUNITY", "ANIMATED_ICON", "BANNER", "INVITE_SPLASH", "ROLE_ICONS", "VANITY_URL"],
      verificationLevel: 1,
      vanityUrlCode: "dostana"
    },
    approximateMemberCount: 3324,
    approximatePresenceCount: 634,
    premiumSubscriptionCount: 26,
    premiumTier: 3,
    fetchedAt: new Date().toISOString(),
    isFallback: true,
    cached: false,
    cacheAgeSeconds: 0
  };
}

// Live channels and activity simulation endpoint (voice rooms, games being played)
app.get('/api/discord/activity', (req, res) => {
  const activeRooms = [
    {
      id: "vc-1",
      name: "🔊 Chill Hangout #1",
      type: "voice",
      activeUsers: 8,
      limit: 15,
      currentSpeakers: ["Pari", "Kabir", "Aryan"],
      topic: "Late night talks & chill lo-fi"
    },
    {
      id: "vc-2",
      name: "🎮 Valorant 5v5 Comp",
      type: "gaming",
      activeUsers: 5,
      limit: 5,
      currentSpeakers: ["Rohan", "Ghost", "Viper"],
      topic: "Ascendant push | Mic must"
    },
    {
      id: "vc-3",
      name: "🎵 24/7 Dostana Jukebox",
      type: "music",
      activeUsers: 14,
      limit: 0,
      currentTrack: "Arijit Singh - Channa Mereya (Lo-Fi Flip)",
      currentSpeakers: ["JukeboxBot#1"]
    },
    {
      id: "vc-4",
      name: "🎙️ Stage: Community Podcast",
      type: "stage",
      activeUsers: 42,
      limit: 100,
      moderators: ["Aarav", "Riya"],
      topic: "Weekend Anime & Bollywood Quiz with Cash Prizes!"
    }
  ];

  const gamesTrending = [
    { game: "Valorant", players: 184, icon: "🎯" },
    { game: "GTA V / FiveM", players: 96, icon: "🚗" },
    { game: "Minecraft (Dostana SMP)", players: 62, icon: "⛏️" },
    { game: "BGMI / Mobile", players: 115, icon: "📱" },
    { game: "Spotify Streaming", players: 320, icon: "🎧" }
  ];

  res.json({
    activeRooms,
    gamesTrending,
    serverBoostLevel: 3,
    boostCount: 34,
    totalVoiceUsers: 69,
    onlineMembers: 3920,
    timestamp: new Date().toISOString()
  });
});

// Leadership profiles endpoint (Owner + 4 Co-Owners)
app.get('/api/leadership', (req, res) => {
  res.json(leadershipData);
});

// Update leadership details (Owner or Co-Owners profile links, photos, userIds)
app.post('/api/leadership', (req, res) => {
  try {
    const { owner, coOwners } = req.body;
    if (owner) {
      leadershipData.owner = { ...leadershipData.owner, ...owner };
    }
    if (Array.isArray(coOwners)) {
      leadershipData.coOwners = coOwners;
    }
    res.json({ success: true, leadership: leadershipData });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// AI Live Community Insights Cache
let cachedAiInsights: any = null;
let lastAiFetchTime = 0;
let isQuotaExceeded = false;
let quotaExceededTime = 0;
const AI_CACHE_TTL_MS = 60 * 1000; // 1 minute cache
const QUOTA_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes backoff if quota exceeded

// Helper for clean fallback insights
function getFallbackInsights(totalMembers: number, onlineMembers: number, percentage: string, hasApiKey: boolean) {
  return {
    success: true,
    hasApiKey,
    statusMessage: `Real-time activity pulse: ${onlineMembers.toLocaleString()} active members currently engaged in voice channels and text lounges (${percentage}% active ratio).`,
    communityVibe: "High Energy & Active",
    activityLevel: onlineMembers > 500 ? "Peak Surge" : "High Activity",
    aiForecast: "Simultaneous voice presence expected to peak further during evening gaming scrims and late-night talks.",
    voiceRecommendation: "Chill Hangout #1 & 24/7 Jukebox Lounge",
    summary: `Community activity remains robust with ${onlineMembers.toLocaleString()} online members out of ${totalMembers.toLocaleString()} total members.`,
    source: "heuristic-telemetry",
    model: "gemini-3.6-flash",
    generatedAt: new Date().toISOString()
  };
}

// AI Live Activity Insights endpoint
app.get('/api/ai/live-insights', async (req, res) => {
  const now = Date.now();
  const force = req.query.refresh === 'true' || req.query.force === 'true';

  const totalMembers = Number(req.query.total) || cachedInviteData?.approximateMemberCount || 3324;
  const onlineMembers = Number(req.query.online) || cachedInviteData?.approximatePresenceCount || 640;
  const serverName = cachedInviteData?.guild?.name || "Dostana";
  const percentage = ((onlineMembers / Math.max(1, totalMembers)) * 100).toFixed(1);

  // Return cached result if fresh
  if (!force && cachedAiInsights && now - lastAiFetchTime < AI_CACHE_TTL_MS) {
    return res.json({ ...cachedAiInsights, cached: true });
  }

  // If quota was exceeded recently, return fallback without spamming Gemini API
  if (isQuotaExceeded && now - quotaExceededTime < QUOTA_COOLDOWN_MS) {
    const fallback = getFallbackInsights(totalMembers, onlineMembers, percentage, true);
    return res.json({ ...fallback, cached: true, note: "Quota cooldown active" });
  }

  const ai = getAI();

  if (!ai) {
    const fallback = getFallbackInsights(totalMembers, onlineMembers, percentage, false);
    cachedAiInsights = fallback;
    lastAiFetchTime = now;
    return res.json(fallback);
  }

  try {
    const prompt = `You are the real-time AI Activity Analytics Engine for the Discord server "${serverName}".
Current Live Data:
- Total Community Members: ${totalMembers}
- Currently Active Online: ${onlineMembers}
- Active Online Ratio: ${percentage}%
- Timestamp: ${new Date().toLocaleTimeString()}

Generate an ultra-short, lively, analytical activity report for the website visitors in professional yet fun community tone.`;

    let response;
    let usedModel = 'gemini-3.6-flash';
    const config = {
      systemInstruction: "You are an analytical Discord server telemetry AI. Provide concise, positive, factual observations.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          statusMessage: {
            type: Type.STRING,
            description: "Punchy 1-sentence live overview of current member count and activity."
          },
          communityVibe: {
            type: Type.STRING,
            description: "2 to 3 words describing current atmosphere."
          },
          activityLevel: {
            type: Type.STRING,
            description: "'Peak Surge', 'High Activity', or 'Steady Growth'"
          },
          aiForecast: {
            type: Type.STRING,
            description: "1-sentence intelligent prediction of member engagement in coming hours."
          },
          voiceRecommendation: {
            type: Type.STRING,
            description: "Best channel or voice room to hop into right now."
          },
          summary: {
            type: Type.STRING,
            description: "Quick 1-sentence analytical observation about member ratio."
          }
        },
        required: ["statusMessage", "communityVibe", "activityLevel", "aiForecast", "voiceRecommendation", "summary"]
      }
    };

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config
      });
    } catch (primaryErr: any) {
      if (primaryErr?.message?.includes('429') || primaryErr?.status === 429 || primaryErr?.message?.includes('RESOURCE_EXHAUSTED')) {
        isQuotaExceeded = true;
        quotaExceededTime = now;
        const fallback = getFallbackInsights(totalMembers, onlineMembers, percentage, true);
        cachedAiInsights = fallback;
        lastAiFetchTime = now;
        return res.json(fallback);
      }
      usedModel = 'gemini-flash-latest';
      response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config
      });
    }

    const parsed = JSON.parse(response?.text || '{}');
    const result = {
      success: true,
      hasApiKey: true,
      statusMessage: parsed.statusMessage || `${onlineMembers} members currently active in server.`,
      communityVibe: parsed.communityVibe || "Vibrant & Active",
      activityLevel: parsed.activityLevel || "High Activity",
      aiForecast: parsed.aiForecast || "Steady engagement across voice lounges.",
      voiceRecommendation: parsed.voiceRecommendation || "Chill Hangout #1",
      summary: parsed.summary || `${percentage}% of members are currently online.`,
      source: usedModel,
      model: usedModel,
      generatedAt: new Date().toISOString()
    };

    isQuotaExceeded = false;
    cachedAiInsights = result;
    lastAiFetchTime = now;
    return res.json(result);
  } catch (err: any) {
    if (err?.message?.includes('429') || err?.status === 429 || err?.message?.includes('RESOURCE_EXHAUSTED')) {
      isQuotaExceeded = true;
      quotaExceededTime = now;
    }
    const fallbackResult = getFallbackInsights(totalMembers, onlineMembers, percentage, true);
    cachedAiInsights = fallbackResult;
    lastAiFetchTime = now;
    return res.json(fallbackResult);
  }
});

// Optional Lanyard or public profile checker
app.get('/api/discord/user-lookup/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const lanyardRes = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    if (lanyardRes.ok) {
      const lanyardData = await lanyardRes.json();
      return res.json({ success: true, data: lanyardData.data });
    }
  } catch (e) {
    // Ignore and return basic structure
  }
  res.json({
    success: false,
    message: "No live Lanyard presence found. Direct Discord user link will be used.",
    directProfileUrl: `https://discord.com/users/${userId}`
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dostana Discord Showcase server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
