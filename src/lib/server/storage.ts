import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export async function uploadPhoto(file: File, path: string): Promise<string> {
	const response = await fetch(`${publicEnv.PUBLIC_R2_ENDPOINT}/${path}`, {
		method: 'PUT',
		headers: {
			'X-Custom-Auth-Key': env.R2_AUTH_TOKEN!
		},
		body: file
	});

	if (!response.ok) {
		throw new Error('Upload failed');
	}

	return `${publicEnv.PUBLIC_R2_PUBLIC_URL}/${path}`;
}
