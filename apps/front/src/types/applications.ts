import type { UserRole } from "./user"

export interface IApplication {
    id: string
    fullName: string
    email: string
    role: UserRole
    age: number
}