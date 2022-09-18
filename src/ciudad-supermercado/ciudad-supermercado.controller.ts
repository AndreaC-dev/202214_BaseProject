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
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { SupermercadoDto } from '../supermercado/supermercado.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(
    private readonly ciudadSupermercadoService: CiudadSupermercadoService,
  ) {}

  @Post(':ciudadId/supermarkets/:supermercadoId')
  async addSupermarketToCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.addSupermarketToCity(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':ciudadId/supermarkets/:supermercadoId')
  async findSupermarketFromCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.findSupermarketFromCity(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':ciudadId/supermarkets')
  async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadSupermercadoService.findSupermarketsFromCity(
      ciudadId,
    );
  }

  @Put(':ciudadId/supermarkets')
  async updateSupermarketsFromCitye(
    @Body() supermercadoDto: SupermercadoDto[],
    @Param('ciudadId') ciudadId: string,
  ) {
    const supermarkets = plainToInstance(SupermercadoEntity, supermercadoDto);
    return await this.ciudadSupermercadoService.updateSupermarketsFromCity(
      ciudadId,
      supermarkets,
    );
  }

  @Delete(':ciudadId/supermarkets/:supermercadoId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.deleteSupermarketFromCity(
      ciudadId,
      supermercadoId,
    );
  }
}
