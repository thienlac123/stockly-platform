import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  const prisma = {
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  } as unknown as PrismaService;
  const controller = new HealthController(prisma);

  it('returns status ok', () => {
    expect(controller.check().status).toBe('ok');
  });

  it('reports database up when the query succeeds', async () => {
    await expect(controller.checkDb()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
  });
});