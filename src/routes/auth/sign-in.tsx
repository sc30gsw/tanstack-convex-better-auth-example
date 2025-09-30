import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AlertCircle, Github, Loader2, Lock, Mail } from 'lucide-react'
import { useTransition } from 'react'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignIn,
})

function SignIn() {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      error: '',
    },
    onSubmit: ({ value, formApi }) => {
      formApi.setFieldValue('error', '')

      startTransition(async () => {
        try {
          await authClient.signIn.email(
            {
              email: value.email,
              password: value.password,
            },
            {
              onSuccess: () => {
                navigate({ to: '/' })
              },
              onError: (ctx) => {
                formApi.setFieldValue('error', ctx.error.message || 'ログインに失敗しました')
              },
            },
          )
        } catch (_err) {
          formApi.setFieldValue('error', '予期しないエラーが発生しました')
        }
      })
    },
  })

  const handleGitHubSignIn = () => {
    form.setFieldValue('error', '')

    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: 'github',
          callbackURL: '/',
        })
      } catch (_err) {
        form.setFieldValue('error', 'GitHub認証に失敗しました')
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-3xl text-slate-900 dark:text-slate-50">ログイン</h1>
          <p className="mt-2 text-slate-600 text-sm dark:text-slate-400">
            アカウントにログインしてください
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
          {form.state.values.error && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-800 text-sm dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{form.state.values.error}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'メールアドレスは必須です'
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                      ? 'メールアドレスの形式が正しくありません'
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-1 block font-medium text-slate-700 text-sm dark:text-slate-300"
                  >
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-5 w-5 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-10 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="your@email.com"
                      disabled={isPending}
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-red-600 text-xs dark:text-red-400">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'パスワードは必須です'
                    : value.length < 8
                      ? 'パスワードは8文字以上で入力してください'
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-1 block font-medium text-slate-700 text-sm dark:text-slate-300"
                  >
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 h-5 w-5 text-slate-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      minLength={8}
                      className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-10 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="••••••••"
                      disabled={isPending}
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-red-600 text-xs dark:text-red-400">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  ログイン中...
                </>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
            <span className="px-4 text-slate-500 text-sm dark:text-slate-400">または</span>
            <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
          </div>

          <button
            type="button"
            onClick={handleGitHubSignIn}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-offset-slate-800 dark:hover:bg-slate-600"
          >
            <Github className="h-5 w-5" />
            GitHubでログイン
          </button>

          <div className="mt-6 text-center text-slate-600 text-sm dark:text-slate-400">
            アカウントをお持ちでないですか？{' '}
            <Link
              to="/auth/sign-up"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
