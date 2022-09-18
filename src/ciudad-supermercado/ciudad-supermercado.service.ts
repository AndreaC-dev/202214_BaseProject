import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async addSupermarketToCity(
    cityId: string,
    supermarketId: string,
  ): Promise<CiudadEntity> {
    const supermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: `${supermarketId}` },
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'El supermercado con el id no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${cityId}` },
      relations: ['supermercados'],
    });
    if (!city)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    city.supermercados = [...city.supermercados, supermarket];
    return await this.ciudadRepository.save(city);
  }

  async findSupermarketsFromCity(
    cityId: string,
  ): Promise<SupermercadoEntity[]> {
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${cityId}` },
      relations: ['supermercados'],
    });
    if (!city)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return city.supermercados;
  }

  async findSupermarketFromCity(
    cityId: string,
    supermarketId: string,
  ): Promise<SupermercadoEntity> {
    const supermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: `${supermarketId}` },
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'El supermercado con el id no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${cityId}` },
      relations: ['supermercados'],
    });
    if (!city)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const citySupermarket: SupermercadoEntity = city.supermercados.find(
      (e) => e.id === supermarket.id,
    );

    if (!citySupermarket)
      throw new BusinessLogicException(
        'El supermercado con el id enviado no está asociado a la ciudad',
        BusinessError.PRECONDITION_FAILED,
      );

    return citySupermarket;
  }

  async updateSupermarketsFromCity(
    cityId: string,
    supermarkets: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${cityId}` },
      relations: ['supermercados'],
    });

    if (!city)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    for (const supermarketData of supermarkets) {
      const supermarket: SupermercadoEntity =
        await this.supermercadoRepository.findOne({
          where: { id: `${supermarketData.id}` },
        });
      if (!supermarket)
        throw new BusinessLogicException(
          'El supermercado con el id no ha sido encontrado',
          BusinessError.NOT_FOUND,
        );
    }

    city.supermercados = supermarkets;
    return await this.ciudadRepository.save(city);
  }

  async deleteSupermarketFromCity(cityId: string, supermarketId: string) {
    await this.findSupermarketFromCity(cityId, supermarketId);
    const numero = cityId;
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${numero}` },
      relations: ['supermercados'],
    });
    city.supermercados = city.supermercados.filter(
      (e) => e.id !== supermarketId,
    );
    await this.ciudadRepository.save(city);
  }
}
