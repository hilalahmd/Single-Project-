// Base URL string — default export
// Used by most pages as: import API from '...'  →  fetch(`${API}/endpoint`)
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export default API

// ─────────────────────────────────────────────────────────────────────────────
// Axios-like fetch wrapper — named export
// Used by pages as: import { apiClient } from '...'  →  apiClient.get/post(...)
// Supports: JSON body, cookies, multipart/form-data
// ─────────────────────────────────────────────────────────────────────────────
const createApiClient = (baseURL) => {
  const request = async (method, path, data = null, options = {}) => {
    const url = `${baseURL}${path}`
    const isFormData = data instanceof FormData

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    }

    const config = {
      method,
      headers,
      credentials: 'include',
      ...(data ? { body: isFormData ? data : JSON.stringify(data) } : {})
    }

    const res = await fetch(url, config)
    const json = await res.json()

    if (!res.ok) {
      const error = new Error(json?.message || 'Request failed')
      error.response = { data: json, status: res.status }
      throw error
    }

    // Axios-compatible response shape
    return { data: json, status: res.status }
  }

  return {
    get:    (path, options)       => request('GET',    path, null, options),
    post:   (path, data, options) => request('POST',   path, data, options),
    put:    (path, data, options) => request('PUT',    path, data, options),
    patch:  (path, data, options) => request('PATCH',  path, data, options),
    delete: (path, options)       => request('DELETE', path, null, options),
  }
}

export const apiClient = createApiClient(API)