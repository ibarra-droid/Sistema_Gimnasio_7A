# Pulse Gym — sistema de gestión

Panel de gestión de gimnasio hecho con HTML, CSS y JavaScript, con una API PHP y base MySQL/MariaDB.

## Ejecutar en XAMPP

Requisitos: Apache, MySQL/MariaDB y PHP con PDO MySQL habilitado (XAMPP incluye estos componentes).

1. Copiá `Sistema_Gimnasio_7A-main` dentro de la carpeta `htdocs` de tu instalación XAMPP.
2. Iniciá Apache y MySQL desde el panel de XAMPP.
3. En phpMyAdmin, creá la base `ingresos_gim` con cotejamiento `utf8mb4_general_ci` e importá `ingresos_gim.sql`.
4. Revisá `api/config.php`. Por defecto usa `127.0.0.1`, usuario `root`, clave vacía y base `ingresos_gim`. Podés configurar `GIMNASIO_DB_HOST`, `GIMNASIO_DB_NAME`, `GIMNASIO_DB_USER` y `GIMNASIO_DB_PASS` en el entorno de PHP para reemplazar esos valores.
5. Abrí `http://localhost/Sistema_Gimnasio_7A-main/`. No abras `index.html` como archivo local; PHP y `fetch()` necesitan Apache.

## Secciones

- Inicio: indicadores, actividad reciente, ingresos mensuales y vencimientos.
- Socios: datos, contacto, fecha de alta y estado.
- Membresías: socio, plan, fechas y estado.
- Pagos: monto, método, fecha, concepto y comprobante.
- Actividad: asistencias asociadas a una membresía y clase.
- Clases: horario, cupo e instructor.
- Empleados, planes y métodos de pago.

Las pantallas permiten listar, buscar, crear, editar, eliminar y exportar registros a CSV. Las claves foráneas protegen los datos relacionados: una fila referenciada por otros registros no se puede eliminar hasta resolver esas relaciones.

## API

Endpoint: `api/api.php`. `GET ?entity=dashboard` entrega el resumen; `GET ?entity=clientes` lista registros y `&id=...` obtiene uno. `POST` crea, `PUT` actualiza y `DELETE` elimina. Entidades: `clientes`, `empleados`, `planes`, `clases`, `contrataciones`, `pagos`, `metodos_pago` e `inscripciones_asistencias`.

## Datos de ejemplo y publicación

`ingresos_gim.sql` incluye registros de demostración con nombres, DNI, teléfonos y direcciones; los correos usan `example.com` y los valores parecen de prueba. Confirmá que todos sean ficticios antes de publicar el repositorio como público. No incluyas datos reales ni contraseñas de tu instalación.

## GitHub

GitHub puede alojar el código y el SQL, pero GitHub Pages no ejecuta PHP ni MySQL. Para usar esta aplicación, descargá/cloná el repositorio dentro de `htdocs`, importá la base y abrila desde `http://localhost/...`.
