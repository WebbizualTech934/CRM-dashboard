import { AuthLayout } from "@/components/auth/AuthLayout"
import { SignupForm } from "@/components/auth/SignupForm"

export const metadata = {
    title: "Create Account | Digital Marketing CRM",
    description: "Join the workspace for managing 3D animation leads, campaigns, and client relationships.",
}

export default function SignupPage() {
    return (
        <AuthLayout>
            <SignupForm />
        </AuthLayout>
    )
}
