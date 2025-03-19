import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { nombre, apellidos, email, contrasenia, rol } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const newUser = await prisma.usuarios.create({
      data: {
        nombre,
        apellidos,
        email,
        contrasenia: hashedPassword,
        rol,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
  }
}
