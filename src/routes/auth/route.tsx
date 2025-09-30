import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Authorized } from '~/components/authorized'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Authorized>
      <Outlet />
    </Authorized>
  )
}
