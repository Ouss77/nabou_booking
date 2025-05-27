import type { ReactNode } from "react"

interface FormCardProps {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}

export default function FormCard({ title, description, icon, children }: FormCardProps) {
  return (
    <div className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center">
        <div className="mr-2">{icon}</div>
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
