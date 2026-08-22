import { Test, TestingModule } from '@nestjs/testing';
import { ParoquiasService } from './paroquias.service';

describe('ParoquiasService', () => {
  let service: ParoquiasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParoquiasService],
    }).compile();

    service = module.get<ParoquiasService>(ParoquiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
