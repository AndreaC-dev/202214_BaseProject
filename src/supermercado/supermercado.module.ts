import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';

@Module({
  providers: [SupermercadoService]
})
export class SupermercadoModule {}
