import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController]
})
export class CiudadSupermercadoModule {}
