'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SectionsManagementPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Course Sections</h1>
      <Card>
        <CardHeader><CardTitle>Add Section</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Section Title" id="title" required />
            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
              <textarea id="description" rows={3} className="w-full px-3 py-2 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Add Section</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Sections List</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Sections will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
