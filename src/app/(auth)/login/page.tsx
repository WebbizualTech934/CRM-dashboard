import { AuthLayout } from "@/components/auth/AuthLayout"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata = {
    title: "Sign In | Digital Marketing CRM",
    description: "Sign in to manage your 3D animation leads, campaigns, and client relationships.",
}

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    )
}
