export function formatDecodedResult(result: unknown): string {
  if (typeof result === "bigint") {
    return result.toString();
  }
  if (Array.isArray(result)) {
    return JSON.stringify(
      result,
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    );
  }
  if (typeof result === "object" && result !== null) {
    return JSON.stringify(
      result,
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    );
  }
  return String(result);
}
