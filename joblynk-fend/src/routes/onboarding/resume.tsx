import { createFileRoute } from '@tanstack/react-router'
import { UploadDropzone } from '@uploadthing/react'

export const Route = createFileRoute('/onboarding/resume')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleUploadComplete = async (res: any) => {
    // res is an array of file info objects, including the signed URL
    const resumeUrl = res[0]?.url
    console.log('resumerurl', resumeUrl)
  }
  return (
    <div>
      <UploadDropzone
        endpoint="resumeUploader" // must match your uploadthing backend config
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error) => alert(`ERROR! ${error.message}`)}
      />
    </div>
  )
}
