Para probar la base de datos tienes que crear tu propio archivo .env.local 

Como crear el archivo .env.local:

Debes crear un nuevo archivo llamado .env.local en la raíz del proyecto.

Debes copiar y pegar el siguiente contenido, ajustando los valores si tu configuración es diferente (por ejemplo, si tu MySQL tiene contraseña):

# Configuración de Base de Datos (MySQL)
DB_HOST=localhost

DB_USER=root
# Si tu MySQL tiene contraseña, la pones aquí en "DB_PASSWORD" despues de "=". Si no, lo dejas vacío.
DB_PASSWORD=

DB_NAME=umoar_db

DB_PORT=3306

# Configuración del Servidor Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Seguridad de Sesiones
# Debes inventar una clave larga (mínimo 32 caracteres) o usar esta de ejemplo:
SESSION_PASSWORD=una_clave_super_secreta_y_larga_para_el_desarrollo_local_123

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
