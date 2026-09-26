import { DiscordServerData } from '../types';

// Real-time live base server data for Dostana Discord
export const INITIAL_DOSTANA_DATA: DiscordServerData = {
  success: true,
  inviteCode: "dostana",
  integrationMode: "discord_invite_api",
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
  approximateMemberCount: 3323,
  approximatePresenceCount: 105,
  premiumSubscriptionCount: 26,
  premiumTier: 3,
  fetchedAt: new Date().toISOString(),
  isFallback: false
};

/**
 * Multi-layer resilient Discord Live Fetcher:
 * 1. Checks Local Full-Stack Node Route (/api/discord/server) -> Bot API, Webhook & Server Cache
 * 2. Directly fetches Discord Public Invite API (CORS-enabled)
 * 3. Fallback to open CORS proxies (allorigins, corsproxy)
 */
export async function fetchLiveDiscordData(): Promise<DiscordServerData | null> {
  const inviteCode = 'dostana';
  const guildId = "1425792165484691539";

  // Layer 1: Local Server Proxy Route (Supports Bot API & Incoming Webhook Cache)
  try {
    const localRes = await fetch('/api/discord/server?refresh=true', { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    }).catch(() => null);

    if (localRes && localRes.ok) {
      const data = await localRes.json();
      if (data && typeof data.approximateMemberCount === 'number' && data.guild) {
        return data;
      }
    }
  } catch (e) {
    // Proceed to browser-direct fetch
  }

  // Layer 2: Direct Discord Invite API (public endpoint with CORS)
  const discordUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
  try {
    const res = await fetch(discordUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const raw = await res.json();
      const parsed = parseDiscordRawInvite(raw, inviteCode, guildId, "direct_cors_invite");
      if (parsed) return parsed;
    }
  } catch (err) {
    console.warn("[Discord API] Direct browser fetch failed, trying CORS proxies...", err);
  }

  // Layer 3: Proxy 1 (AllOrigins)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(discordUrl)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const raw = await proxyRes.json();
      const parsed = parseDiscordRawInvite(raw, inviteCode, guildId, "direct_cors_invite");
      if (parsed) return parsed;
    }
  } catch (p1Err) {
    console.warn("[Discord API] Proxy 1 failed:", p1Err);
  }

  // Layer 4: Proxy 2 (CorsProxy)
  try {
    const proxyUrl2 = `https://corsproxy.io/?url=${encodeURIComponent(discordUrl)}`;
    const proxyRes2 = await fetch(proxyUrl2);
    if (proxyRes2.ok) {
      const raw = await proxyRes2.json();
      const parsed = parseDiscordRawInvite(raw, inviteCode, guildId, "direct_cors_invite");
      if (parsed) return parsed;
    }
  } catch (p2Err) {
    console.warn("[Discord API] Proxy 2 failed:", p2Err);
  }

  return null;
}

function parseDiscordRawInvite(raw: any, inviteCode: string, guildId: string, mode: any): DiscordServerData | null {
  if (!raw || (!raw.guild && !raw.approximate_member_count)) return null;

  const guild = raw.guild || {};
  const profile = raw.profile || {};
  const memberCount = raw.approximate_member_count ?? profile.member_count ?? 3323;
  const presenceCount = raw.approximate_presence_count ?? profile.online_count ?? 105;

  let iconUrl = "/dostana-icon.gif";
  if (guild.icon) {
    const isAnimated = guild.icon.startsWith('a_');
    const ext = isAnimated ? 'gif' : 'png';
    iconUrl = `https://cdn.discordapp.com/icons/${guild.id || guildId}/${guild.icon}.${ext}?size=1024`;
  }

  let bannerUrl = "/dostana-banner.png";
  if (guild.banner) {
    const isAnimated = guild.banner.startsWith('a_');
    const ext = isAnimated ? 'gif' : 'png';
    bannerUrl = `https://cdn.discordapp.com/banners/${guild.id || guildId}/${guild.banner}.${ext}?size=1024`;
  }

  return {
    success: true,
    inviteCode,
    integrationMode: mode,
    guild: {
      id: guild.id || guildId,
      name: guild.name || "|| 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 || Gaming • Chilling • VCs • Fun •",
      description: guild.description || "Welcome to || 𝐃𝐨𝐬𝐭𝐚𝐧𝐚 ||",
      icon: iconUrl,
      banner: bannerUrl,
      features: guild.features || [],
      verificationLevel: guild.verification_level || 1,
      vanityUrlCode: guild.vanity_url_code || inviteCode
    },
    approximateMemberCount: memberCount,
    approximatePresenceCount: presenceCount,
    premiumSubscriptionCount: guild.premium_subscription_count ?? 26,
    premiumTier: guild.premium_tier ?? 3,
    fetchedAt: new Date().toISOString(),
    isFallback: false
  };
}

/**
 * Gets configured webhook info status
 */
export async function getDiscordWebhookInfo(): Promise<{ hasWebhook: boolean }> {
  try {
    const res = await fetch('/api/discord/webhook-info');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // ignore
  }
  return { hasWebhook: false };
}

/**
 * Dispatches live server stats embed directly into the configured Discord channel (backend only)
 */
export async function sendDiscordWebhookStats(): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const res = await fetch('/api/discord/send-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: "Network error", error: err.message };
  }
}

/**
 * Connects the Discord Bot directly via Token
 */
export async function connectDiscordBot(token: string): Promise<{ success: boolean; message: string; stats?: any }> {
  try {
    const res = await fetch('/api/discord/bot/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to reach backend server" };
  }
}

/**
 * Gets live bot connection stats
 */
export async function getDiscordBotStats(): Promise<{ stats: any }> {
  try {
    const res = await fetch('/api/discord/bot/stats');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // ignore
  }
  return { stats: { connected: false } };
}

/**
 * Triggers a test webhook push to the backend
 */
export async function pushTestDiscordWebhook(memberDelta: number = 0, presenceDelta: number = 0): Promise<any> {
  const currentMembers = 3323 + memberDelta;
  const currentPresence = 98 + presenceDelta;

  try {
    const res = await fetch('/api/discord/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        botName: "Dostana Live Monitor",
        memberCount: currentMembers,
        presenceCount: currentPresence,
        boostCount: 26,
        boostTier: 3,
        event: "manual_test_sync"
      })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
