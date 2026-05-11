import { runOptimisticStageChange } from './persistStageChange';

describe('runOptimisticStageChange', () => {
  it('applies optimistic, persists, refetches, and calls onSuccess', async () => {
    const order: string[] = [];
    await runOptimisticStageChange({
      applyOptimistic: () => order.push('opt'),
      rollback: () => order.push('rollback'),
      persist: async () => {
        order.push('persist');
      },
      refetch: async () => {
        order.push('refetch');
        return { ok: true };
      },
      onSuccess: () => order.push('success'),
      onFailure: () => order.push('fail'),
    });
    expect(order).toEqual(['opt', 'persist', 'refetch', 'success']);
  });

  it('rolls back and calls onFailure when persist rejects', async () => {
    const order: string[] = [];
    await runOptimisticStageChange<void>({
      applyOptimistic: () => order.push('opt'),
      rollback: () => order.push('rollback'),
      persist: async () => {
        throw new Error('network');
      },
      refetch: async () => undefined,
      onSuccess: () => order.push('success'),
      onFailure: (e) => order.push(`fail:${e.message}`),
    });
    expect(order).toEqual(['opt', 'rollback', 'fail:network']);
  });

  it('rolls back when refetch rejects after successful persist', async () => {
    const order: string[] = [];
    await runOptimisticStageChange({
      applyOptimistic: () => order.push('opt'),
      rollback: () => order.push('rollback'),
      persist: async () => {
        order.push('persist');
      },
      refetch: async () => {
        throw new Error('refetch-fail');
      },
      onSuccess: () => order.push('success'),
      onFailure: (e) => order.push(`fail:${e.message}`),
    });
    expect(order).toEqual(['opt', 'persist', 'rollback', 'fail:refetch-fail']);
  });
});
