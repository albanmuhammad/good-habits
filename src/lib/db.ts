export type Habit = {
    id: string
    owner_id: string
    name: string
    description: string | null
    reminder_enabled: string | null
    reminder_time: string | null
    is_archived: boolean
    created_at: string
}

export type HabitLog = {
    occurred_on: string
    quantity: number
}