/**
 * validateRequest — Express middleware factory for Zod schema validation.
 *
 * Usage: router.post('/login', validateRequest(loginSchema), loginController)
 *
 * On failure:  returns 400 { message: "Validation failed", errors: { field: "msg" } }
 * On success:  attaches validated+coerced data to req.validatedBody and calls next()
 *
 * Safety guarantees:
 *  - Uses safeParse (never throws) — cannot break existing try/catch blocks
 *  - Does NOT modify req.body — controller reads req.body as before (zero breakage)
 *  - Does NOT touch JWT, cookies, bcrypt, or RBAC middleware
 *  - Error response shape adds `errors` key but preserves existing `message` key
 *    so all existing frontend code that reads .message continues to work
 */
const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    // Build field-specific error map: { email: "Invalid email", password: "Required" }
    const fieldErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (field && !fieldErrors[field]) {
        // Only store the first error per field
        fieldErrors[field] = issue.message
      }
    }

    return res.status(400).json({
      message: 'Validation failed',     // backward-compatible — existing .message reads still work
      errors: fieldErrors               // new field-specific errors for inline display
    })
  }

  // Attach validated (coerced/trimmed) data — controller still reads req.body unchanged
  req.validatedBody = result.data
  next()
}

export default validateRequest
