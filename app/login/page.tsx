import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Alcaldía de Tibirita</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para gestionar servicios municipales</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
