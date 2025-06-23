import type { NumericFormatProps } from "react-number-format"

export const Locale = {
  DE: "de",
  EN: "en",
  FR: "fr",
  IT: "it",
  HR: "hr",
  SL: "sl",
} as const

export type Locale = (typeof Locale)[keyof typeof Locale]

export const LocaleToBcp47Map = {
  de: "de-DE",
  en: "en-EN",
  fr: "fr-FR",
  it: "it-IT",
  hr: "hr-HR",
  sl: "sl-SL",
} as const

export type LocaleToBcp47Map =
  (typeof LocaleToBcp47Map)[keyof typeof LocaleToBcp47Map]

export const CurrencyCodeAndSymbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
} as const

export type CurrencyCodeAndSymbolMap =
  (typeof CurrencyCodeAndSymbolMap)[keyof typeof CurrencyCodeAndSymbolMap]

export const Bcp47CountryLanguageCodeToCurrencyCodeMap = {
  "en-US": "USD",
  "en-GB": "GBP",
  "en-EN": "EUR",
  "de-DE": "EUR",
  "de-AT": "EUR",
  "de-CH": "EUR",
  "el-GR": "EUR",
  "en-IE": "EUR",
  "fr-FR": "EUR",
  "it-IT": "EUR",
  "es-ES": "EUR",
  "pt-PT": "EUR",
  "sk-SK": "EUR",
  "sv-SE": "EUR",
  "da-DK": "EUR",
  "fi-FI": "EUR",
  "cs-CZ": "EUR",
  "it-CH": "EUR",
  "nl-NL": "EUR",
  "hu-HU": "EUR",
  "fr-BE": "EUR",
  "nl-BE": "EUR",
} as const

export type Bcp47CountryLanguageCodeToCurrencyCodeMap =
  (typeof Bcp47CountryLanguageCodeToCurrencyCodeMap)[keyof typeof Bcp47CountryLanguageCodeToCurrencyCodeMap]

export const DEFAULT_LOCALE = Locale.SL
export const DEFAULT_NUMBER_OF_DECIMALS = 2
export const DEFAULT_INVALID_NUMBER_TEXT = "Invalid number"
export const MAXIMUM_NUMBER_OF_DIGITS_ALLOWED = 12

export const LOCALE_TO_BCP_47_MAP: Record<Locale, LocaleToBcp47Map> = {
  de: "de-DE",
  en: "en-EN",
  fr: "fr-FR",
  it: "it-IT",
  hr: "hr-HR",
  sl: "sl-SL",
}

export const DEFAULT_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  displayType: "text",
  thousandSeparator: ".",
  decimalSeparator: ",",
  allowNegative: true,
  decimalScale: DEFAULT_NUMBER_OF_DECIMALS,
}

export const SLOVENE_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...DEFAULT_NUMERIC_FORMAT_OPTIONS,
  thousandSeparator: ".",
  decimalSeparator: ",",
}

export const GERMAN_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...SLOVENE_NUMERIC_FORMAT_OPTIONS,
}

export const ITALIAN_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...SLOVENE_NUMERIC_FORMAT_OPTIONS,
}

export const CROATIAN_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...SLOVENE_NUMERIC_FORMAT_OPTIONS,
}

export const FRENCH_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...DEFAULT_NUMERIC_FORMAT_OPTIONS,
  thousandSeparator: " ",
  decimalSeparator: ",",
}

export const ENGLISH_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...DEFAULT_NUMERIC_FORMAT_OPTIONS,
  thousandSeparator: ",",
  decimalSeparator: ".",
}

export const LOCALE_TO_NUMERIC_FORMAT_OPTIONS_MAP: Record<
  Locale,
  NumericFormatProps
> = {
  de: GERMAN_NUMERIC_FORMAT_OPTIONS,
  en: ENGLISH_NUMERIC_FORMAT_OPTIONS,
  fr: FRENCH_NUMERIC_FORMAT_OPTIONS,
  it: ITALIAN_NUMERIC_FORMAT_OPTIONS,
  hr: CROATIAN_NUMERIC_FORMAT_OPTIONS,
  sl: SLOVENE_NUMERIC_FORMAT_OPTIONS,
}
