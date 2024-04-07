import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/')({
    validateSearch: z.object({
        redirect: z.string().catch('/dashboard'),
        error: z.string().optional(),
    }),
})
