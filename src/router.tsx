import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexReactClient } from 'convex/react'
import { authClient } from '~/lib/auth-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!

  if (!CONVEX_URL) {
    console.error('missing envar CONVEX_URL')
  }

  const convex = new ConvexReactClient(CONVEX_URL, {
    // Optionally pause queries until the user is authenticated
    expectAuth: true,
  })

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0, // Let React Query handle all caching
      defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
      defaultNotFoundComponent: () => <p>not found</p>,
      Wrap: ({ children }) => (
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          {children}
        </ConvexBetterAuthProvider>
      ),
    }),
    queryClient,
  )

  return router
}
