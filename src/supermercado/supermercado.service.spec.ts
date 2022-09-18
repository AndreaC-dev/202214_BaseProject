import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });
      supermercadosList.push(supermercado);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      storedSupermarket.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermarket.nombre);
    expect(supermercado.longitud).toEqual(storedSupermarket.longitud);
    expect(supermercado.latitud).toEqual(storedSupermarket.latitud);
    expect(supermercado.pagWeb).toEqual(storedSupermarket.pagWeb);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El supermercado con el id enviado no fue encontrado',
    );
  });

  it('create should return a new supermarket', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.random.alpha(11),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url(),
      ciudades: [],
    };

    const newSupermarket: SupermercadoEntity = await service.create(
      supermercado,
    );
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket: SupermercadoEntity = await repository.findOne({
      where: { id: `${newSupermarket.id}` },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toEqual(newSupermarket.nombre);
    expect(storedSupermarket.longitud).toEqual(newSupermarket.longitud);
    expect(storedSupermarket.latitud).toEqual(newSupermarket.latitud);
    expect(storedSupermarket.pagWeb).toEqual(newSupermarket.pagWeb);
  });

  it('create should throw an exception for an invalid name', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.random.alpha(10),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url(),
      ciudades: [],
    };
    await expect(() => service.create(supermercado)).rejects.toHaveProperty(
      'message',
      'El nombre del supermercado debe tener más de 10 caracteres',
    );
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermercadosList[0];
    supermarket.nombre = faker.random.alpha(11);
    supermarket.longitud = faker.address.longitude();
    supermarket.latitud = faker.address.latitude();
    supermarket.pagWeb = faker.internet.url();
    const updatedSupermarket: SupermercadoEntity = await service.update(
      supermarket.id,
      supermarket,
    );
    expect(updatedSupermarket).not.toBeNull();
    const storedSupermarket: SupermercadoEntity = await repository.findOne({
      where: { id: `${supermarket.id}` },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toEqual(supermarket.nombre);
    expect(storedSupermarket.longitud).toEqual(supermarket.longitud);
    expect(storedSupermarket.latitud).toEqual(supermarket.latitud);
    expect(storedSupermarket.pagWeb).toEqual(supermarket.pagWeb);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermercadoEntity = supermercadosList[0];
    supermarket = {
      ...supermarket,
      nombre: faker.random.alpha(11),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url(),
    };
    await expect(() => service.update('0', supermarket)).rejects.toHaveProperty(
      'message',
      'El supermercado con el id enviado no fue encontrado',
    );
  });

  it('update should throw an exception for an an invalid name', async () => {
    let supermarket: SupermercadoEntity = supermercadosList[0];
    supermarket = {
      ...supermarket,
      nombre: faker.random.alpha(9),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url(),
    };
    await expect(() => service.update('0', supermarket)).rejects.toHaveProperty(
      'message',
      'El nombre del supermercado debe tener más de 10 caracteres',
    );
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket: SupermercadoEntity = await repository.findOne({
      where: { id: `${supermarket.id}` },
    });
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermarket.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El supermercado con el id enviado no fue encontrado',
    );
  });
});
