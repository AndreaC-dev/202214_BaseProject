import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly ciudadService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':supermercadoId')
  async findOne(@Param('supermercadoId') supermercadoId: string) {
    return await this.ciudadService.findOne(supermercadoId);
  }

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.ciudadService.create(supermercado);
  }

  @Put(':supermercadoId')
  async update(
    @Param('supermercadoId') supermercadoId: string,
    @Body() supermercadoDto: SupermercadoDto,
  ) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.ciudadService.update(supermercadoId, supermercado);
  }

  @Delete(':supermercadoId')
  @HttpCode(204)
  async delete(@Param('supermercadoId') supermercadoId: string) {
    return await this.ciudadService.delete(supermercadoId);
  }
}
