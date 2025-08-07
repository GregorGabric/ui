import { CurrencyCodeAndSymbolMap } from "../locale-context/locale-helpers"

type CurrencyCodeOrSymbolExpectedOutputOptions =
  | "currency_code"
  | "currency_symbol"

interface GetCurrencyCodeOrSymbolParams {
  inputValue: string
  expectedOutput?: CurrencyCodeOrSymbolExpectedOutputOptions
}

/**
 * getCurrencyCodeOrSymbol is a helper function to get currency code or symbol from a string value. If no match is found
 * we return an empty string.
 *
 * @param {string} inputValue -> string value that might be a currency code or symbol.
 * @param {'currency_code' | 'currency_symbol'} expectedOutput -> optional expected output type (default: 'currency_code').
 * @returns {string} - currency code or symbol or an empty string if no match is found
 */
export const getCurrencyCodeOrSymbol = ({
  inputValue,
  expectedOutput = "currency_code",
}: GetCurrencyCodeOrSymbolParams): string => {
  let currencyCodeOrSymbolStringValue = ""
  const trimmedAndLowerCaseInput = inputValue.trim().toLowerCase()

  const currencyCodeOrSymbolLookup = Object.keys(CurrencyCodeAndSymbolMap).find(
    (key) =>
      key.toLowerCase() === trimmedAndLowerCaseInput ||
      CurrencyCodeAndSymbolMap[
        key as keyof typeof CurrencyCodeAndSymbolMap
      ].toLowerCase() === trimmedAndLowerCaseInput
  )

  if (currencyCodeOrSymbolLookup) {
    if (expectedOutput === "currency_code") {
      currencyCodeOrSymbolStringValue = currencyCodeOrSymbolLookup
    } else {
      currencyCodeOrSymbolStringValue =
        CurrencyCodeAndSymbolMap[
          currencyCodeOrSymbolLookup as keyof typeof CurrencyCodeAndSymbolMap
        ]
    }
  }

  return currencyCodeOrSymbolStringValue
}
