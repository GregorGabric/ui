import React, { useRef } from "react"
import type { NumericFormatProps } from "react-number-format"
import { NumericFormat } from "react-number-format"

import { CurrencyCodeAndSymbolMap } from "@/registry/new-york-v4/ui/preskok-ui/locale-context/locale-helpers"
import { useNumberFormatContext } from "@/registry/new-york-v4/ui/preskok-ui/number-format/number-format-context"

interface NumberFormatPropsUnified
  extends Omit<
    NumericFormatProps,
    "onChange" | "onPasteCapture" | "onValueChange"
  > {
  value: number | string | undefined | null
  isCurrency?: boolean
  onValue?: (value: number | null) => void
  onCustomChangeHandler?: (value: number | null) => void
  onCustomPasteCaptureHandler?: (value: number | null) => void
  onCustomValueChangeHandler?: (values: {
    floatValue?: number
    value: string
  }) => void
}

/**
 * @description NumberFormat component is a unified wrapper around the NumericFormat component from react-number-format. It provides a consistent way to format numbers, handle changes, and paste events. It is advised to
 * use the onValue callback to handle any other state change callbacks, because it abstracts the onChange, onPasteCapture and onValueChange handlers and also
 * provide consistent behavior across different use cases.
 *
 * IMPORTANT: This component abstracts onChange, onPasteCapture and onValueChange handlers, allowing you to handle formatted values easily. Should you
 * want to use custom handlers, you can pass them as props. If no handlers are provided, the component will log a warning in the console and will
 * not process the value changes or pasted values.
 *
 * @param {number | string | undefined | null} value - The value to be formatted and displayed in the input field.
 * @param {boolean} [isCurrency=false] - If true, the component will format the value as a currency. Defaults to false.
 * @param {string} [suffix] - Optional suffix to be appended to the formatted value. If isCurrency is true, it defaults to the Euro currency symbol.
 * @param {(value: number | null) => void} [onValue] - Callback function to handle the formatted value when it changes. IMPORTANT: This will abstract the onChange, onPasteCapture and onValueChange handlers!
 * @param {(value: number | null) => void} [onCustomChangeHandler] - Custom change handler to process the value when it changes.
 * @param {(values: { floatValue?: number; value: string }) => void} [onCustomValueChangeHandler] - Custom value change handler to process the values when they change.
 * @param {(value: number | null) => void} [onCustomPasteCaptureHandler] - Custom paste handler to process the value when pasted.
 *
 * @returns {JSX.Element} - Returns a NumericFormat component with the provided props and handlers.
 */
export const NumberFormat: React.FC<NumberFormatPropsUnified> = ({
  value,
  isCurrency = false,
  suffix,
  onValue,
  onCustomChangeHandler,
  onCustomPasteCaptureHandler,
  ...rest
}) => {
  // store the last valid value to revert to in case of out-of-range values
  const lastValidValueRef = useRef<number | null>(null)
  const {
    withDefaultNumericFormatProps,
    convertStringToNumber,
    isNumberOutOfRange,
  } = useNumberFormatContext()
  const formatSuffix = isCurrency
    ? suffix || CurrencyCodeAndSymbolMap.EUR
    : suffix

  // Unified handler for value changes
  const _handleValueChange = (values: {
    floatValue?: number
    value: string
  }) => {
    const { floatValue } = values
    let finalFloatValue: number | null = floatValue ?? null

    if (!isNumberOutOfRange(floatValue ?? null)) {
      // no toast thrown, because it should be picked up by the onChange handler already

      lastValidValueRef.current = floatValue ?? null
    } else {
      finalFloatValue = lastValidValueRef.current // Revert to last valid value
    }

    if (onValue) {
      onValue(finalFloatValue)
    } else if (onCustomChangeHandler) {
      onCustomChangeHandler(finalFloatValue ?? null)
    } else {
      console.warn(
        "No onValue or onCustomChangeHandler provided, value will not be processed."
      )
    }
  }

  // Unified handler for manual input changes (fallback)
  const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    let convertToNumber = convertStringToNumber({
      value: val,
    })

    if (!isNumberOutOfRange(convertToNumber)) {
      lastValidValueRef.current = convertToNumber
    } else {
      // consider throwing a toast or letting the user know another way
      convertToNumber = lastValidValueRef.current ?? null // Revert to last valid value
    }

    if (onValue) {
      onValue(convertToNumber)
    } else if (onCustomChangeHandler) {
      onCustomChangeHandler(convertToNumber)
    } else {
      console.warn(
        "No onValue or onCustomChangeHandler provided, value will not be processed."
      )
    }
  }

  // Unified handler for paste
  const _handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedValue = e.clipboardData.getData("text")
    let tempPastedValue: string | null = null
    if (pastedValue) {
      tempPastedValue = pastedValue.replace(/[^0-9.,]/g, "")
      const lastDotIndex = tempPastedValue.lastIndexOf(".")
      const lastCommaIndex = tempPastedValue.lastIndexOf(",")
      const lastSeparatorIndex = Math.max(lastDotIndex, lastCommaIndex)
      if (lastSeparatorIndex !== -1) {
        const integerPart = tempPastedValue
          .substring(0, lastSeparatorIndex)
          .replace(/[,.]/g, "")
        const decimalPart = tempPastedValue
          .substring(lastSeparatorIndex + 1)
          .replace(/[,.]/g, "")
        tempPastedValue = `${integerPart}.${decimalPart}`
      } else {
        tempPastedValue = tempPastedValue.replace(/[^0-9]/g, "")
      }
    }

    let checkedPastedNumber =
      tempPastedValue && !isNaN(parseFloat(tempPastedValue))
        ? parseFloat(tempPastedValue)
        : null

    if (!isNumberOutOfRange(checkedPastedNumber)) {
      lastValidValueRef.current = checkedPastedNumber
    } else {
      // consider throwing a toast or letting the user know another way
      checkedPastedNumber = lastValidValueRef.current // Revert to last valid value
    }

    if (onValue) {
      onValue(checkedPastedNumber)
    } else if (onCustomPasteCaptureHandler) {
      onCustomPasteCaptureHandler(checkedPastedNumber)
    } else {
      console.warn(
        "No onValue or onCustomPasteCaptureHandler provided, pasted value will not be processed."
      )
    }
  }

  return (
    <NumericFormat
      value={value}
      suffix={formatSuffix}
      onChange={_handleChange}
      onValueChange={_handleValueChange}
      onPasteCapture={_handlePaste}
      {...withDefaultNumericFormatProps}
      {...rest}
    />
  )
}
