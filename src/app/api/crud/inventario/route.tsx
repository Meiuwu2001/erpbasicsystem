import {  PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventarios = await prisma.inventario.findMany({
      select: {
        inventario_id: true,
        materia_id: true,
        productos: true,
        cantidad: true,
        stock_minimo: true,
        stock_maximo: true,
        movimientos_inventario: true,
        lotes: true,
      },
    });
    return NextResponse.json(inventarios, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los inventarios" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const nuevoInventario = await prisma.inventario.create({
      data: {
        materia_id: parseInt(data.materia_id),
        cantidad: parseInt(data.cantidad),
        stock_minimo: parseInt(data.stock_minimo),
        stock_maximo: parseInt(data.stock_maximo),
      },
    });
    return NextResponse.json(nuevoInventario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el inventario" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { inventario_id, ...data } = await req.json();

    const inventarioActualizado = await prisma.inventario.update({
      where: { inventario_id },
      data: {
        materia_id: parseInt(data.materia_id),
        cantidad: parseInt(data.cantidad),
        stock_minimo: parseInt(data.stock_minimo),
        stock_maximo: parseInt(data.stock_maximo),
      },
    });
    return NextResponse.json(inventarioActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el inventario" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const inventario_id = req.nextUrl.searchParams.get("inventario_id");

    const inventarioEliminado = await prisma.inventario.delete({
      where: { inventario_id: Number(inventario_id) },
    });
    return NextResponse.json(inventarioEliminado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
