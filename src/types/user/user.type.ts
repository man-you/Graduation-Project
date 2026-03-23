export type UserRole = 'student' | 'teacher' | 'admin' 

export interface User {
  id: string
  identifier:string
  department: string
  grade: string
  email: string
  phoneNumber?: string
  userName?: string
  avatarUrl?: string
  role: UserRole
  bio?: string
}
