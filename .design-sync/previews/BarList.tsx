import { BarList } from "preskok"

const data = [
  { name: "Dashboard", value: 12400, key: "dashboard", href: "/docs" },
  { name: "Reports", value: 9800, key: "reports" },
  { name: "Settings", value: 4200, key: "settings" },
  { name: "Billing", value: 3100, key: "billing" },
]

export function Basic() {
  return (
    <div className="w-full max-w-md">
      <BarList data={data} valueFormatter={(value) => value.toLocaleString()} />
    </div>
  )
}
