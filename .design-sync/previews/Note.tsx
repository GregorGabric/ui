import { Note } from "preskok"

export function Intents() {
  return (
    <div className="space-y-4">
      <Note intent="default">
        The billing export includes invoices, refunds, credits, and tax rows for
        the selected reporting window.
      </Note>

      <Note intent="info">
        Team owners can preview the export before it is delivered to finance.
      </Note>

      <Note intent="warning">
        Exports over 50,000 rows are queued and sent by email when processing is
        complete.
      </Note>

      <Note intent="danger">
        Reports that include restricted workspaces require approval from a
        workspace admin.
      </Note>

      <Note intent="success">
        The latest export finished successfully and is ready to download.
      </Note>
    </div>
  )
}

export function WithoutIndicator() {
  return (
    <Note intent="info" indicator={false}>
      Recurring exports inherit workspace approval rules from the saved report
      owner.
    </Note>
  )
}
