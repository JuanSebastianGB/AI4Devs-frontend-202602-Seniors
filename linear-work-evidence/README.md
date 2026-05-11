# Evidencia de trabajo — Linear

Esta carpeta es una **copia de respaldo literal** de los issues exportados desde Linear (workspace **Nova-code**, equipo vía API), para documentar qué tickets se crearon y marcaron como completados.

## Cómo se generó

- **Filtro original:** estado **Done** (completados) — NOV-5..NOV-10.
- **Refresh posterior:** se añadieron también NOV-11, NOV-12 y NOV-13, exportados vía `get_issue` con su estado **actual** en Linear (Backlog en el momento del snapshot, aunque el código ya está commiteado en este repo). Cuando se transicionen a Done en Linear, conviene re-exportarlos para actualizar `status` y `completedAt`.
- **Fuente:** API de Linear vía integración MCP (`list_issues` → `get_issue` por identificador).
- **Contenido:** título, descripción (markdown), metadatos y relaciones tal como los devuelve la API; comentarios listados aparte (vacíos en esta exportación).

## Alcance de esta exportación

Si más adelante necesitas otros estados (por ejemplo *In Progress*, *Canceled*) u otro equipo/proyecto, se puede repetir el proceso con otros filtros.

## Issues incluidos

Ver `INDEX.md` y un archivo `NOV-*.md` por ticket.
