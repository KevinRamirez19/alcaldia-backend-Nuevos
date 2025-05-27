import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Obtener trámites
export async function GET(request: NextRequest) {
  try {
    console.log("Fetching tramites from Supabase...")

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase
      .from("tramites")
      .select("*")
      .eq("activo", true)
      .order("nombre", { ascending: true })
      .limit(limit)

    if (categoria && categoria !== "all" && categoria !== "") {
      query = query.eq("categoria", categoria)
    }

    const { data: tramites, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: [],
        },
        { status: 200 },
      )
    }

    console.log(`Found ${tramites?.length || 0} tramites`)

    return NextResponse.json(
      {
        success: true,
        data: tramites || [],
        message: "Trámites obtenidos exitosamente",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching tramites:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        data: [],
      },
      { status: 500 },
    )
  }
}

// POST - Crear nuevo trámite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion, requisitos, costo, tiempo_estimado, categoria, documento_url, imagen_url, activo } =
      body

    console.log("Creating tramite with data:", body)

    if (!nombre || !descripcion || !requisitos || !tiempo_estimado || !categoria) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos requeridos deben ser completados",
          data: null,
        },
        { status: 400 },
      )
    }

    const { data: tramite, error } = await supabase
      .from("tramites")
      .insert({
        nombre,
        descripcion,
        requisitos,
        costo: costo || 0,
        tiempo_estimado,
        categoria,
        documento_url: documento_url || null,
        imagen_url: imagen_url || null,
        activo: activo !== false,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error creating tramite:", error)
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: null,
        },
        { status: 400 },
      )
    }

    console.log("Tramite created successfully:", tramite)

    return NextResponse.json(
      {
        success: true,
        message: "Trámite creado exitosamente",
        data: tramite,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error creating tramite:", error)
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
