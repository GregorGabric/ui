"use client"

import type { PropsWithChildren } from "react"
import React, { useCallback, useMemo } from "react"
import type { NumericFormatProps } from "react-number-format"

import { createCtx } from "@/registry/preskok/lib/create-ctx"
import { useLocaleContext } from "@/registry/preskok/ui/preskok-ui/locale-context/locale-context"
import { Locale } from "@/registry/preskok/ui/preskok-ui/locale-context/locale-helpers"
import {
  convertLocaleToNumericProps,
  formatNumberToString,
} from "@/registry/preskok/ui/preskok-ui/number-format/number-format-helpers"

const MAXIMUM_NUMBER_OF_DIGITS_ALLOWED = 12

const DEFAULT_NUMBER_OF_DECIMALS = 2

const DEFAULT_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  displayType: "text",
  thousandSeparator: ".",
  decimalSeparator: ",",
  allowNegative: true,
  decimalScale: DEFAULT_NUMBER_OF_DECIMALS,
}

const FRENCH_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...DEFAULT_NUMERIC_FORMAT_OPTIONS,
  thousandSeparator: " ",
  decimalSeparator: ",",
}
const ENGLISH_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...DEFAULT_NUMERIC_FORMAT_OPTIONS,
  thousandSeparator: ",",
  decimalSeparator: ".",
}

const SLOVENE_NUMERIC_FORMAT_OPTIONS: NumericFormatProps = {
  ...DEFAULT_NUMERIC_FORMAT_OPTIONS,
  thousandSeparator: ".",
  decimalSeparator: ",",
}

const DEFAULT_LOCALE = Locale.SL

interface ConvertStringToNumberBasedOnLocaleProps {
  value?: string | null
  forcedLocale?: Locale
}

interface NumberFormatContextProviderProps {
  formatNumberRaw: FormatNumberToStringFnSignature
  withDefaultNumericFormatProps: NumericFormatProps
  convertCustomLocaleToNumericProps: ConvertCustomLocaleToNumericPropsFnSignature
  convertStringToNumber: ({
    value,
    forcedLocale,
  }: ConvertStringToNumberBasedOnLocaleProps) => number | null
  isNumberOutOfRange: (value: number | null) => boolean
}

export const [useNumberFormatContext, NumberFormatContextProvider] =
  createCtx<NumberFormatContextProviderProps>()

