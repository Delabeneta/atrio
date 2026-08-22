import { Test, TestingModule } from '@nestjs/testing';
import { ParoquiasController } from './paroquias.controller';

describe('ParoquiasController', () => {
  let controller: ParoquiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParoquiasController],
    }).compile();

    controller = module.get<ParoquiasController>(ParoquiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
