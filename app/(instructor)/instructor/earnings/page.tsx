'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function EarningsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Earnings & Payments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader><CardTitle>Total Earnings</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-primary-500">₹0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>This Month</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-success">₹0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-warning">₹0</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Payment transactions will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
