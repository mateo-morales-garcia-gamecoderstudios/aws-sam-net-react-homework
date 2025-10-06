import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/manage"!</div>
}
