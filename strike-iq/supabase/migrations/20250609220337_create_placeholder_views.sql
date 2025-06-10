-- Migración para crear vistas de ejemplo (placeholders)
-- Descripción: Define vistas SQL básicas que puedes expandir según tus necesidades de análisis.
-- Siempre aplicar: false

-- Vista de ejemplo: Resumen de jugadores por casino
-- Esta vista cuenta cuántos jugadores únicos hay en la tabla historial_jugadores por casino.
create or replace view public.resumen_jugadores_por_casino as
select
  ic.casino_name,
  count(distinct hj.usuario) as cantidad_jugadores_unicos,
  sum(hj.ganancias) as ganancias_totales_casino,
  sum(hj.apuesta) as apuestas_totales_casino,
  avg(hj.apuesta) as apuesta_promedio_casino
from
  public.id_casino ic
left join
  public.historial_jugadores hj on ic.id = hj.id_casino
group by
  ic.casino_name;

comment on view public.resumen_jugadores_por_casino is 'Vista de resumen que muestra la cantidad de jugadores únicos, ganancias y apuestas por casino.';

-- Vista de ejemplo: Actividad reciente de nuevos jugadores
-- Muestra nuevos jugadores y su última fecha de mensaje, ordenados por la más reciente.
create or replace view public.actividad_reciente_nuevos_jugadores as
select
  jn.nombre,
  jn.telefono,
  jn.fecha_ultimo_mensaje,
  jn.fecha_creacion,
  ic.casino_name
from
  public.jugadores_nuevos jn
left join
  public.id_casino ic on jn.id_casino = ic.id
order by
  jn.fecha_ultimo_mensaje desc nulls last, jn.fecha_creacion desc;

comment on view public.actividad_reciente_nuevos_jugadores is 'Vista que muestra la actividad reciente de nuevos jugadores, incluyendo su casino.';

-- Vista de ejemplo: Resumen de bonos por casino
create or replace view public.resumen_bonos_por_casino as
select
  ic.casino_name,
  sum(bs.bonos_ofrecidos) as total_bonos_ofrecidos,
  sum(bs.bonos_usados) as total_bonos_usados,
  sum(bs.monto_total_cargado) as total_monto_cargado_con_bono,
  case
    when sum(bs.bonos_ofrecidos) > 0 then (sum(bs.bonos_usados) / sum(bs.bonos_ofrecidos)) * 100
    else 0
  end as porcentaje_conversion_bonos
from
  public.id_casino ic
left join
  public.bonos_strikeiq bs on ic.id = bs.id_casino
group by
  ic.casino_name;

comment on view public.resumen_bonos_por_casino is 'Vista de resumen de bonos por casino, incluyendo totales y porcentaje de conversión.';


-- Asegúrate de que las vistas tengan políticas RLS si es necesario o que los roles que las acceden
-- tengan permisos sobre las tablas subyacentes.
-- Por simplicidad inicial, si las tablas base tienen RLS que permiten la lectura a los roles adecuados,
-- las vistas generalmente heredarán esos permisos para operaciones de SELECT.
-- Si necesitas RLS más específicas para las vistas, puedes definirlas:
-- alter view public.resumen_jugadores_por_casino owner to postgres; -- o el rol que crea la vista
-- grant select on public.resumen_jugadores_por_casino to authenticated;
-- create policy "allow_select_on_resumen_jugadores_por_casino" on public.resumen_jugadores_por_casino for select to authenticated using (true);
-- (Repetir para otras vistas si es necesario)
