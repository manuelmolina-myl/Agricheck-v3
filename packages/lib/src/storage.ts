export async function uploadPhoto(
  file: File | Blob,
  path: string,
  r2Endpoint: string,
  authToken: string
): Promise<string> {
  const response = await fetch(`${r2Endpoint}/${path}`, {
    method: 'PUT',
    headers: {
      'X-Custom-Auth-Key': authToken,
      'Content-Type': file.type || 'image/jpeg'
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(`Error al subir foto: ${response.statusText}`);
  }

  return path;
}

export function getPhotoUrl(path: string, publicUrl: string): string {
  return `${publicUrl}/${path}`;
}

export function generatePhotoPath(tenantId: string, workerId: string, type: 'registration' | 'checkin' | 'checkout'): string {
  const timestamp = Date.now();
  return `${tenantId}/${workerId}/${type}_${timestamp}.jpg`;
}
