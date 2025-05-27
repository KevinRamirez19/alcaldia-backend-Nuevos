import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// PUT - Actualizar noticia en la base de datos real
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { titulo, contenido, autor, categoria, imagen_url, destacada, activa } = await request.json()
    const noticiaId = params.id

    const { data: noticia, error } = await supabase
      .from("noticias")
      .update({
        titulo,
        contenido,
        autor,
        categoria,
        imagen_url: imagen_url || null,
        destacada: destacada || false,
        activa: activa !== false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noticiaId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Noticia actualizada exitosamente",
      data: noticia,
    })
  } catch (error) {
    console.error("Error updating noticia:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar noticia de la base de datos real
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const noticiaId = params.id

    const { error } = await supabase.from("noticias").delete().eq("id", noticiaId)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Noticia eliminada exitosamente",
    })
  } catch (error) {
    console.error("Error deleting noticia:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
