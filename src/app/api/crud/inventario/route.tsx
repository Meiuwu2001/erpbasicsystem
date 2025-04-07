import { Prisma, PrismaClient } from "@prisma/client";
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
        materia_id: data.materia_id,
        productos: data.productos,
        cantidad: data.cantidad,
        stock_minimo: data.stock_minimo,
        stock_maximo: data.stock_maximo,
        movimientos_inventario: data.movimientos_inventario,
        lotes: data.lotes,
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
        materia_id: data.materia_id,
        productos: data.productos,
        cantidad: data.cantidad,
        stock_minimo: data.stock_minimo,
        stock_maximo: data.stock_maximo,
        movimientos_inventario: data.movimientos_inventario,
        lotes: data.lotes,
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
export async function DELETE(req: NextRequest) {
  try {
    const { inventario_id } = await req.json();

    const inventarioEliminado = await prisma.inventario.delete({
      where: { inventario_id },
    });
    return NextResponse.json(inventarioEliminado, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
