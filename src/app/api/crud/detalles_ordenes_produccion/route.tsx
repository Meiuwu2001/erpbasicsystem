import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const detallesOrdenesProduccion =
      await prisma.detalles_ordenes_produccion.findMany({
        select: {
          detalle_id: true,
          orden_id: true,
          materia_id: true,
          cantidad: true,
          costo_unitario: true,
          total: true,
        },
      });
    return NextResponse.json(detallesOrdenesProduccion, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los detalles de órdenes de producción" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const nuevoDetalleOrdenProduccion =
      await prisma.detalles_ordenes_produccion.create({
        data: {
          orden_id: data.orden_id,
          materia_id: data.materia_id,
          costo_unitario: data.costo_unitario,
          total: data.total,
          cantidad: data.cantidad,
        },
      });
    return NextResponse.json(nuevoDetalleOrdenProduccion, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el detalle de la orden de producción" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { detalle_id, ...data } = await req.json();

    const detalleOrdenProduccionActualizado =
      await prisma.detalles_ordenes_produccion.update({
        where: { detalle_id },
        data: {
          orden_id: data.orden_id,
          materia_id: data.materia_id,
          costo_unitario: data.costo_unitario,
          total: data.total,
          cantidad: data.cantidad,
        },
      });
    return NextResponse.json(detalleOrdenProduccionActualizado, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el detalle de la orden de producción" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { detalle_id } = await req.json();

    await prisma.detalles_ordenes_produccion.delete({
      where: { detalle_id },
    });
    return NextResponse.json(
      { message: "Detalle de orden de producción eliminado" },
      { status: 200 }
    );
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
