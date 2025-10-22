import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconUserCheck, IconUserX, IconTrendingUp } from "@tabler/icons-react"

// UserStats interface
interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  deletedUsers: number;
  usersByRole: {
    USER: number;
    ADMIN: number;
    AGENT: number;
  };
  verifiedUsers: number;
  unverifiedUsers: number;
  registeredToday: number;
  registeredThisMonth: number;
  usersWithDevices: number;
  averageBalance: number;
}

interface UserStatsProps {
  stats: UserStats
  isLoading?: boolean
}

export function UserStatsCards({ stats, isLoading = false }: UserStatsProps) {
  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: IconUsers,
      description: "All registered users",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: IconUserCheck,
      description: "Active and verified",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: IconUserX,
      description: "Unverified or dormant",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "This Month",
      value: stats.registeredThisMonth,
      icon: IconTrendingUp,
      description: "New registrations",
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


