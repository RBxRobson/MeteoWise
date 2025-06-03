import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatCapitalizedDate(date: string) {
  const parsed = parseISO(date)
  const formatted = format(parsed, "EEEE, d 'de' MMMM", { locale: ptBR })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
