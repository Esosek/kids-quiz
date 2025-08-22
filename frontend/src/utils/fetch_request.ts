export async function fetchRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT',
  body?: Record<string, unknown>,
  authToken?: string
) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      method,
      headers: {
        'Content-Type': body ? 'application/json' : '',
        Authorization: authToken ? 'Bearer ' + authToken : '',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const resBody = await res.json()
    if (!res.ok) {
      return { ok: res.ok, status: res.status, error: resBody.error }
    }
    return { ok: res.ok, status: res.status, body: resBody as T }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      status: 503,
      body: null,
      error: 'Je to rozbitý...',
    }
  }
}
