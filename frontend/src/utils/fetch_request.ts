export async function fetchRequest(url: string, method: 'GET' | 'POST' | 'PUT', body?: Record<string, unknown>, authToken?: string) {
  try {
    const res = await fetch('http://localhost:8080/api' + url, {
      method,
      headers: {
        'Content-Type': body ? 'application/json' : '',
        Authorization: authToken ? 'Bearer ' + authToken : '',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const resBody = await res.json()
    return { ok: res.ok, status: res.status, body: resBody }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      status: 503,
      body: { error: 'Je to rozbitý...' },
    }
  }
}
