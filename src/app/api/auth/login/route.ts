import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY as string;

export async function POST(req: NextRequest) {
  const { email, contrasenia } = await req.json();

  try {
    const user = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(contrasenia, user.contrasenia))) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    if (!secretKey) {
      return NextResponse.json({ error: 'La clave secreta no está definida' }, { status: 500 });
    }

    const token = jwt.sign({ userId: user.usuario_id, rol: user.rol, email: user.email, nombre: user.nombre, apellidos: user.apellidos }, secretKey, {
      expiresIn: '1h',
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
