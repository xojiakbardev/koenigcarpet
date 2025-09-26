import { ILocalizedField } from "@/types/product"

export function normalizeValue(field: ILocalizedField): ILocalizedField {
  if (!field?.en) return field
  return {
    ...field,
    value: field.en.toLowerCase().replace(/\s+/g, "-"),
  }
}
