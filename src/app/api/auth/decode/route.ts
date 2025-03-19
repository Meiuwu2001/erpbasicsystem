import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY as string;

export async function POST(req: Request) {
  // Obtener el encabezado Authorization
  const authorizationHeader = req.headers.get('Authorization');
  
  if (!authorizationHeader) {
    return NextResponse.json({ error: 'No se proporcionó el encabezado Authorization' }, { status: 400 });
  }

  // Extraer el token del encabezado Authorization (formato: "Bearer <token>")
  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token no encontrado en el encabezado Authorization' }, { status: 400 });
  }

  try {
    if (!secretKey) {
      return NextResponse.json({ error: 'La clave secreta no está definida' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secretKey);
    return NextResponse.json({ decoded }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
