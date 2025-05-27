import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    console.log("Fetching sitios turisticos...")

    const { data, error } = await supabase
      .from("sitios_turisticos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Sitios turisticos fetched:", data?.length || 0)
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching sitios turisticos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Creating new sitio turistico...")
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Sitio data to insert:", sitioData)

    const { data, error } = await supabase.from("sitios_turisticos").insert([sitioData]).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Sitio turistico created:", data)
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating sitio turistico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
