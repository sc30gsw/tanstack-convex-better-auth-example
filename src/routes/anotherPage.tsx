import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/anotherPage')({
  component: AnotherPage,
})

function AnotherPage() {
  const callMyAction = useAction(api.myFunctions.myAction)

  const { data } = useSuspenseQuery(convexQuery(api.myFunctions.listNumbers, { count: 10 }))

  return (
    <main className="flex flex-col gap-16 p-8">
      <h1 className="text-center font-bold text-4xl">Convex + Tanstack Start</h1>
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <p>Numbers: {data.numbers.join(', ')}</p>
        <p>Click the button below to add a random number to the database.</p>
        <p>
          <button
            className="rounded-md border-2 bg-dark px-4 py-2 text-light text-sm dark:bg-light dark:text-dark"
            onClick={() => {
              callMyAction({
                first: Math.round(Math.random() * 100),
              }).then(() => alert('Number added!'))
            }}
          >
            Call action to add a random number
          </button>
        </p>
        <Link to="/" className="text-blue-600 underline hover:no-underline">
          Back
        </Link>
      </div>
    </main>
  )
}
