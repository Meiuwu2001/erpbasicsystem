import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movimientosInventario = await prisma.movimientos_inventario.findMany({
      select: {
        movimiento_id: true,
        inventario_id: true,
        tipo_movimiento: true,
        cantidad: true,
        fecha_movimiento: true,
        referencia: true,
        usuario_responsable: true,
      },
    });
    return NextResponse.json(movimientosInventario, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los movimientos de inventario" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const nuevoMovimientoInventario =
      await prisma.movimientos_inventario.create({
        data: {
          inventario_id: data.inventario_id,
          tipo_movimiento: data.tipo_movimiento,
          cantidad: data.cantidad,
          fecha_movimiento: data.fecha_movimiento,
          referencia: data.referencia,
          usuario_responsable: data.usuario_responsable,
        },
      });
    return NextResponse.json(nuevoMovimientoInventario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el movimiento de inventario" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { movimiento_id, ...data } = await req.json();

    const movimientoInventarioActualizado =
      await prisma.movimientos_inventario.update({
        where: { movimiento_id },
        data: {
          inventario_id: data.inventario_id,
          tipo_movimiento: data.tipo_movimiento,
          cantidad: data.cantidad,
          fecha_movimiento: data.fecha_movimiento,
          referencia: data.referencia,
          usuario_responsable: data.usuario_responsable,
        },
      });
    return NextResponse.json(movimientoInventarioActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el movimiento de inventario" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { movimiento_id } = await req.json();

    const movimientoInventarioEliminado =
      await prisma.movimientos_inventario.delete({
        where: { movimiento_id },
      });
    return NextResponse.json(movimientoInventarioEliminado, { status: 200 });
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
