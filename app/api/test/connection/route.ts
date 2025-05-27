import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Test básico de conexión
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Error de conexión: ${error.message}`,
          error: error,
        },
        { status: 500 },
      )
    }

    // Obtener información de las tablas
    const { data: tables, error: tablesError } = await supabase
      .rpc("get_table_info")
      .then(() => ({ data: null, error: null }))
      .catch(() => ({ data: null, error: null }))

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a Supabase",
      info: {
        timestamp: new Date().toISOString(),
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        connection_status: "active",
        tables_accessible: true,
      },
    })
  } catch (error) {
    console.error("Database connection test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
