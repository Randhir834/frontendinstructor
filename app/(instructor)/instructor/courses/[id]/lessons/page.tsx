'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LessonsManagementPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Lessons</h1>
      <Card>
        <CardHeader><CardTitle>Add Lesson</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Lesson Title" id="title" required />
            <div className="space-y-1">
              <label htmlFor="content" className="block text-sm font-medium text-text-primary">Content / Notes</label>
              <textarea id="content" rows={4} className="w-full px-3 py-2 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Add Lesson</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Lessons List</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Lessons will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
