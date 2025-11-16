import type { UserRole } from "./user"

export interface IApplication {
    id: number
    fullName: string
    email: string
    role: UserRole
    age: number
}