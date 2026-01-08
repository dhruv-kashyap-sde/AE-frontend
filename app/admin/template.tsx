import type { Metadata } from "next"

// Metadata for admin template - applies noindex to all admin pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
}

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
