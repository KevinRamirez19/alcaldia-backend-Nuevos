import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Updating ubicacion mapa:", params.id)
    const body = await request.json()

    const ubicacionData = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      direccion: body.direccion,
      telefono: body.telefono || null,
      categoria: body.categoria,
      lat: body.lat,
      lng: body.lng,
      imagen_url: body.imagen_url || null,
      activa: body.activa !== false,
      updated_at: new Date().toISOString(),
    }

    console.log("Ubicacion data to update:", ubicacionData)

    const { data, error } = await supabase.from("ubicaciones_mapa").update(ubicacionData).eq("id", params.id).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Ubicación no encontrada" }, { status: 404 })
    }

    console.log("Ubicacion mapa updated:", data)
    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating ubicacion mapa:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Deleting ubicacion mapa:", params.id)

    const { error } = await supabase.from("ubicaciones_mapa").delete().eq("id", params.id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Ubicacion mapa deleted:", params.id)
    return NextResponse.json({ message: "Ubicación eliminada exitosamente" })
  } catch (error) {
    console.error("Error deleting ubicacion mapa:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
