# Guía de Despliegue

## Requisitos Previos

1. Cuenta en Supabase
2. Base de datos configurada con las tablas necesarias
3. Variables de entorno configuradas

## Pasos para el Despliegue

1. Configurar Supabase:
   - Ejecutar las migraciones en el orden correcto
   - Verificar las políticas de seguridad (RLS)
   - Configurar la autenticación por email/password

2. Variables de Entorno:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Construir el Proyecto:
   ```bash
   npm run build
   ```

4. Archivos a Desplegar:
   - Contenido de la carpeta `dist/`
   - Configurar redirecciones para SPA

## Consideraciones de Seguridad

- Verificar que las políticas RLS estén correctamente configuradas
- Asegurar que las claves de API estén protegidas
- Configurar CORS apropiadamente
- Habilitar solo los métodos de autenticación necesarios