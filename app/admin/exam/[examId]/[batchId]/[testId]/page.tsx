import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
export default function page() {
  return (
    <div className='space-y-6 overflow-y-auto'>
              <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/exam">Exams</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/exam/exam-title`}>
              Exam Title
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink >Batch Title</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Test Title</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">Test Title</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Add questions to this test and manage its settings.
          </p>
        </div>
    </div>
      <Separator />

    </div>
  )
}
