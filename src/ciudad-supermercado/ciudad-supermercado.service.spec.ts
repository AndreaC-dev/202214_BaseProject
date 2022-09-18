import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let city: CiudadEntity;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          nombre: faker.random.alpha(11),
          longitud: faker.address.longitude(),
          latitud: faker.address.latitude(),
          pagWeb: faker.internet.url(),
        });
      supermercadosList.push(supermercado);
    }

    city = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: 'Argentina',
      numHabitantes: Math.floor(Math.random() * 1000000),
      supermercados: supermercadosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an supermercado to a city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });

    const newCity: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: 'Argentina',
      numHabitantes: Math.floor(Math.random() * 1000000),
    });

    const result: CiudadEntity = await service.addSupermarketToCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermarket.nombre);
    expect(result.supermercados[0].longitud).toBe(newSupermarket.longitud);
    expect(result.supermercados[0].latitud).toBe(newSupermarket.latitud);
    expect(result.supermercados[0].pagWeb).toBe(newSupermarket.pagWeb);
  });

  it('addSupermarketToCity should thrown exception for an invalid supermercado', async () => {
    const newCity: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: 'Argentina',
      numHabitantes: Math.floor(Math.random() * 1000000),
    });

    await expect(() =>
      service.addSupermarketToCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id no ha sido encontrado',
    );
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });

    await expect(() =>
      service.addSupermarketToCity('0', newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('findSupermarketFromCity should return supermercado by city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermarket: SupermercadoEntity =
      await service.findSupermarketFromCity(city.id, supermercado.id);
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toBe(supermercado.nombre);
    expect(storedSupermarket.longitud).toEqual(supermercado.longitud);
    expect(storedSupermarket.latitud).toEqual(supermercado.latitud);
    expect(storedSupermarket.pagWeb).toEqual(supermercado.pagWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermercado', async () => {
    await expect(() =>
      service.findSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id no ha sido encontrado',
    );
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('findSupermarketFromCity should throw an exception for an supermercado not associated to the city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });

    await expect(() =>
      service.findSupermarketFromCity(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id enviado no está asociado a la ciudad',
    );
  });

  it('findSupermarketsFromCity should return supermercados by city', async () => {
    const supermercados: SupermercadoEntity[] =
      await service.findSupermarketsFromCity(city.id);
    expect(supermercados.length).toBe(5);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('updateSupermarketsFromCity should update supermercados list for a city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });

    const updatedCity: CiudadEntity = await service.updateSupermarketsFromCity(
      city.id,
      [newSupermarket],
    );
    expect(updatedCity.supermercados.length).toBe(1);

    expect(updatedCity.supermercados[0].nombre).toBe(newSupermarket.nombre);
    expect(updatedCity.supermercados[0].longitud).toEqual(
      newSupermarket.longitud,
    );
    expect(updatedCity.supermercados[0].latitud).toEqual(
      newSupermarket.latitud,
    );
    expect(updatedCity.supermercados[0].pagWeb).toEqual(newSupermarket.pagWeb);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });

    await expect(() =>
      service.updateSupermarketsFromCity('0', [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermercado', async () => {
    const newSupermarket: SupermercadoEntity = supermercadosList[0];
    newSupermarket.id = '0';

    await expect(() =>
      service.updateSupermarketsFromCity(city.id, [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id no ha sido encontrado',
    );
  });

  it('deleteSupermarketFromCity should remove an supermercado from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.deleteSupermarketFromCity(city.id, supermercado.id);
    const storedCity: CiudadEntity = await ciudadRepository.findOne({
      where: { id: `${city.id}` },
      relations: ['supermercados'],
    });
    const deletedRestaurant: SupermercadoEntity = storedCity.supermercados.find(
      (a) => a.id === supermercado.id,
    );

    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermercado', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id no ha sido encontrado',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated supermercado', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.random.alpha(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
      });

    await expect(() =>
      service.deleteSupermarketFromCity(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'El supermercado con el id enviado no está asociado a la ciudad',
    );
  });
});
