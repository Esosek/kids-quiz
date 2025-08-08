export async function fetchRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT',
  body?: Record<string, unknown>,
  authToken?: string
) {
  const res = await fetch('http://localhost:8080/api' + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken ? 'Bearer ' + authToken : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const resBody = await res.json()
  return { ok: res.ok, status: res.status, body: resBody }
}
