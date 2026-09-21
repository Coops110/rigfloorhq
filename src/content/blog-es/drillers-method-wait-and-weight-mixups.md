---
title: "Método del Perforador y Wait and Weight: Confusiones Comunes"
description: "Dónde el Método del Perforador, Wait and Weight, y el Método Volumétrico se confunden entre sí — qué presión mantener constante, cómo se ve realmente un pozo balanceado, y el razonamiento detrás de cada respuesta."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Control de Pozos"
tags: ["control de pozos", "hoja de control de pozo", "método del perforador", "wait and weight", "entrenamiento"]
faq:
  - q: "¿Son estas preguntas oficiales de examen IWCF o IADC?"
    a: "El tema sigue la teoría estándar de control de pozos de IWCF/IADC, pero esta publicación no está afiliada a ninguno de los dos organismos y no sustituye una certificación acreditada. Trátala como material de estudio, no como material de examen."
---

El Método del Perforador y el Método Wait and Weight comparten mucha lógica subyacente, que es exactamente por qué es tan fácil aplicar la regla de uno al otro por error — mantener constante la presión equivocada, o leer un punto de control al revés. Aquí es donde eso sucede más.

## 1. Qué significa realmente que la SIDPP y la SICP difieran

Un pozo se cierra en una surgencia. La SIDPP marca 350 psi, la SICP marca 900 psi. Este es un **pozo balanceado** — la presión en el fondo es igual en ambos lados del tubo en U — no uno desbalanceado. La SIDPP y la SICP se leen en dos puntos distintos de dos columnas de fluido distintas (lodo de la sarta de perforación vs. anular, ahora parcialmente desplazado por el fluido de la surgencia), así que no hay razón para esperar que coincidan. En el momento en que ambos manómetros se han estabilizado y dejado de subir, el pozo está en equilibrio estático — eso es lo que "balanceado" realmente significa aquí, no "ambos manómetros marcan el mismo número".

## 2. Qué debe marcar la presión de revestimiento después de la segunda circulación

Durante la segunda circulación del Método del Perforador, una vez que el lodo de peso de matanza llega a la barrena y la bomba se detiene, la presión de revestimiento debe marcar la **SIDPP original** si no hay presión atrapada — no una cifra calculada de diferencia hidrostática. Este es un punto de control real que vale la pena memorizar, no calcular de nuevo cada vez: con el lodo de matanza ahora llenando la sarta de perforación y sin presión atrapada, la presión de revestimiento en ese momento exacto debe regresar al mismo número que tenía en el cierre inicial.

## 3. Qué hacer cuando el suministro de barita se tapona a mitad de la circulación

Durante la primera circulación del Método Wait and Weight, si el suministro de barita se tapona, la decisión correcta es **informar al supervisor y recomendar cerrar el pozo mientras se repara el bloqueo** — no seguir circulando mientras la cuadrilla lo arregla. Continuar circulando con un sistema de aumento de peso poco confiable arriesga meter el peso de lodo equivocado al fondo a mitad de la matanza.

## 4. Presión de fondo cuando la presión de revestimiento corre alta durante el arranque

Llevando las bombas a velocidad de matanza, si se permite que la presión de revestimiento suba por encima de la SICP, la presión de fondo **aumenta y puede exceder la presión de fractura de la formación** — no disminuye. Permitir que la presión de revestimiento corra por encima de la SICP durante el arranque de bomba agrega presión en el fondo del pozo, no menos — el riesgo real es fracturar la formación, no tomar más influjo.

## 5. Qué presión mantener constante durante la segunda circulación

Bombeando lodo de matanza por la sarta de perforación durante la segunda circulación del Método del Perforador, con el anular ya limpio de influjo, el programa mantiene **constante la presión de revestimiento** — no la presión de tubería. Una vez que el anular está limpio, el control cambia a ajustar el estrangulador para mantener estable la presión de revestimiento mientras la densidad del lodo de matanza cambia en el fondo. Las dos circulaciones del Método del Perforador genuinamente mantienen constantes manómetros diferentes, y confundirlos a mitad del trabajo es un error real y consecuente.

