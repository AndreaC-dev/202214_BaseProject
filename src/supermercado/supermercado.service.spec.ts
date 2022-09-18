import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';

describe('SupermercadoService', () => {
  let service: SupermercadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
