'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CreateCoursePage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Create Course</h1>
      <Card>
        <CardHeader><CardTitle>Course Information</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Course Title" id="title" required />
            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
              <textarea id="description" rows={4} className="w-full px-3 py-2 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Price" id="price" type="number" />
              <Input label="Category" id="category" />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Create Course</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