## 6. Presión de una burbuja de gas migrando sin ninguna acción tomada

Si una burbuja de gas está migrando sin ninguna acción tomada, su presión se **mantendrá aproximadamente igual** mientras sube — no aumentará. El gas se expande mientras se mueve hacia territorio de menor presión más arriba en el pozo, lo cual mantiene su propia presión interna relativamente estable incluso mientras las presiones de superficie suben por esa expansión.

## 7. La presión que realmente se quiere mantener constante

Circulando un influjo hacia afuera, la presión que se quiere mantener constante es la **presión de fondo** — no la presión de revestimiento, que es el número que se está vigilando, no el número que realmente se está protegiendo. La regla específica de mantener presión constante de cada método de matanza (tubería constante, revestimiento constante) existe únicamente como un medio para ese fin.

## 8. Volumen de gas mientras una surgencia se circula correctamente hacia afuera

Mientras una surgencia de gas se circula correctamente hacia afuera, el volumen de gas **aumenta** — no se mantiene igual. La presión decreciente mientras el gas sube por el anular le permite expandirse; una matanza correctamente ejecutada toma en cuenta esa expansión en lugar de asumir un volumen fijo durante todo el proceso.

## 9. Presión de bomba después de una circulación completa con peso de lodo reducido

Después de una circulación completa con el peso de lodo disminuido, la presión de bomba **disminuirá** — no aumentará. Lodo más ligero significa menos presión de fricción moviéndose por el mismo sistema, sencillo pero fácil de confundir al revés si se está pensando en presión hidrostática en lugar de presión de bomba.

## 10. Usando una hoja de control vertical en un pozo horizontal

Matando un pozo con una sección horizontal usando el método Wait and Weight, usar una hoja de control vertical por error significa **aplicar demasiada presión al pozo** — no muy poca. Un programa vertical asume una relación hidrostática basada en TVD que no se mantiene de la misma forma una vez que el pozo se vuelve horizontal, y el desajuste corre en dirección de sobrepresionar, no subpresionar.

## 11. Presión máxima en la zapata de revestimiento con el Método Volumétrico

Usando el Método Volumétrico en un pozo vertical, la presión máxima en la zapata de revestimiento ocurre **cuando la parte superior del gas está en la zapata de revestimiento** — no una vez que el gas llega a superficie. Una vez que el gas ha pasado la zapata, el diferencial de presión en ese punto en realidad comienza a disminuir; la zapata ve su peor momento mientras el gas todavía está justo ahí.

## 12. Presión que todavía se muestra en el manómetro de tubería sin presión atrapada

KWM bombeado hasta la barrena al inicio de una matanza Wait and Weight, bombas detenidas, presión verificada. El manómetro de tubería todavía muestra presión y se ha descartado presión atrapada. La situación es que la **tubería de perforación todavía está subbalanceada, o el conteo de carreras usado no fue correcto** — no que un efecto U-tube del KWM simplemente esté agregando presión sin nada sobre qué actuar. Asumir que "es solo efecto U-tube" cuando los números no cuadran es cómo un subbalance real se pasa por alto.

## 13. Presión en la zapata de revestimiento mientras pasa una burbuja de gas

Durante la primera circulación del Método del Perforador, una burbuja de gas subiendo por el anular pasa la zapata de revestimiento, con la presión de tubería correctamente mantenida constante — la presión en la zapata de revestimiento **se mantiene constante**. No aumenta. Mantener constante la presión de tubería es específicamente lo que mantiene estable la presión de fondo (y por extensión, la de la zapata) durante esta etapa.

## 14. Presión de tubería que regresa al mismo valor después de reverificar

