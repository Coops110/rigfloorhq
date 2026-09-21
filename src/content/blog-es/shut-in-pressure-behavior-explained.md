---
title: "Comportamiento de la Presión de Cierre: Qué Sucede Realmente"
description: "Cómo se comportan realmente la SIDPP, SICP, y la presión de fondo durante operaciones de cierre, migración, y stripping — y dónde se equivocan las suposiciones que la gente trae consigo."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Control de Pozos"
tags: ["control de pozos", "cierre", "SIDPP", "SICP", "entrenamiento"]
faq:
  - q: "¿Son estas preguntas oficiales de examen IWCF o IADC?"
    a: "El tema sigue la teoría estándar de control de pozos de IWCF/IADC, pero esta publicación no está afiliada a ninguno de los dos organismos y no sustituye una certificación acreditada. Trátala como material de estudio, no como material de examen."
---

El comportamiento de la presión de cierre es una de esas áreas donde las matemáticas son simples pero la intuición es fácil de confundir al revés — especialmente cualquier cosa que involucre migración de gas, donde mantener una presión constante tiene un efecto muy específico y no obvio sobre otra. Aquí es donde ese razonamiento tiende a equivocarse.

## 1. Volumen de pileta circulando una surgencia hacia afuera de una sección horizontal

Circulando una surgencia de gas hacia afuera a lo largo de una sección horizontal del pozo, el procedimiento correcto mantiene el volumen de pileta **aproximadamente constante** — no disminuyendo mientras el lodo de matanza llena la sección horizontal. La geometría horizontal no cambia la lógica subyacente de balance de volumen de una matanza correctamente ejecutada: lo que se bombea hacia adentro debe corresponder con lo que sale, sin importar el ángulo del pozo.

## 2. Presión de fondo manteniendo constante la presión de tubería durante la migración

Cerrado con SIDPP 400 psi / SICP 600 psi, ambas subiendo por migración de gas. Si la presión de tubería se mantiene constante en 400 psi, la presión de fondo **se mantiene igual** — no aumenta. Mantener constante la presión de tubería mientras el gas migra es exactamente el punto de la técnica: mantiene estable la presión de fondo mientras se permite que la presión de revestimiento suba (y se purgue en pasos controlados) para acomodar el gas en expansión.

## 3. Presión de fondo cuando un flotador falla y el lodo hace efecto U

Revestimiento corrido con un conjunto flotador de no retorno, sin mantenerse lleno, zapata a 3,000 ft. Si el flotador falla y el lodo hace efecto U hacia arriba dentro del revestimiento, la presión de fondo **disminuye** — no se mantiene igual "debido al efecto U-tube". El efecto U-tube es precisamente lo que está removiendo presión hidrostática del lado del anular; asumir que se cancela invierte el mecanismo.

## 4. Qué manómetro indica la presión de formación

Cerrado en una surgencia con la barrena en el fondo, la presión de formación se calcula a partir del **manómetro de presión de tubería**, no el manómetro de presión de revestimiento. La presión de tubería refleja una columna de lodo limpia sin influjo en ella, lo cual es lo que la hace utilizable para ese cálculo — el lado del revestimiento tiene el fluido de la surgencia mezclado y no es una lectura limpia.

## 5. Presión de fondo manteniendo constante la presión de revestimiento durante la migración

Mismo escenario de gas migrando, pero esta vez la presión de revestimiento se mantiene constante en 600 psi. Ahora la presión de fondo **disminuye** — lo opuesto del caso anterior con la tubería constante. Mantener constante la presión de revestimiento mientras el gas sigue migrando y expandiéndose significa que se debe permitir que la presión de tubería suba para compensar, y si no se permite, la BHP cae. Estos dos escenarios (mantener tubería constante vs. mantener revestimiento constante) son imágenes espejo el uno del otro, y confundirlos es el error más común en todo este tema.

## 6. Manteniendo BHP constante mientras se hace stripping hacia adentro

Haciendo stripping hacia el pozo sin migración de influjo, la presión de fondo constante se mantiene **purgando el desplazamiento de extremo cerrado de la sarta de perforación** a medida que entra cada parada — no bombeando un volumen equivalente hacia el pozo. La tubería entrando a un pozo lleno desplaza fluido; el movimiento de control de pozos es dejar salir ese volumen desplazado, no agregar más encima.

## 7. SIDPP y SICP subiendo juntas después de estabilizarse

Después de 15 minutos de presiones de cierre estables, tanto la SIDPP como la SICP comienzan a subir lentamente por la misma cantidad. La causa probable es **el influjo migrando hacia arriba por el pozo** — no un segundo influjo entrando al pozo, lo cual típicamente mostraría una firma de presión diferente (no un aumento gradual y emparejado en ambos manómetros).

## 8. Verificando presión atrapada correctamente

La verificación correcta de presión atrapada es **purgar una pequeña cantidad de presión del estrangulador, cerrar el pozo de nuevo, y observar el manómetro** — no purgar toda la presión hasta 0 psi primero. Purgar todo arriesga quedar subbalanceado antes de confirmar con qué se está lidiando; una purga pequeña da la misma información diagnóstica (si la presión vuelve a subir, o se mantiene estable) sin ese riesgo.

## 9. Qué sucede si el gas migra sin flotador en la sarta

Si el gas migra después del cierre sin flotador en la sarta de perforación, **tanto la presión de tubería como la del anular aumentarán** — las presiones de cierre no se mantendrán constantes. Sin un flotador aislando la sarta, la presión se comunica libremente entre la tubería y el anular, así que una surgencia migrando aparece en ambos manómetros, no solo en uno.

