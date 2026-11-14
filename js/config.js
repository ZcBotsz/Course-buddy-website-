/**
 * ============================================================
 *  COURSE BUDDY 2 — CENTRAL CONFIGURATION
 * ============================================================
 *  This is the ONLY file you need to edit to rebrand the site.
 *
 *  - siteName          → shown in header, hero ("Welcome to ..."),
 *                        footer, and the browser <title>.
 *  - telegramUsername  → every "Get Access" and "Chat" button
 *                        points to https://telegram.me/<this value>.
 *
 *  Change these two values and the whole website updates.
 *  No other file contains the name or the username.
 * ============================================================
 */
const SITE_CONFIG = {
  siteName: "Course Buddy 2",
  telegramUsername: "CourseBuddy_Admin",
  telegramGreeting: "Hi Buddy 😄",
  chatMessage: "Hi Buddy, I'm interested in courses",
  // Optional: link to your Telegram channel/group (leave "" to hide)
  telegramChannel: "",
  // Optional: original site (used only as image fallback source)
  sourceSite: "https://buddy7.vercel.app",
};

/**
 * Build a Telegram "Get Access" link for a course title.
 * Example: https://telegram.me/CourseBuddy_Admin?text=Hi%20Buddy...
 */
function telegramAccessUrl(courseTitle) {
  const text = `${SITE_CONFIG.telegramGreeting}\n\nI want access to "${courseTitle}"`;
  return `https://telegram.me/${SITE_CONFIG.telegramUsername}?text=${encodeURIComponent(text)}`;
}

/** Build the floating "Chat" button link. */
function telegramChatUrl() {
  return `https://telegram.me/${SITE_CONFIG.telegramUsername}?text=${encodeURIComponent(SITE_CONFIG.chatMessage)}`;
}
