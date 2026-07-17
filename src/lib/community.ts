import type { User } from '@supabase/supabase-js'

export function accountName(user: User | null) {
  if (!user) return ''
  const metadata = user.user_metadata as Record<string, unknown>
  const value = typeof metadata.display_name === 'string'
    ? metadata.display_name
    : typeof metadata.username === 'string'
      ? metadata.username
      : ''
  const normalized = value.normalize('NFKC').replace(/[^\p{L}\p{N}._ -]/gu, '').trim().replace(/\s+/g, ' ').slice(0, 32)
  if (normalized.length >= 3) return normalized
  return user.email?.split('@')[0]?.slice(0, 32) || 'Miembro'
}

export function cleanCommunityText(value: string, maxLength: number) {
  return value
    .normalize('NFKC')
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')
    .trim()
    .slice(0, maxLength)
}
