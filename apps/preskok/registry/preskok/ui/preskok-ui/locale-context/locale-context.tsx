"use client"

import type { PropsWithChildren } from "react"
import React, { useEffect, useState } from "react"

import { createCtx } from "@/registry/preskok/lib/create-ctx"

import { getCurrencyCodeOrSymbol } from "../number-format/currency-helpers"
import { DEFAULT_LOCALE, Locale } from "./locale-helpers"

const splitCurrentUrl = () => {
  return {
    origin: window.location.origin,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  }
}

const retrieveLocaleFromUrlStrict = (passedUrl?: string): Locale | null => {
  const url = passedUrl || splitCurrentUrl().pathname
  const availableLocalesArray: Array<Locale> = Object.values(Locale)
  const supposedUrlLocale = url.split("/")[1] as Locale | undefined

  return supposedUrlLocale && availableLocalesArray.includes(supposedUrlLocale)
    ? supposedUrlLocale
    : null
}

type CurrencyCodeOrSymbolExpectedOutputOptions =
  | "currency_code"
  | "currency_symbol"

interface GetCurrencyCodeOrSymbolParams {
  inputValue: string
  expectedOutput?: CurrencyCodeOrSymbolExpectedOutputOptions
}

interface LocaleContextProviderProps {
  globalLocale: Locale
  setGlobalLocale: (localeOption: Locale) => void
}

export const [useLocaleContext, LocaleContextProvider] =
  createCtx<LocaleContextProviderProps>()

export const LocaleContext: React.FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  /**
   * On initial load, we will try to retrieve locale from url and set it as global locale. Reading from the local
   * storage should be discouraged at this point, because we want to avoid the situation where the user has set a
   * locale for himself / herself, but is sent a link with a different locale.
   */
  useEffect(() => {
    const localeFromUrl = retrieveLocaleFromUrlStrict()

    if (localeFromUrl) {
      setLocale(localeFromUrl)
    }
  }, [])

  const setGlobalLocale = (localeOption: Locale): void => {
    setLocale(localeOption)
  }

  /**
   * This function will return the currency code or symbol code based on the input value and the expected output.
   *
   * IMPORTANT: It currently does not take into the account the locale value due to the fact we have a problem in business
   * logic and we are using the '/en/' or '/sl/' in the URL to reflect the locale which is incorrect. We should be using the
   * BCP47 standard which would equate to '/en-US/' or '/en-EN/' or '/en-GB/' or '/sl-SI/'.
   */
  const getCurrencyCodeOrSymbolCode = ({
    inputValue,
    expectedOutput = "currency_code",
  }: GetCurrencyCodeOrSymbolParams) => {
    return getCurrencyCodeOrSymbol({ inputValue, expectedOutput })
  }

  const memoizedContextProps = {
    globalLocale: locale,
    setGlobalLocale,
    getCurrencyCodeOrSymbolCode: getCurrencyCodeOrSymbolCode,
  }

  return (
    <LocaleContextProvider value={memoizedContextProps}>
      {children}
    </LocaleContextProvider>
  )
}
