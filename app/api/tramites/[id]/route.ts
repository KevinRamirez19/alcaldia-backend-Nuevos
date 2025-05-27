import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// PUT - Actualizar trámite
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { nombre, descripcion, requisitos, costo, tiempo_estimado, categoria, documento_url, imagen_url, activo } =
      body
    const tramiteId = params.id

    console.log("Updating tramite:", tramiteId, "with data:", body)

    const { data: tramite, error } = await supabase
      .from("tramites")
      .update({
        nombre,
        descripcion,
        requisitos,
        costo: costo || 0,
        tiempo_estimado,
        categoria,
        documento_url: documento_url || null,
        imagen_url: imagen_url || null,
        activo: activo !== false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tramiteId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error updating tramite:", error)
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: null,
        },
        { status: 400 },
      )
    }

    console.log("Tramite updated successfully:", tramite)

    return NextResponse.json(
      {
        success: true,
        message: "Trámite actualizado exitosamente",
        data: tramite,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error updating tramite:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        data: null,
      },
      { status: 500 },
    )
  }
}

// DELETE - Eliminar trámite
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tramiteId = params.id

    console.log("Deleting tramite:", tramiteId)

    const { error } = await supabase.from("tramites").delete().eq("id", tramiteId)

    if (error) {
      console.error("Supabase error deleting tramite:", error)
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      )
    }

    console.log("Tramite deleted successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Trámite eliminado exitosamente",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error deleting tramite:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
