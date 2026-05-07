import { AuthExperience } from '@/components/auth-experience'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthExperience>{children}</AuthExperience>
  )
}
