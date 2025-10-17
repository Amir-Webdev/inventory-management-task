export function classify(totalQuantity: number, reorderPoint: number) {
  if (totalQuantity === 0) return "critical" as const;
  if (totalQuantity < reorderPoint) return "low" as const;
  if (totalQuantity <= reorderPoint * 2) return "adequate" as const;
  return "overstock" as const;
}
