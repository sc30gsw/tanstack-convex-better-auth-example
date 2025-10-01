import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  //? Convexのhttpルート経由でBetter Authエンドポイントにアクセス
  // Better AuthのデフォルトbasePath '/api/auth' を使用
  baseURL: `${import.meta.env.VITE_CONVEX_SITE_URL}/api/auth`,
  plugins: [convexClient()],
  // ? getSessionでsessionを取得できないため
  fetchOptions: {
    credentials: 'include', // クロスオリジンでもCookieを送信
  },
})
