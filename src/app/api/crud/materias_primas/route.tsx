import {  PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const materiasPrimas = await prisma.materias_primas.findMany({
      select: {
        materia_id: true,
        nombre: true,
        descripcion: true,
        unidad_medida: true,
        cantidad_disponible: true,
        costo_unitario: true,
        provedor_id: true,
        proveedores: {
          select: {
            nombre_empresa: true,
          },
        },
      },
    });

    return NextResponse.json(materiasPrimas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener las materias primas" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const nuevaMateriaPrima = await prisma.materias_primas.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        unidad_medida: data.unidad_medida,
        cantidad_disponible: parseFloat(data.cantidad_disponible),
        costo_unitario: parseFloat(data.costo_unitario),
        provedor_id: parseInt(data.provedor_id),
      },
    });
    return NextResponse.json(nuevaMateriaPrima, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la materia prima" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { materia_id, ...data } = await req.json();

    const materiaPrimaActualizada = await prisma.materias_primas.update({
      where: { materia_id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        unidad_medida: data.unidad_medida,
        cantidad_disponible: parseFloat(data.cantidad_disponible),
        costo_unitario: parseFloat(data.costo_unitario),
        provedor_id: parseInt(data.provedor_id),
      },
    });
    return NextResponse.json(materiaPrimaActualizada, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar la materia prima" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const materia_id = req.nextUrl.searchParams.get("materia_id");

    const materiaPrimaEliminada = await prisma.materias_primas.delete({
      where: { materia_id: Number(materia_id) },
    });
    return NextResponse.json(materiaPrimaEliminada, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
