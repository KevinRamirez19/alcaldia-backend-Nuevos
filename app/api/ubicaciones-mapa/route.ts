import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    console.log("Fetching ubicaciones mapa...")

    const { data, error } = await supabase
      .from("ubicaciones_mapa")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Ubicaciones mapa fetched:", data?.length || 0)
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching ubicaciones mapa:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Creating new ubicacion mapa...")
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Ubicacion data to insert:", ubicacionData)

    const { data, error } = await supabase.from("ubicaciones_mapa").insert([ubicacionData]).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Ubicacion mapa created:", data)
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating ubicacion mapa:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
