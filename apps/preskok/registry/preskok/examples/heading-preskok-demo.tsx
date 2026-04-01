import { Heading } from "@/registry/preskok/ui/preskok-ui/heading"

export default function HeadingPreskokDemo() {
  return (
    <div
      style={{
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
        background: "#d4d0c8",
        padding: "2px",
        boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        width: 420,
        userSelect: "none",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "linear-gradient(to right, #000080, #1084d0)",
          padding: "3px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "#fff", fontWeight: "bold" }}>
            Typography Properties
          </span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {["_", "□", "✕"].map((btn, i) => (
            <button
              key={i}
              style={{
                width: 16,
                height: 14,
                fontSize: 9,
                lineHeight: "14px",
                textAlign: "center",
                background: "#d4d0c8",
                border: "none",
                boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
                cursor: "pointer",
                padding: 0,
                color: "#000",
                fontFamily: "inherit",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          background: "#d4d0c8",
          padding: "12px 16px 8px",
        }}
      >
        {/* Sunken group box */}
        <fieldset
          style={{
            border: "none",
            boxShadow: "inset 1px 1px #808080, inset -1px -1px #ffffff, inset 2px 2px #0a0a0a, inset -2px -2px #dfdfdf",
            padding: "12px 14px 10px",
            marginBottom: 12,
            background: "#ffffff",
          }}
        >
          <legend
            style={{
              fontSize: 11,
              fontFamily: '"Tahoma", Arial, sans-serif',
              color: "#000",
              padding: "0 4px",
              fontWeight: "normal",
              background: "#d4d0c8",
            }}
          >
            Heading Levels
          </legend>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Heading level={4}>Heading 4</Heading>
          </div>
        </fieldset>

        {/* Button row */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
          {["OK", "Cancel", "Apply"].map((label) => (
            <button
              key={label}
              style={{
                minWidth: 72,
                height: 23,
                fontSize: 11,
                fontFamily: '"Tahoma", Arial, sans-serif',
                background: "#d4d0c8",
                border: "none",
                boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
                cursor: "pointer",
                padding: "0 8px",
                color: "#000",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
