import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// PUT - Actualizar testimonio
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { estado } = await request.json()
    const testimonioId = params.id

    if (!["pendiente", "aprobado", "rechazado"].includes(estado)) {
      return NextResponse.json({ success: false, message: "Estado inválido" }, { status: 400 })
    }

    const { data: testimonio, error } = await supabase
      .from("testimonios")
      .update({ estado, updated_at: new Date().toISOString() })
      .eq("id", testimonioId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Testimonio actualizado exitosamente",
      data: testimonio,
    })
  } catch (error) {
    console.error("Error updating testimonio:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar testimonio
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testimonioId = params.id

    const { error } = await supabase.from("testimonios").delete().eq("id", testimonioId)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Testimonio eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error deleting testimonio:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
