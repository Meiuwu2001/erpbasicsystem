import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      select: {
        proveedor_id: true,
        nombre_empresa: true,
        direccion: true,
        telefono: true,
        email: true,
        tiempo_entrega_dias: true,
        contacto: true,
        condiciones_pago: true,
      },
    });
    return NextResponse.json(proveedores, { status: 200 });
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
    const nuevoProveedor = await prisma.proveedores.create({
      data: {
        nombre_empresa: data.nombre_empresa,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        tiempo_entrega_dias: data.tiempo_entrega_dias,
        contacto: data.contacto,
        condiciones_pago: data.condiciones_pago,
      },
    });
    return NextResponse.json(nuevoProveedor, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el proveedor" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { proveedor_id, ...data } = await req.json();

    const proveedorActualizado = await prisma.proveedores.update({
      where: { proveedor_id },
      data: {
        nombre_empresa: data.nombre_empresa,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        tiempo_entrega_dias: data.tiempo_entrega_dias,
        contacto: data.contacto,
        condiciones_pago: data.condiciones_pago,
      },
    });
    return NextResponse.json(proveedorActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { proveedor_id } = await req.json();
    const proveedorEliminado = await prisma.proveedores.delete({
      where: { proveedor_id },
    });
    return NextResponse.json(proveedorEliminado, { status: 200 });
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
