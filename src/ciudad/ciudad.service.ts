import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({
      relations: ['supermercados'],
    });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermercados'],
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    const paisData = `${ciudad.pais}`;
    this.paisInList(paisData);
    const nombreData = `${ciudad.nombre}`;
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { nombre: nombreData },
    });
    if (persistedCiudad) return persistedCiudad;
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const paisData = `${ciudad.pais}`;
    this.paisInList(paisData);
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!persistedCiudad)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    ciudad.id = id;
    return await this.ciudadRepository.save(ciudad);
  }

  async delete(id: string): Promise<void> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el id enviado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    await this.ciudadRepository.remove(ciudad);
  }
  paisInList(nombre: string): void {
    const listaPaises = ['Argentina', 'Ecuador', 'Paraguay'];
    if (!listaPaises.includes(nombre))
      throw new BusinessLogicException(
        'La ciudad no pertenece a la lista de paises',
        BusinessError.NOT_FOUND,
      );
  }
}
