import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function InstructorMaterialsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Course Materials</h1>
      <Card>
        <CardHeader><CardTitle>Upload Materials</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Upload PDF, docs, and notes for your courses.</p>
        </CardContent>
      </Card>
    </div>
  );
}
