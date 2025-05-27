import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// PUT - Actualizar documento
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { titulo, descripcion, categoria, archivo_url, activo } = await request.json()
    const documentoId = params.id

    const { data: documento, error } = await supabase
      .from("documentos_transparencia")
      .update({
        titulo,
        descripcion,
        categoria,
        archivo_url,
        activo,
      })
      .eq("id", documentoId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Documento actualizado exitosamente",
      data: documento,
    })
  } catch (error) {
    console.error("Error updating documento:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar documento
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentoId = params.id

    const { error } = await supabase.from("documentos_transparencia").delete().eq("id", documentoId)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Documento eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error deleting documento:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
