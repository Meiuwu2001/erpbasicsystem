/*
  Warnings:

  - Added the required column `stock_maximo` to the `inventario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_minimo` to the `inventario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condiciones_pago` to the `proveedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiempo_entrega_dias` to the `proveedores` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipo_movimiento" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE');

-- AlterTable
ALTER TABLE "inventario" ADD COLUMN     "stock_maximo" INTEGER NOT NULL,
ADD COLUMN     "stock_minimo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "proveedores" ADD COLUMN     "condiciones_pago" TEXT NOT NULL,
ADD COLUMN     "tiempo_entrega_dias" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "detalles_ordenes_produccion" (
    "detalle_id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costo_unitario" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "detalles_ordenes_produccion_pkey" PRIMARY KEY ("detalle_id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "movimiento_id" SERIAL NOT NULL,
    "inventario_id" INTEGER NOT NULL,
    "tipo_movimiento" "tipo_movimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha_movimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referencia" TEXT NOT NULL,
    "usuario_responsable" INTEGER NOT NULL,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("movimiento_id")
);

-- CreateTable
CREATE TABLE "lotes" (
    "lote_id" SERIAL NOT NULL,
    "inventario_id" INTEGER NOT NULL,
    "fecha_caducidad" TIMESTAMP(3) NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("lote_id")
);

-- AddForeignKey
ALTER TABLE "detalles_ordenes_produccion" ADD CONSTRAINT "detalles_ordenes_produccion_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes_produccion"("orden_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_ordenes_produccion" ADD CONSTRAINT "detalles_ordenes_produccion_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "materias_primas"("materia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_inventario_id_fkey" FOREIGN KEY ("inventario_id") REFERENCES "inventario"("inventario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_usuario_responsable_fkey" FOREIGN KEY ("usuario_responsable") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotes" ADD CONSTRAINT "lotes_inventario_id_fkey" FOREIGN KEY ("inventario_id") REFERENCES "inventario"("inventario_id") ON DELETE RESTRICT ON UPDATE CASCADE;
