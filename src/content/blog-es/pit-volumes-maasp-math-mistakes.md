---
title: "Volúmenes de Pileta y MAASP: Dónde se Malinterpretan las Matemáticas"
description: "Razonamiento sobre tolerancia a la surgencia, MAASP, ballooning, y volúmenes de pileta que suena correcto pero no lo es — y la lógica correcta detrás de cada respuesta."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Control de Pozos"
tags: ["control de pozos", "MAASP", "tolerancia a la surgencia", "entrenamiento"]
faq:
  - q: "¿Son estas preguntas oficiales de examen IWCF o IADC?"
    a: "El tema sigue la teoría estándar de control de pozos de IWCF/IADC, pero esta publicación no está afiliada a ninguno de los dos organismos y no sustituye una certificación acreditada. Trátala como material de estudio, no como material de examen."
---

MAASP, tolerancia a la surgencia, y ballooning involucran todos la misma idea subyacente — cuánta presión extra puede absorber realmente el punto débil del pozo — pero cada una se aplica mal de forma distinta. Aquí es donde el razonamiento normalmente se rompe.

## 1. Un flotador autollenante y cemento más pesado

Si un flotador autollenante no logra convertirse en válvula de retención, y el cemento que se está desplazando es más pesado que el lodo que lo empuja, el riesgo es que **el cemento podría hacer efecto U de regreso hacia arriba dentro del revestimiento una vez que las bombas se detienen** — no que se necesite mantener presión en el anular. La conversión fallida es lo que remueve la barrera que normalmente prevendría ese contraflujo.

## 2. Por qué importa la capacidad de reserva de pileta al circular una surgencia hacia afuera

La capacidad de reserva en el sistema de pileta activa existe porque **una surgencia de gas se expandirá y el nivel de pileta aumentará** a medida que se circula hacia afuera — el espacio de reserva no está ahí para "almacenar" el fluido de la surgencia como lo haría un contenedor; está ahí para absorber el aumento de volumen por la expansión.

## 3. Qué significa realmente una tolerancia a la surgencia de 25 barriles

Una tolerancia a la surgencia de 25 barriles significa que, a una intensidad de surgencia elegida, **25 bbl es la surgencia de gas máxima que se puede cerrar y circular hacia afuera sin fracturar el punto débil del pozo** — no sin reventar el revestimiento superficial. El factor limitante en la tolerancia a la surgencia siempre es el punto débil en el fondo (usualmente la zapata del revestimiento), no el equipo de superficie.

## 4. Pérdidas en la conexión que regresan cuando se reanuda el bombeo

Perdiendo lodo a 15 bbl/hr, con el pozo fluyendo en las conexiones, y las pérdidas recurriendo una vez que las bombas se reinician — la explicación probable es **ballooning**, no swabbing. El swabbing no explicaría pérdidas que continúan una vez que se reanuda la circulación; el patrón de encendido/apagado de bomba del ballooning (ver la publicación de señales de advertencia) encaja exactamente con este conjunto de síntomas.

## 5. La prioridad cuando la presión de revestimiento se acerca a la MAASP a mitad de una matanza

Circulando una surgencia hacia afuera en un pozo profundo, la presión de revestimiento acercándose a la MAASP mientras el influjo todavía está en hoyo abierto — la acción más importante es **minimizar cualquier presión anular extra sin dejar que la presión de fondo caiga por debajo de la presión de poro** — no simplemente mantener la presión de revestimiento en la MAASP abriendo el estrangulador. Perseguir la MAASP como un objetivo fijo ignora el riesgo real del otro lado: quedar subbalanceado.

## 6. El riesgo real de purgar lodo durante sospecha de ballooning

Si aparecen síntomas de ballooning y se decide purgar 10 bbl de regreso al trip tank, el peligro real es que **si en realidad era una surgencia y no ballooning, esa surgencia acaba de crecer** — no que el gradiente de fractura mismo disminuiría (el gradiente de fractura es una propiedad de la roca, no algo que una purga cambie). Malinterpretar el ballooning como el diagnóstico más seguro es la trampa aquí.

## 7. Una ganancia de pileta de 10 barriles en 15 minutos

Reportada una ganancia de pileta de 10 bbl en 15 minutos, la acción más segura es **realizar un chequeo de flujo** — no llamar primero al Toolpusher para pedir consejo. Confirmar si el pozo realmente está fluyendo viene antes de escalar; un chequeo de flujo es rápido y es el paso que indica si esto es realmente urgente.

## 8. Sin ganancia de pileta con las bombas corriendo, pero flujo con las bombas apagadas

Si el pozo fluye con las bombas apagadas pero no muestra ganancia de pileta con las bombas corriendo, lo que sucede en el fondo es que **la pérdida de presión por fricción anular está proporcionando suficiente sobrebalance extra mientras se bombea para enmascarar el influjo** — no que la hidrostática del lodo sola exceda la presión de formación cuando las bombas están encendidas. Es la presión de fricción *adicional* la que está enmascarando, no el peso de lodo estático por sí solo.

## 9. Cuándo aplica realmente el Método Volumétrico

El Método Volumétrico es para **cuando el gas está migrando y no se puede establecer circulación por debajo del influjo** — no específicamente para cuando el gas ya llegó a superficie y la SICP se ha estabilizado, que es una condición más limitada y de etapa posterior de lo que el método está diseñado para atender.

## 10. Stripping barril-por-barril con una surgencia migrando

Usar la técnica de stripping barril-adentro/barril-afuera mientras un influjo está migrando activamente conlleva un riesgo real: **no permite que el gas se expanda**, lo cual puede crear una condición sobrebalanceada capaz de fracturar el punto débil del pozo — lo opuesto del riesgo de subbalance/influjo adicional que parece más intuitivo a primera vista. Bloquear la expansión del gas acumula presión en lugar de liberarla.

---

Para las matemáticas de volumen y MAASP mismas, la [calculadora de hoja de control de pozo](/es/calculators/kill-sheet) y la [calculadora de migración de gas](/es/calculators/gas-migration) ejecutan esto en vivo, y la [página de referencia de control de pozos](/es/drilling/well-control) cubre la teoría subyacente. Los cálculos de presión hidrostática detrás de la tolerancia a la surgencia se cubren con más profundidad en [conceptos de presión que se malinterpretan](/es/blog/well-control-pressure-concepts-misread).
