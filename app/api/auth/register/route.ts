import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role = "usuario" } = await request.json()

    // Validar datos
    if (!email || !password || !fullName) {
      return NextResponse.json({ success: false, message: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      )
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase.from("mock_users").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ success: false, message: "El usuario ya existe" }, { status: 400 })
    }

    // Crear usuario en mock_users
    const { data: newUser, error: userError } = await supabase
      .from("mock_users")
      .insert({
        email,
        password_hash: "$2a$10$dummy.hash.for." + password, // Hash simulado
        full_name: fullName,
        role,
      })
      .select()
      .single()

    if (userError) {
      console.error("Error creating user:", userError)
      return NextResponse.json({ success: false, message: "Error al crear usuario" }, { status: 500 })
    }

    // Crear perfil correspondiente (ahora sin restricción de clave foránea)
    const { error: profileError } = await supabase.from("profiles").insert({
      id: newUser.id.toString(), // Convertir UUID a string
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      // No fallar si hay error en el perfil, el usuario principal ya se creó
    }

    return NextResponse.json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
