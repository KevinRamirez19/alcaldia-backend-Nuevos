import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Updating sitio turistico:", params.id)
    const body = await request.json()

    const sitioData = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      categoria: body.categoria,
      ubicacion: body.ubicacion,
      horarios: body.horarios,
      precio: body.precio,
      calificacion: body.calificacion,
      imagen_url: body.imagen_url || null,
      destacado: body.destacado || false,
      activo: body.activo !== false,
      updated_at: new Date().toISOString(),
    }

    console.log("Sitio data to update:", sitioData)

    const { data, error } = await supabase.from("sitios_turisticos").update(sitioData).eq("id", params.id).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Sitio turístico no encontrado" }, { status: 404 })
    }

    console.log("Sitio turistico updated:", data)
    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating sitio turistico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Deleting sitio turistico:", params.id)

    const { error } = await supabase.from("sitios_turisticos").delete().eq("id", params.id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Sitio turistico deleted:", params.id)
    return NextResponse.json({ message: "Sitio turístico eliminado exitosamente" })
  } catch (error) {
    console.error("Error deleting sitio turistico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
