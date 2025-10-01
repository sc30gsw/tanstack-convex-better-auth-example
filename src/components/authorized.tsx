import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader } from '~/components/loader'
import { authClient } from '~/lib/auth-client'

const PUBLIC_ROUTES = ['/auth/sign-in', '/auth/sign-up']

export function Authorized({ children }: Record<'children', React.ReactNode>) {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate({
        to: '/auth/sign-in',
        search: {
          redirect: location.pathname,
        },
      })
    } else if (session?.user && PUBLIC_ROUTES.includes(location.pathname)) {
      // User is authenticated, do nothing
      navigate({
        to: '/',
      })
    }
  }, [session, isPending, navigate])

  if (isPending) {
    return <Loader />
  }

  return children
}
