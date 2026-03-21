import { AuthLayout } from "@/components/auth/AuthLayout"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export const metadata = {
    title: "Reset Password | Digital Marketing CRM",
    description: "Set a new password for your CRM account.",
}

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <ResetPasswordForm />
        </AuthLayout>
    )
}
