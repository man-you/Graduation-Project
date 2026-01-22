export type UserRole = 'student' | 'teacher'

export interface User {
  id: string
  email: string
  phoneNumber?: string
  userName?: string
  avatarUrl?: string
  role: string
  bio?: string
}
