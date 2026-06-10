# Cotizador de aberturas de aluminio

Demo MVP para cotizar aberturas de aluminio en Argentina con datos hardcodeados:
fabricación por hora, tipos de abertura, líneas/calidades, colores, vidrios,
envío, colocación, margen e impuestos.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- react-router-dom
- shadcn/ui local en `src/components/ui`
- lucide-react
- react-hook-form + zod

## Comandos

```bash
npm install
npm run dev
```

Validación de producción:

```bash
npm run build
```

## Componentes shadcn/ui usados

Los componentes ya están incluidos en el repositorio. Para instalarlos desde cero
en otro proyecto, los comandos equivalentes son:

```bash
npx shadcn@latest init
npx shadcn@latest add button input label select card table dialog form badge separator checkbox
```

## Rutas

- `/cotizador`: formulario principal con cálculo en vivo.
- `/catalogos`: tablas de supuestos y catálogos hardcodeados.

## Deploy continuo (Azure Static Web Apps)

El workflow `.github/workflows/azure-static-web-apps-nice-grass-0baeeba0f.yml` despliega automáticamente:

- **Producción**: cada commit/push a `main`.

No se ejecutan despliegues por pull request.

Configuración del build:

- `app_location`: `/`
- `output_location`: `dist`
- `app_build_command`: `npm run build`

El archivo `public/staticwebapp.config.json` habilita el enrutado SPA de React Router en Azure.

Requisito en GitHub: el secreto `AZURE_STATIC_WEB_APPS_API_TOKEN_NICE_GRASS_0BAEEBA0F` debe existir (Azure lo crea al vincular el repositorio).