Mismo escenario que arriba, pero después de circular y volver a probar, la presión de tubería regresa exactamente a la misma lectura — sin presión atrapada, todavía no en cero. El movimiento correcto es **circular algunas carreras más, luego cerrar y verificar de nuevo** — no asumir que el pozo todavía no está muerto solo porque el KWM no ha llegado a superficie. Una lectura idéntica repetible vale una verificación más antes de concluir cualquier cosa.

## 15. Qué no debe variar al desplazar una sarta cónica (tapered)

Desplazando lodo de peso de matanza a través de un pozo con una sarta de perforación cónica, el parámetro que **no** debe variar mientras se desplazan las diferentes secciones de tubería es la **presión de fondo** — se espera que la caída de presión por cada 100 carreras bombeadas cambie a medida que la geometría de la sarta cambia; la BHP es lo que todo el programa está construido para mantener estable sin importar qué.

## 16. Cómo el tamaño de la surgencia afecta a la SICP, no a la SIDPP

Un pozo cerrado en una surgencia de 25 bbl marca 300 psi de SIDPP / 650 psi de SICP. Si el mismo pozo hubiera tomado una surgencia más pequeña, de 10 bbl, en su lugar, **la SICP sería más baja** — la SIDPP no cambiaría, ya que la SIDPP refleja la presión de formación, no el tamaño de la surgencia. El tamaño de la surgencia afecta cuánto de la columna del anular fue reemplazado por influjo más ligero, que es un efecto del lado de la presión de revestimiento, no del lado de la tubería.

## 17. Presión de fondo manteniendo constante la Presión de Circulación Final

Manteniendo constante la Presión de Circulación Final mientras el lodo de matanza circula por el anular hacia arriba, la presión de fondo **se mantiene igual** — no aumenta. La FCP se calcula específicamente para que mantenerla constante en el camino hacia arriba mantenga la BHP, la misma lógica de "mantener un manómetro estable para proteger al otro" en todos los métodos de matanza.

## 18. Cuándo Wait and Weight supera al Método del Perforador en presión de zapata

Wait and Weight da una presión de zapata de revestimiento más baja que el Método del Perforador específicamente cuando **la capacidad del anular en hoyo abierto es mayor que la capacidad de la sarta de perforación** — no al revés. Las capacidades relativas de los dos lados determinan qué método ejerce menos tensión sobre la zapata, y es fácil asumir que la comparación va al revés.

## 19. Presión de revestimiento a medida que un influjo se mueve de horizontal a vertical

A medida que un influjo de gas se mueve de una sección horizontal hacia la sección vertical del pozo, la presión de revestimiento **aumentará** — no se mantendrá igual. Una vez que el gas llega a hoyo vertical, su expansión comienza a traducirse en un efecto de presión real basado en altura que una sección puramente horizontal no produce.

## 20. Presión de fondo manteniendo constante la presión de tubería (práctica incorrecta)

Bombeando lodo de matanza hasta la barrena mientras se mantiene plana la presión de tubería, sin ajustarla al programa de reducción escalonada a medida que lodo más pesado baja, la presión de fondo en realidad **aumentará** — no se mantendrá igual. Una vez que el lodo de matanza más denso comienza a ocupar más de la sarta, mantener estático el número de superficie (en lugar de seguir el programa calculado) significa que el peso hidrostático agregado no se está compensando, y la BHP sube.

---

La [calculadora de hoja de control de pozo](/es/calculators/kill-sheet) y la [calculadora de hoja de control horizontal](/es/calculators/kill-sheet-horizontal) construyen estos mismos programas de presión, y la [calculadora de bombeo a matar](/es/calculators/bullheading) cubre un método alternativo relacionado. Varios de los escenarios anteriores asumen un pozo ya correctamente cerrado — ver [comportamiento de la presión de cierre](/es/blog/shut-in-pressure-behavior-explained) para lo que sucede antes de esta etapa.
