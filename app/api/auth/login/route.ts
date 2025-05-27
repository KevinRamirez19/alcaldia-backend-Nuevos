import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario en la tabla mock_users
    const { data: mockUser, error: mockError } = await supabase
      .from("mock_users")
      .select("*")
      .eq("email", email)
      .single()

    if (mockError || !mockUser) {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 })
    }

    // Para simplificar, aceptamos cualquier contraseña para los usuarios de prueba
    // En producción aquí verificarías el hash de la contraseña
    if (password.length < 3) {
      return NextResponse.json({ success: false, message: "Contraseña muy corta" }, { status: 401 })
    }

    // Crear o actualizar perfil en la tabla profiles
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: mockUser.id,
      email: mockUser.email,
      full_name: mockUser.full_name,
      role: mockUser.role,
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error upserting profile:", profileError)
    }

    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: mockUser.id,
        email: mockUser.email,
        full_name: mockUser.full_name,
        role: mockUser.role,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
