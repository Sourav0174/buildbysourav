import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { verifySession } from '@/core/auth/session'

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Authenticate the user before allowing them to upload
        const session = await verifySession()
        if (!session?.isAuth) {
          throw new Error('Unauthorized')
        }

        // Return allowed permissions
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB limit
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minute validity
          tokenPayload: JSON.stringify({ userId: 'admin' }),
        }
      },
      onUploadCompleted: async () => {
        // This runs after the upload completes
        // Upload completed
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    )
  }
}
