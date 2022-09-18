import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({
      relations: ['supermercados'],
    });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'El supermercado con el id enviado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return supermercado;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    this.validateNombre(supermercado.nombre);
    const nombreData = `${supermercado.nombre}`;
    const persistedSupermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { nombre: nombreData },
      });
    if (persistedSupermercado) return persistedSupermercado;
    return await this.supermercadoRepository.save(supermercado);
  }

  async update(
    id: string,
    supermercado: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    this.validateNombre(supermercado.nombre);
    const persistedSupermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!persistedSupermercado)
      throw new BusinessLogicException(
        'El supermercado con el id enviado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    supermercado.id = id;
    return await this.supermercadoRepository.save(supermercado);
  }

  async delete(id: string): Promise<void> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'El supermercado con el id enviado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.supermercadoRepository.remove(supermercado);
  }

  validateNombre(nombre: string): void {
    if (nombre.length <= 10)
      throw new BusinessLogicException(
        'El nombre del supermercado debe tener más de 10 caracteres',
        BusinessError.NOT_FOUND,
      );
  }
}
