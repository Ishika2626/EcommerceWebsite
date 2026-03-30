import { AdminLayout } from "@/components/admin-layout";
import { useAdminGetStats } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { IndianRupee, ShoppingBag, Users, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminGetStats();

  if (isLoading) return <AdminLayout><div className="p-10">Loading stats...</div></AdminLayout>;
  if (!stats) return null;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><IndianRupee className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Total Revenue</p><p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p></div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600"><ShoppingBag className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Total Orders</p><p className="text-2xl font-bold">{stats.totalOrders}</p></div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Products</p><p className="text-2xl font-bold">{stats.totalProducts}</p></div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Top Selling Products</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topProducts}>
                <XAxis dataKey="productName" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="totalSold" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-xl transition-colors border border-transparent hover:border-border">
                <div>
                  <p className="font-semibold text-sm">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">{formatPrice(order.total)}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
