export type UserRole = 'student' | 'teacher' | 'admin' 

export interface User {
  id: string
  email: string
  phoneNumber?: string
  userName?: string
  avatarUrl?: string
  role: UserRole
  bio?: string
}
