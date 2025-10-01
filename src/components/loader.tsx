import { Loader2 } from 'lucide-react'

export function Loader() {
  return (
    <div className="my-48 flex animate-spin items-center justify-center">
      <Loader2
        size={48}
        className="text-blue-600"
        style={{
          animationDuration: '0.3s',
        }}
      />
    </div>
  )
}
