const AVATAR_PALETTE = [
  { bg: '#F4B400', text: '#202124' }, // Google Amber (matching screenshot)
  { bg: '#4285F4', text: '#FFFFFF' }, // Google Blue
  { bg: '#0F9D58', text: '#FFFFFF' }, // Google Green
  { bg: '#EA4335', text: '#FFFFFF' }, // Google Red
  { bg: '#9C27B0', text: '#FFFFFF' }, // Purple
  { bg: '#3F51B5', text: '#FFFFFF' }, // Indigo
  { bg: '#009688', text: '#FFFFFF' }, // Teal
  { bg: '#FF5722', text: '#FFFFFF' }, // Deep Orange
  { bg: '#E91E63', text: '#FFFFFF' }, // Pink
  { bg: '#00BCD4', text: '#FFFFFF' }, // Cyan
  { bg: '#673AB7', text: '#FFFFFF' }, // Deep Purple
  { bg: '#795548', text: '#FFFFFF' }, // Brown
];

/**
 * Deterministically generates a consistent, vibrant background color and high-contrast text color
 * for any given user identifier (e.g. name, username, or email) similar to Google accounts.
 */
export function getAvatarColor(identifier?: string | null): { bg: string; text: string } {
  if (!identifier || !identifier.trim()) {
    return AVATAR_PALETTE[0];
  }

  const str = identifier.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

/**
 * Extracts uppercase initial(s) from a user's name or email.
 */
export function getUserInitial(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'A';
}
