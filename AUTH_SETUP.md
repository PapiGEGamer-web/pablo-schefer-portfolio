# Activar cuentas y códigos de ocho dígitos

La interfaz usa Supabase Auth con OTP por correo. Para activarla en producción:

1. Crear un proyecto en Supabase.
2. En **Authentication → Providers → Email**, activar el proveedor Email.
3. En **Authentication → Email Templates → Magic Link**, usar `{{ .Token }}` en lugar de `{{ .ConfirmationURL }}`. Ejemplo:

```html
<h2>Tu código de acceso</h2>
<p>Introduce este código en pablo-schefer.vercel.app:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:8px">{{ .Token }}</p>
<p>El código caduca en unos minutos.</p>
```

4. En Vercel, añadir estas variables de entorno para Production, Preview y Development:

```text
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

5. Volver a desplegar. La clave publicable está diseñada para usarse en el navegador; no añadir nunca la `service_role` al frontend.

El registro envía el OTP, verifica el correo, establece la contraseña elegida y conserva la sesión. Los accesos posteriores utilizan correo y contraseña.
