import axios from 'axios'
import { auth } from './firebase'

export interface AdminUser {
  id: string
  email: string
  name: string
  handle: string
  avatarUrl: string
  verified: boolean
  banned: boolean
  posts: number
  joined: string
}

export interface AdminOverview {
  totalUsers: number
  emailSubscribers: number
  verifiedUsers: number
  bannedUsers: number
  pendingPosts: number
}

export type UserFilter = 'all' | 'verified' | 'banned'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
})

async function authHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser
  if (!user) throw new Error('You must be signed in to use the admin tools.')
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

function readError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string' && detail) return detail
    if (error.response?.status === 403) return 'Admin access required.'
    if (error.response?.status === 401) {
      return 'Your session has expired. Sign in again.'
    }
    if (error.response && error.response.status >= 500) {
      return 'The server hit an error. Please try again.'
    }
    if (!error.response) {
      return 'Cannot reach the server. Make sure the backend is running.'
    }
  }
  return 'Something went wrong. Please try again.'
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  try {
    const { data } = await api.get<AdminOverview>('/admin/overview', {
      headers: await authHeaders(),
    })
    return data
  } catch (err) {
    throw new Error(readError(err))
  }
}

export async function fetchAdminUsers(
  q = '',
  filter: UserFilter = 'all',
): Promise<{ users: AdminUser[]; total: number }> {
  try {
    const { data } = await api.get<{ users: AdminUser[]; total: number }>(
      '/admin/users',
      {
        headers: await authHeaders(),
        params: { q, filter, page: 1, page_size: 100 },
      },
    )
    return data
  } catch (err) {
    throw new Error(readError(err))
  }
}

export async function updateAdminUser(
  uid: string,
  patch: { verified?: boolean; banned?: boolean },
): Promise<AdminUser> {
  try {
    const { data } = await api.patch<AdminUser>(`/admin/users/${uid}`, patch, {
      headers: await authHeaders(),
    })
    return data
  } catch (err) {
    throw new Error(readError(err))
  }
}
