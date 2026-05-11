export async function runOptimisticStageChange<T>(options: {
  applyOptimistic: () => void;
  rollback: () => void;
  persist: () => Promise<void>;
  refetch: () => Promise<T>;
  onSuccess: (data: T) => void;
  onFailure: (error: Error) => void;
}): Promise<void> {
  options.applyOptimistic();
  try {
    await options.persist();
    const data = await options.refetch();
    options.onSuccess(data);
  } catch (e) {
    options.rollback();
    options.onFailure(e instanceof Error ? e : new Error(String(e)));
  }
}
