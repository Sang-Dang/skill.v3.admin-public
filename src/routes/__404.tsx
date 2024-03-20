import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__404')({
  component: NotFound,
})

function NotFound() {
  return (
    <>NOT FOUND</>
  )
}