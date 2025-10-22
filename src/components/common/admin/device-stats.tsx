import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconDeviceMobile, IconShield, IconAlertTriangle, IconTrendingUp } from "@tabler/icons-react"
// DeviceStats interface (copied from parent component)
interface DeviceStats {
  totalDevices: number;
  cleanDevices: number;
  stolenDevices: number;
  lostDevices: number;
  blockedDevices: number;
  unknownDevices: number;
  registeredThisMonth: number;
  registeredToday: number;
}

interface DeviceStatsProps {
  stats: DeviceStats
  isLoading?: boolean
}

export function DeviceStatsCards({ stats, isLoading }: DeviceStatsProps) {
  console.log("stats",stats)
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
              <div className="h-3 bg-muted animate-pulse rounded w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Devices",
      value: stats.totalDevices,
      icon: IconDeviceMobile,
      description: "All registered devices",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Clean Devices",
      value: stats.cleanDevices,
      icon: IconShield,
      description: "Verified clean status",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Lost Devices",
      value: stats.lostDevices,
      icon: IconAlertTriangle,
      description: "Reported lost",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "This Month",
      value: stats.registeredThisMonth,
      icon: IconTrendingUp,
      description: "Registrations this month",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function DeviceStatusDistribution({ stats }: DeviceStatsProps) {
  const total = stats.totalDevices
  
  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No devices registered yet</p>
        </CardContent>
      </Card>
    )
  }

  const statusData = [
    { label: "Clean", value: stats.cleanDevices, color: "bg-green-500" },
    { label: "Stolen", value: stats.stolenDevices, color: "bg-red-500" },
    { label: "Lost", value: stats.lostDevices, color: "bg-orange-500" },
    { label: "Blocked", value: stats.blockedDevices, color: "bg-gray-500" },
    { label: "Unknown", value: stats.unknownDevices, color: "bg-purple-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusData.map((status) => {
            const percentage = total > 0 ? ((status.value / total) * 100).toFixed(1) : '0'
            return (
              <div key={status.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-sm font-medium">{status.label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${status.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{status.value}</Badge>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