export const NumberFormatContext: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { globalLocale } = useLocaleContext()

  /**
   * @description evaluateNumericFormatDefaults will return specific defaults for a given locale.
   */
  const evaluateNumericFormatDefaults = () => {
    switch (globalLocale) {
      case "sl":
      case "de":
      case "it":
      case "hr":
        return {
          ...SLOVENE_NUMERIC_FORMAT_OPTIONS,
        }
      case "fr":
        return {
          ...FRENCH_NUMERIC_FORMAT_OPTIONS,
        }
      case "en":
        return {
          ...ENGLISH_NUMERIC_FORMAT_OPTIONS,
        }
      default:
        return {
          ...SLOVENE_NUMERIC_FORMAT_OPTIONS,
        }
    }
  }

  /**
   * @description formatNumberRaw will format a number to a string - this is just a wrapper around the helper function formatNumberToString. If the number is not valid, the function will return the default invalidNumberText string. Please
   * note this function is meant to display numbers to the end user and will take locale and Intl.NumberFormatOptions into account (if any passed).
   *
   * Locale will default to 'sl' if not passed, otherwise the global locale will be taken into the account.
   *
   * In case the number is not valid (not finite) then a default invalidNumberText will be returned. Developers can further customize any of this via options object (not required).
   *
   * NOTE: This will achieve similar result to what withDefaultNumericFormatProps will forward to the react-number-format component, but this function will return a string instead of a component.
   *
   * @param value -> The number value to be formatted
   * @param options -> The options object (FormatNumberToStringOptions)
   * @returns {string}
   */
  const formatNumberRaw: FormatNumberToStringFnSignature = useCallback(
    (
      value,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      options = { locale: globalLocale || DEFAULT_LOCALE }
    ): FormatNumberToStringReturnType => {
      return formatNumberToString(value, options)
    },
    [globalLocale]
  )

  /**
   * @description convertCustomLocaleToNumericProps is a memoized function that will convert a custom locale to a set of props for the react-number-format component. The goal
   * of this function is to allow developers to get default props based on custom locale (otherwise the NumberFormat component will take global locale into account when using the withDefaultNumericFormatProps).
   *
   * @param {Locale} locale -> The locale to convert to props
   * @returns {NumericFormatProps}
   */
  const convertCustomLocaleToNumericProps = useCallback(
    (locale: Locale): NumericFormatProps => {
      return convertLocaleToNumericProps(locale)
    },
    []
  )

  /**
   * @description withDefaultNumericFormatProps is a memoized function that returns a default set of props for the react-number-format component. It will take
   * current locale into account and return the appropriate props.
   *
   * EXAMPLE usage:
   * <NumberFormat value={123445.44433} />
   *
   * The usage above will spread the default props into the component, but will also allow you to override them with your own props should you need to.
   *
   * VERY IMPORTANT: The 'withDefaultNumericFormatProps' will take global locale into account and cannot be overwritten. If you need to overwrite the locale you will need to provide a different
   * set of props to the component! Please use the `convertCustomLocaleToNumericProps` function available on context.
   *
   * @returns default props for react-number-format component
   */
  const withDefaultNumericFormatProps = evaluateNumericFormatDefaults()

  /**
   * @description This function will convert a string to a number based on the locale. It will replace the thousands separator with an empty string and the decimal separator with a dot. The
   * locales are mapped against our internal settings for separators. This will work in conjunction with - but is not limited by - the NumberFormat component and will allow you to convert a string value to a number based on the locale.
   *
   * @param {string | null | undefined} value - The string value to be converted to a number based on the locale.
   * @param {Locale} [forcedLocale] - The locale to use for conversion. If not provided, the global locale will be used.
   * @returns {number | null} - Returns the parsed number or null if the input is invalid.
   */
  const convertStringToNumberBasedOnLocale = useCallback(
    ({
      value,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      forcedLocale = globalLocale || DEFAULT_LOCALE,
    }: ConvertStringToNumberBasedOnLocaleProps): number | null => {
      if (typeof value !== "string" || value.trim() === "") {
        return null
      }

      const cleanedValue = value.replace(/[^0-9.,]/g, "")

      let normalizedValue = cleanedValue

      /**
       * Convert the forcedLocale (or the globalLocale | DEFAULT_LOCALE) to numeric props to get the thousand and decimal separators as per our internal settings.
       * This will allow us to normalize the value based on the locale.
       */
      const { thousandSeparator, decimalSeparator } =
        convertCustomLocaleToNumericProps(forcedLocale)

      /**
       * Replace the thousands separator with an empty string and the decimal separator with a dot
       */
      normalizedValue =
        cleanedValue
          .replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
          .replace(new RegExp(`\\${decimalSeparator}`, "g"), ".") || ""
      const parsedValue = parseFloat(normalizedValue)
      if (isNaN(parsedValue) || !isFinite(parsedValue)) {
        return null
      }

      return parsedValue
    },
    [convertCustomLocaleToNumericProps, globalLocale]
  )

  const isNumberOutOfRange = useCallback((value: number | null) => {
    // We need to check if the value has no more than MAXIMUM_NUMBER_OF_DIGITS_ALLOWED digits. Please note that this limit only applies to the
    // integer part of the number, not the decimal part.

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (value === null || value === undefined) {
      return false
    }

    const valueString = value.toString()
    const integerPart = valueString.split(".")[0] // Get the integer part of the number
    return integerPart.length > MAXIMUM_NUMBER_OF_DIGITS_ALLOWED
  }, [])

  const memoizedContextProps = useMemo(
    () => ({
      formatNumberRaw,
      withDefaultNumericFormatProps,
      convertCustomLocaleToNumericProps,
      convertStringToNumber: convertStringToNumberBasedOnLocale,
      isNumberOutOfRange,
    }),
    [
      formatNumberRaw,
      withDefaultNumericFormatProps,
      convertCustomLocaleToNumericProps,
      convertStringToNumberBasedOnLocale,
      isNumberOutOfRange,
    ]
  )

  return (
    <NumberFormatContextProvider value={memoizedContextProps}>
      {children}
    </NumberFormatContextProvider>
  )
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

export type ConvertCustomLocaleToNumericPropsFnSignature = (
  locale: Locale
) => NumericFormatProps

export interface FormatNumberToStringReturnType extends Pick<
  FormatNumberToStringOptions,
  "invalidNumberText"
> {
  isValid: boolean
  value: string | null
}
