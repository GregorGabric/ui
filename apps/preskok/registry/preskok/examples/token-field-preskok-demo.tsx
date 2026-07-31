"use client"

import {
  TokenFieldValue,
  type TokenFieldSegment,
} from "react-aria-components/TokenField"

import { Token, TokenField } from "@/registry/preskok/ui/preskok-ui/token-field"

class TokenizingFieldValue extends TokenFieldValue {
  tokenRegex: RegExp

  constructor(segments: Array<TokenFieldSegment>, tokenRegex: RegExp) {
    super(segments)
    this.tokenRegex = tokenRegex
  }

  static tokenize(text: string, tokenRegex: RegExp) {
    const value = new this([], tokenRegex)
    return new this(value.tokenize(text), tokenRegex)
  }

  createFieldValue(segments: Array<TokenFieldSegment>): this {
    const Constructor = this.constructor as new (
      segments: Array<TokenFieldSegment>,
      tokenRegex: RegExp
    ) => this

    return new Constructor(segments, this.tokenRegex)
  }

  tokenize(text: string): Array<TokenFieldSegment> {
    if (text.length === 0) {
      return [{ type: "text", text }]
    }

    this.tokenRegex.lastIndex = 0

    let match: RegExpExecArray | null = null
    let start = 0
    const segments: Array<TokenFieldSegment> = []

    while ((match = this.tokenRegex.exec(text))) {
      if (match.index > start) {
        segments.push({ type: "text", text: text.slice(start, match.index) })
      }

      segments.push({ type: "token", text: match[0] })
      start = match.index + match[0].length
    }

    if (start < text.length) {
      segments.push({ type: "text", text: text.slice(start) })
    }

    return segments
  }
}

const initialValue = TokenizingFieldValue.tokenize(
  "Move #available vehicles to @Maja for today’s review.",
  /(?<=\s|^)[#@]\S+(?=\s)/g
)

export default function TokenFieldPreskokDemo() {
  return (
    <div className="w-full max-w-xl">
      <TokenField
        allowsNewlines
        defaultValue={initialValue}
        label="Vehicle note"
        placeholder="Write a note with #statuses or @mentions"
      >
        {(segment) => <Token>{segment.text}</Token>}
      </TokenField>
    </div>
  )
}
