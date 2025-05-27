import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Obtener testimonios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get("estado")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("testimonios")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (estado) {
      query = query.eq("estado", estado)
    }

    const { data: testimonios, error } = await query

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: testimonios,
    })
  } catch (error) {
    console.error("Error fetching testimonios:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo testimonio
export async function POST(request: NextRequest) {
  try {
    const { nombre, email, telefono, mensaje, calificacion } = await request.json()

    if (!nombre || !email || !mensaje || !calificacion) {
      return NextResponse.json(
        { success: false, message: "Todos los campos requeridos deben ser completados" },
        { status: 400 },
      )
    }

    const { data: testimonio, error } = await supabase
      .from("testimonios")
      .insert({
        nombre,
        email,
        telefono,
        mensaje,
        calificacion,
        estado: "pendiente",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Testimonio enviado exitosamente",
      data: testimonio,
    })
  } catch (error) {
    console.error("Error creating testimonio:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
