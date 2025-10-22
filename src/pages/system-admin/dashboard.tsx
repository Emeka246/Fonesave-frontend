

import { DataTable } from "@/components/common/data-table"
import { SectionCards } from "@/components/common/admin/partials/section-cards"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const { data, isLoading, error } = useDashboardData();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[100px]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-red-500 text-xl">
            Error loading dashboard data. Please try again later.
          </div>
        </div>
    )
  }

  return (
    <>          
        <section id="charts">
           <SectionCards />
        </section>
        <section id="tables" className="mt-6">
            <h3 className="text-lg font-bold mb-4">Recent Registrations</h3>
            <DataTable data={data} />
        </section>
    </>

  )
}
