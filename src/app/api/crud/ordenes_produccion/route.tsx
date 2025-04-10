import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ordenesProduccion = await prisma.ordenes_produccion.findMany({
      select: {
        orden_id: true,
        fecha_inicio: true,
        fecha_fin: true,
        estado: true,
        cantidad_producida: true,
        materia_id: true,
        productos: true,
        responsable_id: true,
        usuarios: true,
        detalles_ordenes: true,
      },
    });
    return NextResponse.json(ordenesProduccion, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener las órdenes de producción" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const materia = await prisma.materias_primas.findUnique({
      where: { materia_id: parseInt(data.materia_id) },
    });

    if (!materia) {
      return NextResponse.json(
        { error: "La materia prima no existe." },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { usuario_id: parseInt(data.responsable_id) },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "El responsable (usuario) no existe." },
        { status: 400 }
      );
    }

    const nuevaOrdenProduccion = await prisma.ordenes_produccion.create({
      data: {
        fecha_inicio: new Date(data.fecha_inicio),
        fecha_fin: new Date(data.fecha_fin),
        estado: data.estado,
        cantidad_producida: parseInt(data.cantidad_producida),
        materia_id: parseInt(data.materia_id),
        responsable_id: parseInt(data.responsable_id),
      },
    });

    return NextResponse.json(nuevaOrdenProduccion, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la orden de producción" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { orden_id, ...data } = await req.json();

    const ordenProduccionActualizada = await prisma.ordenes_produccion.update({
      where: { orden_id },
      data: {
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        estado: data.estado,
        cantidad_producida: data.cantidad_producida,
        materia_id: data.materia_id,
        productos: data.productos,
        responsable_id: data.responsable_id,
      },
    });
    return NextResponse.json(ordenProduccionActualizada, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar la orden de producción" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  const orden_id = req.nextUrl.searchParams.get("orden_id");
  try {
    const ordenProduccionEliminada = await prisma.ordenes_produccion.delete({
      where: { orden_id: Number(orden_id) },
    });
    return NextResponse.json(ordenProduccionEliminada, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
