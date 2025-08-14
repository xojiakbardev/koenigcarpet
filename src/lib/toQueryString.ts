export function toQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => [key, v])
        : [[key, value]]
    )
  );

  return searchParams.toString();
}
