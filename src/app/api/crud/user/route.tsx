import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.usuarios.findMany({
      select: {
        usuario_id: true,
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los usuarios" },
      { status: 500 }
    );
  }
}
export async function GET_ONE(req: NextRequest) {
  const usuario_id = req.nextUrl.searchParams.get("usuario_id");
  try {
    const user = await prisma.usuarios.findUnique({
      where: { usuario_id: Number(usuario_id) },
      select: {
        usuario_id: true,
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { email, contrasenia, nombre, apellidos, rol } = await req.json();

  try {
    const usuario_id = req.nextUrl.searchParams.get("usuario_id");

    // Busca el usuario actual antes de intentar actualizarlo
    const userToUpdate = await prisma.usuarios.findUnique({
      where: { usuario_id: Number(usuario_id) },
    });

    // Si la contraseña está vacía, no la modificamos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {
      email,
      nombre,
      apellidos,
      rol,
    };

    // Si la contraseña no está vacía, la hasheamos y la actualizamos
    if (contrasenia) {
      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      updatedData.contrasenia = hashedPassword;
    } else {
      // Si la contraseña no se pasa, mantenemos la contraseña original
      updatedData.contrasenia = userToUpdate?.contrasenia;
    }

    // Actualizamos al usuario con los datos proporcionados
    const user = await prisma.usuarios.update({
      where: { usuario_id: Number(usuario_id) },
      data: updatedData,
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const usuario_id = req.nextUrl.searchParams.get("usuario_id");

    if (!usuario_id) {
      return NextResponse.json(
        { error: "Falta el usuario_id" },
        { status: 400 }
      );
    }

    await prisma.usuarios.delete({
      where: { usuario_id: Number(usuario_id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error(error);

    // Verificamos si el error es una instancia de PrismaClientKnownRequestError
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}

// export const requestBodies = {
//   POST: {
//     email: "test@example.com",
//     contrasenia: "password123",
//     nombre: "John",
//     apellidos: "Doe",
//     rol: "admin",
//   },
//   PUT: {
//     usuario_id: 1,
//     email: "updated@example.com",
//     contrasenia: "newpassword123",
//     nombre: "John Updated",
//     apellidos: "Doe Updated",
//     rol: "user",
//   },
//   DELETE: {
//     usuario_id: 1,
//   },
// };
