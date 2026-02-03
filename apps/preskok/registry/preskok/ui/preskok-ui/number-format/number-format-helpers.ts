import type { NumericFormatProps } from "react-number-format"

import type {
  Locale,
  LocaleToBcp47Map,
} from "@/registry/preskok/ui/preskok-ui/locale-context/locale-helpers"
import {
  DEFAULT_INVALID_NUMBER_TEXT,
  DEFAULT_LOCALE,
  DEFAULT_NUMBER_OF_DECIMALS,
  DEFAULT_NUMERIC_FORMAT_OPTIONS,
  LOCALE_TO_BCP_47_MAP,
  LOCALE_TO_NUMERIC_FORMAT_OPTIONS_MAP,
} from "@/registry/preskok/ui/preskok-ui/locale-context/locale-helpers"

/**
 * isNumberValid will check whether the passed value is a number. It leverages the Number.isFinite method which is the
 * most consistent way to check whether a value is a number. Edge cases are handled correctly, thus NaN, undefined, null
 * and Infinity are not considered numbers.
 *
 * @param {IsNumberValidAllowedTypes} value -> The value to be checked
 * @returns {boolean}
 */
export const isNumberValid = (value: IsNumberValidAllowedTypes): boolean => {
  return Number.isFinite(value)
}

/**
 * convertStringToNumber will attempt to convert a string to a number. If the conversion is successful, the function will return the converted number. If the conversion is not
 * successful, the function will return null.
 *
 * @param {string} value -> string value to be converted to a number
 * @returns {number | null}
 */
export const convertStringToNumber = (value: string): number | null => {
  const convertedStringValue = Number(value)

  return isNumberValid(convertedStringValue) ? convertedStringValue : null
}

/**
 * numberIsInteger will check whether the passed number is an integer and not a float.
 *
 * @param {number} value -> The value to be checked
 * @returns {boolean}
 */
export const numberIsInteger = (value: number): boolean => {
  return Number.isInteger(value)
}

/**
 * numberIsPositive will check whether the passed number is positive.
 *
 * @param {number} value -> The value to be checked
 * @returns {boolean}
 */
export const numberIsPositive = (value: number): boolean => {
  return value >= 0
}

/**
 * @description convertLocaleToBcp47 will convert a locale to BCP 47 format. If the locale is not found in the LOCALE_TO_BCP_47_MAP, the function will return an empty string.
 *
 * @param {Locale} locale -> The locale to be converted to BCP 47 format
 * @returns {string} - either bcp 47 locale or empty string
 */
export const convertLocaleToBcp47 = (locale: Locale): LocaleToBcp47Map => {
  const bcp47Map = LOCALE_TO_BCP_47_MAP

  return bcp47Map[locale]
}

/**
 * @description convertLocaleToNumericProps will convert a locale to numeric format options. If the locale is not found in the LOCALE_TO_NUMERIC_FORMAT_OPTIONS_MAP, the function will return
 * DEFAULT_NUMERIC_FORMAT_OPTIONS.
 *
 * @param {`${Locale}`} locale -> The locale to be converted to numeric format options
 * @returns {NumericFormatProps}
 */
export const convertLocaleToNumericProps = (
  locale: Locale
): NumericFormatProps => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    LOCALE_TO_NUMERIC_FORMAT_OPTIONS_MAP[locale] ??
    DEFAULT_NUMERIC_FORMAT_OPTIONS
  )
}

/**
 * processId will attempt to convert a string to a number and then check whether the number is valid and positive. This function is used to process the id parameter anywhere
 * in the code. Explanation: for historic reasons we are oftentimes receiving a string as an id parameter. This function will attempt to convert the string to a number and then
 * evaluate whether the number is valid, positive and is not a float, thus reflecting the fact that we are dealing with an id. If the id is valid, the function will return an
 * object containing the value of the id and a boolean indicating that the id is valid.
 *
 * @param {IsNumberValidAllowedTypes} value -> The value to be processed
 * @returns {ProcessNumberReturnObj}
 */
