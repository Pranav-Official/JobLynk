export interface RecruiterAttributes {
  id?: string // UUID will be generated
  userId: string // Foreign key referencing User
  companyName?: string
  companyUrl?: string | null // Optional, can be null
}
