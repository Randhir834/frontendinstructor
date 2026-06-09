import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function InstructorProgressPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Student Progress</h1>
      <Card>
        <CardHeader><CardTitle>Progress Tracking</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Track student progress for your courses.</p>
        </CardContent>
      </Card>
    </div>
  );
}
