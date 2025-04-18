import {  PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lotes = await prisma.lotes.findMany({
      select: {
        lote_id: true,
        codigo: true,
        inventario_id: true,
        fecha_caducidad: true,
        cantidad: true,
      },
    });
    return NextResponse.json(lotes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los proveedores" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const nuevoLote = await prisma.lotes.create({
      data: {
        codigo: data.codigo, // Removed as it does not exist in the schema
        inventario_id: parseInt(data.inventario_id),
        fecha_caducidad: data.fecha_caducidad,
        cantidad: parseInt(data.cantidad),
      },
    });
    return NextResponse.json(nuevoLote, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el lote" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { lote_id, ...data } = await req.json();

    const loteActualizado = await prisma.lotes.update({
      where: { lote_id },
      data: {
        inventario_id: data.inventario_id,
        fecha_caducidad: data.fecha_caducidad,
        cantidad: data.cantidad,
      },
    });
    return NextResponse.json(loteActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el lote" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const lote_id = req.nextUrl.searchParams.get("lote_id");

    const loteEliminado = await prisma.lotes.delete({
      where: { lote_id: Number(lote_id) },
    });
    return NextResponse.json(loteEliminado, { status: 200 });
  } catch (error) {
    console.error(error);
  
    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
