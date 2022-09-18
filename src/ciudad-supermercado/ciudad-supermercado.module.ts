import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Module({
  providers: [CiudadSupermercadoService]
})
export class CiudadSupermercadoModule {}
