import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Obtener noticias desde la base de datos real
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")
    const destacada = searchParams.get("destacada")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("noticias").select("*").order("fecha_publicacion", { ascending: false }).limit(limit)

    if (categoria && categoria !== "all") {
      query = query.eq("categoria", categoria)
    }

    if (destacada === "true") {
      query = query.eq("destacada", true)
    }

    const { data: noticias, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: noticias || [],
    })
  } catch (error) {
    console.error("Error fetching noticias:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva noticia en la base de datos real
export async function POST(request: NextRequest) {
  try {
    const { titulo, contenido, autor, categoria, imagen_url, destacada, activa } = await request.json()

    if (!titulo || !contenido || !autor || !categoria) {
      return NextResponse.json(
        { success: false, message: "Todos los campos requeridos deben ser completados" },
        { status: 400 },
      )
    }

    const { data: noticia, error } = await supabase
      .from("noticias")
      .insert({
        titulo,
        contenido,
        autor,
        categoria,
        imagen_url: imagen_url || null,
        destacada: destacada || false,
        activa: activa !== false,
        fecha_publicacion: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Noticia creada exitosamente",
      data: noticia,
    })
  } catch (error) {
    console.error("Error creating noticia:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
