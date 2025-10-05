import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconCreditCard, IconTrendingUp, IconX, IconWallet } from "@tabler/icons-react"

// PaymentStats interface
interface PaymentStats {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  cancelledTransactions: number;
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  averageTransactionValue: number;
}

interface PaymentStatsProps {
  stats: PaymentStats
  isLoading?: boolean
}

export function PaymentStatsCards({ stats, isLoading = false }: PaymentStatsProps) {
  const statsData = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: IconCreditCard,
      description: "All payment transactions",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },   
    {
      title: "Failed",
      value: stats.failedTransactions,
      icon: IconX,
      description: "Failed transactions",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Total Revenue",
      value: `₦${(stats.totalRevenue / 100).toLocaleString()}`,
      icon: IconWallet,
      description: "All-time revenue",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Monthly Revenue",
      value: `₦${(stats.monthlyRevenue / 100).toLocaleString()}`,
      icon: IconTrendingUp,
      description: "This month's earnings",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PaymentRevenueChart({ stats, isLoading = false }: PaymentStatsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ₦{(stats.todayRevenue / 100).toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <IconTrendingUp className="w-3 h-3 mr-1" />
              Today
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Average Transaction Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ₦{(stats.averageTransactionValue / 100).toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <IconCreditCard className="w-3 h-3 mr-1" />
              Average
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-lg font-bold text-green-600">
                {stats.totalTransactions > 0 
                  ? Math.round((stats.successfulTransactions / stats.totalTransactions) * 100)
                  : 0}%
              </p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Failure Rate</p>
              <p className="text-lg font-bold text-red-600">
                {stats.totalTransactions > 0 
                  ? Math.round(((stats.failedTransactions + stats.cancelledTransactions) / stats.totalTransactions) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
