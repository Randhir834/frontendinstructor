import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function InstructorStudentsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Enrolled Students</h1>
      <Card>
        <CardHeader><CardTitle>Students</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">View students enrolled in your courses.</p>
        </CardContent>
      </Card>
    </div>
  );
}
