-- CreateEnum
CREATE TYPE "rol" AS ENUM ('ADMINISTRADOR', 'SUPERVISOR', 'OPERADOR', 'ALMACEN');

-- CreateEnum
CREATE TYPE "estado" AS ENUM ('EN_PROCESO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "unidad_medida" AS ENUM ('KG', 'M', 'PIEZAS', 'L');

-- CreateTable
CREATE TABLE "usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "rol" "rol" NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "ordenes_produccion" (
    "orden_id" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "estado" "estado" NOT NULL,
    "cantidad_producida" INTEGER NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "responsable_id" INTEGER NOT NULL,

    CONSTRAINT "ordenes_produccion_pkey" PRIMARY KEY ("orden_id")
);

-- CreateTable
CREATE TABLE "inventario" (
    "inventario_id" SERIAL NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "inventario_pkey" PRIMARY KEY ("inventario_id")
);

-- CreateTable
CREATE TABLE "materias_primas" (
    "materia_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidad_medida" "unidad_medida" NOT NULL,
    "cantidad_disponible" DECIMAL(65,30) NOT NULL,
    "costo_unitario" DOUBLE PRECISION NOT NULL,
    "provedor_id" INTEGER NOT NULL,

    CONSTRAINT "materias_primas_pkey" PRIMARY KEY ("materia_id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "proveedor_id" SERIAL NOT NULL,
    "nombre_empresa" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("proveedor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "materias_primas"("materia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "materias_primas"("materia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materias_primas" ADD CONSTRAINT "materias_primas_provedor_id_fkey" FOREIGN KEY ("provedor_id") REFERENCES "proveedores"("proveedor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
