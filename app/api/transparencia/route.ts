import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Obtener documentos de transparencia
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("documentos_transparencia")
      .select("*")
      .eq("activo", true)
      .order("fecha_publicacion", { ascending: false })
      .range(offset, offset + limit - 1)

    if (categoria) {
      query = query.eq("categoria", categoria)
    }

    const { data: documentos, error } = await query

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: documentos,
    })
  } catch (error) {
    console.error("Error fetching documentos:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo documento
export async function POST(request: NextRequest) {
  try {
    const { titulo, descripcion, categoria, archivo_url, activo } = await request.json()

    if (!titulo || !descripcion || !categoria || !archivo_url) {
      return NextResponse.json(
        { success: false, message: "Todos los campos requeridos deben ser completados" },
        { status: 400 },
      )
    }

    const { data: documento, error } = await supabase
      .from("documentos_transparencia")
      .insert({
        titulo,
        descripcion,
        categoria,
        archivo_url,
        activo: activo !== false,
        fecha_publicacion: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Documento creado exitosamente",
      data: documento,
    })
  } catch (error) {
    console.error("Error creating documento:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