## 10. Por qué la SIDPP y la SICP leen diferente

Pozo vertical, conjunto de superficie, surgencia tomada y cerrada: SIDPP 350 psi, SICP 450 psi. La diferencia existe porque **el influjo está en el anular y tiene menor densidad que el lodo** — no porque el influjo tenga *mayor* densidad. Una columna de influjo más ligera proporciona menos presión hidrostática en el lado del anular, que es exactamente por qué la presión de revestimiento lee más alto que la presión de tubería en este escenario.

## 11. Encontrando la ICP sin conocer la presión de SCR

Cerrado en una surgencia sin conocer la presión de régimen de circulación lento, el enfoque correcto es **seguir el procedimiento adecuado de arranque y leer el manómetro de tubería (menos cualquier margen de seguridad) una vez a régimen de matanza** — esa lectura es la ICP. Usar la SIDPP directamente como la presión de circulación se salta el paso de arranque que existe específicamente para establecer una presión segura y verificada.

## 12. Equipo específico para cerrar en operaciones con revestimiento

Cerrar una operación que involucra revestimiento requiere una **cruceta de transición (swage)** adecuada como el equipo específico — no una Válvula de Seguridad de Apertura Total, que es una herramienta de sarta de perforación usada en un contexto diferente (stripping/viajes de tubería), no un artículo específico para cierre con revestimiento.

## 13. Recuperación del trip tank mientras se hace stripping con presiones en aumento

Quince paradas fuera del fondo con una surgencia de gas tomada, presiones de cierre subiendo lentamente, haciendo stripping hacia adentro mientras se mantiene constante la presión de revestimiento — el volumen recuperado en el trip tank proviene de **tanto la expansión de gas (si el influjo está migrando) como el desplazamiento de extremo cerrado de la tubería** — no solo del desplazamiento. Ignorar el componente de migración subestima el volumen que se debería esperar ver, lo cual puede enmascarar un problema real.

## 14. Qué delegar después de un cierre exitoso

Una vez que el cierre está completo, una tarea apropiada para delegar a un miembro de la cuadrilla es **verificar fugas en las bombas, tuberías, y áreas de pileta** — no comunicar el plan de matanza a la cuadrilla, que es una responsabilidad de supervisión que no debería delegarse.

## 15. Señales de superficie cuando una surgencia de gas se disuelve en lodo base aceite

Una surgencia de gas que entra en solución en lodo base aceite típicamente se manifiesta en superficie como **una ganancia de pileta igual o menor al volumen de la surgencia** — no un caudal y nivel de pileta decrecientes. El gas permaneciendo en solución significa que no se está expandiendo como lo haría en lodo base agua, así que la firma de superficie es tenue en lugar de invertida.

## 16. Secuenciando un BOP interno después de una surgencia por swabbing

Barrena dentro del revestimiento, surgencia tomada por swabbing, FOSV instalada y cerrada en la tubería de perforación, sin flotador en la sarta, pozo cerrado en el anular. Antes de hacer stripping de regreso al fondo, el siguiente paso correcto es **instalar el BOP interno por encima de la FOSV, luego abrir la válvula de seguridad de la tubería de perforación** — no abrir la FOSV primero. Abrir la FOSV antes de que el BOP interno esté en su lugar remueve la barrera antes de que el reemplazo esté listo.

## 17. SIDPP y SICP con un influjo en una sección horizontal

Tomando una surgencia de gas mientras se perfora una sección horizontal, si el influjo está completamente dentro de esa sección horizontal, la SIDPP y la SICP leerán **aproximadamente lo mismo** — no la SICP mucho más alta que la SIDPP. En una sección horizontal no hay diferencia vertical significativa de altura entre las dos columnas de fluido en ese punto, que es lo que normalmente impulsa la diferencia SIDPP/SICP en un pozo vertical.

## 18. Efecto de la presión atrapada por un cierre temprano

Si un pozo se cierra antes de que las bombas se detengan completamente, y termina atrapada algo de presión, el efecto en el pozo es **sobrebalance adicional en todas las presiones**, no ningún efecto en absoluto. La presión atrapada se suma encima de la presión de formación real en todo el pozo, que es exactamente por qué verificar presión atrapada (ver #8) importa antes de proceder con una matanza.

## 19. Encontrando la SIDPP detrás de un flotador, método uno

Con un flotador en la sarta de perforación, una forma de encontrar la SIDPP es **bombear lentamente por la tubería de perforación hasta que la SICP comience a subir, luego detenerse — la lectura de presión de tubería menos la presión atrapada actual da la SIDPP.** El flotador bloquea una lectura directa del lado del anular, así que este método indirecto es cómo se recupera el número sin adivinar.

## 20. SIDPP cuando el influjo entra por swabbing debajo de la barrena

Si el influjo tomado por swabbing está debajo de la barrena, la SIDPP leerá **lo mismo que la SICP** — la sarta de perforación debajo de la barrena está expuesta al mismo influjo que el anular en ese escenario, así que la diferencia usual SIDPP/SICP de una columna de anular más ligera no aplica aquí.

---

Para las matemáticas detrás de la ICP, la FCP, y los programas de presión, la [calculadora de hoja de control de pozo](/es/calculators/kill-sheet) y la [calculadora de hoja de control horizontal](/es/calculators/kill-sheet-horizontal) ejecutan esto en vivo. La teoría de fondo está en la [página de referencia de control de pozos](/es/drilling/well-control). Una vez que una matanza realmente está en curso, mantener constante la presión correcta es donde más ocurren los [errores del Método del Perforador y Wait and Weight](/es/blog/drillers-method-wait-and-weight-mixups).
