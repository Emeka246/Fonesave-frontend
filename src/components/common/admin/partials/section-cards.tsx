import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionCards() {
  const { dashboardStats, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-[100px]" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-8 w-[80px]" />
              </CardTitle>
              <CardAction>
                <Skeleton className="h-6 w-[60px]" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[120px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Create stats cards from dashboard data
  const stats = dashboardStats ? [
    {
      title: 'Total Revenue',
      value: `₦${dashboardStats.totalRevenue.toLocaleString()}`,
      description: 'Total revenue from device registrations',
      trend: { value: dashboardStats.monthlyGrowth.revenue, isPositive: dashboardStats.monthlyGrowth.revenue > 0 }
    },
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers.toLocaleString(),
      description: 'Total registered users',
      trend: { value: dashboardStats.monthlyGrowth.users, isPositive: dashboardStats.monthlyGrowth.users > 0 }
    },
    {
      title: 'Total Devices',
      value: dashboardStats.totalDevices.toLocaleString(),
      description: 'Total registered devices',
      trend: { value: dashboardStats.monthlyGrowth.devices, isPositive: dashboardStats.monthlyGrowth.devices > 0 }
    },
    {
      title: 'Active Agents',
      value: dashboardStats.activeAgents.toLocaleString(),
      description: 'Number of active agents',
      trend: { value: 0, isPositive: true } // No growth data for agents
    }
  ] : [];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {stat.trend.isPositive ? <IconTrendingUp /> : <IconTrendingDown />}
                {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
              </Badge>
            </CardAction>
          </CardHeader>
         
        </Card>
      ))}
    </div>
  )
}