export const processId = (
  value: IsNumberValidAllowedTypes
): ProcessNumberReturnObj => {
  const processNumberResult: ProcessNumberReturnObj = {
    isNumberValid: false,
    value: null,
  }

  /**
   * First we attempt to convert string to a number. If the value is not a string, we will simply use the value as is.
   */
  const attemptConversion =
    typeof value === "string" ? convertStringToNumber(value) : value

  /**
   * We check whether the value is a number and whether it is positive and an integer. If all of these conditions are met, we will return the value as a number.
   *
   * IMPORTANT: we are casting the passed value as number, because in theory the 'isNumberValid' will only be truthy if the value is an actual number. However, TypeScript
   * is not able to infer that the value is a number, thus we need to cast it as number in the numberIsInteger and numberIsPositive functions. If another check would be added then
   * extra caution needs to be exercised as it might break the logic!
   */
  const isIdValid =
    isNumberValid(attemptConversion) &&
    numberIsInteger(attemptConversion!) &&
    numberIsPositive(attemptConversion!)

  if (isIdValid) {
    processNumberResult.isNumberValid = true
    processNumberResult.value = attemptConversion!
  }

  return processNumberResult
}

/**
 * @description formatNumberToString will format a number to a string. If the number is not valid, the function will return the default invalidNumberText string. Please
 * note this function is meant to display numbers to the end user and will take locale and Intl.NumberFormatOptions into account (if any passed).
 *
 * Locale will default to 'sl' if not passed.
 *
 * In case the number is not valid (not finite) then a default invalidNumberText will be returned. Developers can further customize any of this via options object (not required).
 *
 * @param value -> The number value to be formatted
 * @param options -> The options object (FormatNumberToStringOptions)
 * @returns {FormatNumberToStringReturnType} -> an object containing data regarding validity of number and the formatted number as string. There is also an option to retrieve a fallback text / value.
 */
export const formatNumberToString: FormatNumberToStringFnSignature = (
  value: number,
  options?: FormatNumberToStringOptions
): FormatNumberToStringReturnType => {
  const isValid = isNumberValid(value)

  /**
   * The end result of the function. We will return this object.
   */
  const formattedNumberResult: FormatNumberToStringReturnType = {
    value: null,
    isValid,
  }

  /**
   * We will merge the passed options with the default options. This will ensure that the developer can override any of the default options.
   */
  const defaultOptionsMerge: FormatNumberToStringOptions = {
    locale: DEFAULT_LOCALE,
    invalidNumberText: DEFAULT_INVALID_NUMBER_TEXT,
    intlOptions: {
      minimumFractionDigits: DEFAULT_NUMBER_OF_DECIMALS,
      maximumFractionDigits: DEFAULT_NUMBER_OF_DECIMALS,
    },
    ...options,
  }

  const { locale, intlOptions, invalidNumberText } = defaultOptionsMerge

  /**
   * Copy the invalid number text to the output object (in case developer provided custom version)
   */
  if (invalidNumberText) {
    formattedNumberResult.invalidNumberText = invalidNumberText
  }

  /**
   * Perform formatting only if the number is valid and locale is provided.
   */
  if (isValid && locale) {
    const mappedLocale = convertLocaleToBcp47(locale)

    if (mappedLocale) {
      formattedNumberResult.value = value.toLocaleString(
        mappedLocale,
        intlOptions
      )
    }
  }

  return formattedNumberResult
}

export type IsNumberValidAllowedTypes = string | number | null | undefined

export interface ProcessNumberReturnObj {
  isNumberValid: boolean
  value: number | null
}

export interface FormatNumberToStringOptions {
  locale?: Locale
  intlOptions?: Intl.NumberFormatOptions
  invalidNumberText?: string
}

export type FormatNumberToStringFnSignature = (
  value: number,
  options?: FormatNumberToStringOptions
) => FormatNumberToStringReturnType

export interface FormatNumberToStringReturnType extends Pick<
  FormatNumberToStringOptions,
  "invalidNumberText"
> {
  isValid: boolean
  value: string | null
}
