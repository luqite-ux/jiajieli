export function normalizeLoginCredentials(form: FormData) {
  return {
    email: String(form.get('email') ?? '').trim().toLowerCase(),
    password: String(form.get('password') ?? ''),
  }
}
