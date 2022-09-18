import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.company.name(),
        pais: 'Argentina',
        numHabitantes: Math.floor(Math.random() * 1000000),
      });
      ciudadesList.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all citys', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCity.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCity.nombre);
    expect(ciudad.pais).toEqual(storedCity.pais);
    expect(ciudad.numHabitantes).toEqual(storedCity.numHabitantes);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.company.name(),
      pais: 'Ecuador',
      numHabitantes: Math.floor(Math.random() * 1000000),
      supermercados: [],
    };

    const newCity: CiudadEntity = await service.create(ciudad);
    expect(newCity).not.toBeNull();

    const storedCity: CiudadEntity = await repository.findOne({
      where: { id: `${newCity.id}` },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.nombre).toEqual(newCity.nombre);
    expect(storedCity.pais).toEqual(newCity.pais);
    expect(storedCity.numHabitantes).toEqual(newCity.numHabitantes);
  });

  it('create should throw an exception for an invalid country', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.company.name(),
      pais: 'Brasil',
      numHabitantes: Math.floor(Math.random() * 1000000),
      supermercados: [],
    };
    await expect(() => service.create(ciudad)).rejects.toHaveProperty(
      'message',
      'El pais no pertenece a la lista permitida',
    );
  });

  it('update should modify a city', async () => {
    const city: CiudadEntity = ciudadesList[0];
    city.nombre = 'Nuevo nombre';
    city.pais = 'Paraguay';
    city.numHabitantes = Math.floor(Math.random() * 1000000);
    const updatedCity: CiudadEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const storedCity: CiudadEntity = await repository.findOne({
      where: { id: `${city.id}` },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.nombre).toEqual(city.nombre);
    expect(storedCity.pais).toEqual(city.pais);
    expect(storedCity.numHabitantes).toEqual(city.numHabitantes);
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CiudadEntity = ciudadesList[0];
    city = {
      ...city,
      nombre: 'Nuevo nombre',
      pais: 'Paraguay',
      numHabitantes: Math.floor(Math.random() * 1000000),
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });

  it('update should throw an exception for an an invalid country', async () => {
    let city: CiudadEntity = ciudadesList[0];
    city = {
      ...city,
      nombre: 'Nuevo nombre',
      pais: 'Mexico',
      numHabitantes: Math.floor(Math.random() * 1000000),
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'El pais no pertenece a la lista permitida',
    );
  });

  it('delete should remove a city', async () => {
    const city: CiudadEntity = ciudadesList[0];
    await service.delete(city.id);
    const deletedCity: CiudadEntity = await repository.findOne({
      where: { id: `${city.id}` },
    });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const city: CiudadEntity = ciudadesList[0];
    await service.delete(city.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La ciudad con el id enviado no fue encontrada',
    );
  });
});
