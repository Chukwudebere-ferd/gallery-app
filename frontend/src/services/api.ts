import axios from 'axios'

export type AuthCodePurpose = 'verify' | 'reset'

export interface SendCodeResult {
  ok: boolean
}

export interface VerifyCodeResult {
  ok: boolean
  resetToken?: string
}

export interface MeResult {
  uid: string
  email: string
  username: string
  verified: boolean
  admin: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
})

function readError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string' && detail) return detail
    if (error.response?.status === 429) {
      return 'Too many attempts. Please wait a moment.'
    }
    if (error.response?.status === 401) return 'Your session has expired. Sign in again.'
    if (error.response && error.response.status >= 500) {
      return 'The server hit an error. Please try again.'
    }
    if (!error.response) {
      return 'Cannot reach the server. Make sure the backend is running.'
    }
  }
  return 'Something went wrong. Please try again.'
}

export async function sendAuthCode(
  email: string,
  purpose: AuthCodePurpose,
): Promise<SendCodeResult> {
  try {
    const { data } = await api.post<SendCodeResult>('/auth/code/send', {
      email,
      purpose,
    })
    return data
  } catch (err) {
    throw new Error(readError(err))
  }
}

export async function verifyAuthCode(
  email: string,
  purpose: AuthCodePurpose,
  code: string,
): Promise<VerifyCodeResult> {
  try {
    const { data } = await api.post<VerifyCodeResult>('/auth/code/verify', {
      email,
      purpose,
      code,
    })
    return data
  } catch (err) {
    throw new Error(readError(err))
  }
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<void> {
  try {
    await api.post('/auth/password/reset', { email, token, new_password: newPassword })
  } catch (err) {
    throw new Error(readError(err))
  }
}

export async function getMe(idToken: string): Promise<MeResult> {
  try {
    const { data } = await api.get<MeResult>('/auth/me', {
      headers: { Authorization: `Bearer ${idToken}` },
    })
    return data
  } catch (err) {
    throw new Error(readError(err))
  }
}
