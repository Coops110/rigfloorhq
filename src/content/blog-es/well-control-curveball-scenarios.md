---
title: "Curvas de Control de Pozos: Escenarios Más Difíciles"
description: "Problemas de presión trabajados y escenarios límite de control de pozos — separadores de gas de lodo, lecturas de PWD, pruebas de BOP."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Control de Pozos"
tags: ["control de pozos", "hoja de control de pozo", "entrenamiento"]
faq:
  - q: "¿Son estas preguntas oficiales de examen IWCF o IADC?"
    a: "El tema sigue la teoría estándar de control de pozos de IWCF/IADC, pero esta publicación no está afiliada a ninguno de los dos organismos y no sustituye una certificación acreditada. Trátala como material de estudio, no como material de examen."
---

Un puñado de escenarios de control de pozos no encajan limpiamente bajo presión, métodos de matanza, o condiciones de cierre — son los que combinan dos ideas a la vez, o dependen de un número fácil de derivar mal. Aquí están, trabajados correctamente.

## 1. Reducción en la presión de fondo tras pérdidas severas (cifra trabajada)

Ocurren pérdidas severas, no se puede ver lodo en el pozo, y el anular se llena por arriba con agua. Peso de lodo 12 ppg, salmuera 8.6 ppg, 150 ft de agua en el anular. La reducción en la presión de fondo es de **26 psi**, trabajado como (12 − 8.6) ppg × 0.052 × 150 ft = 26.52 ≈ 26 psi — no 67 psi. Esa cifra equivocada usualmente viene de aplicar la diferencia de densidad contra la profundidad equivocada, o de omitir la constante de conversión 0.052. Siempre aísla exactamente qué intervalo ocupa realmente el fluido más ligero antes de multiplicar.

## 2. Diferencial de presión a través de un tapón de cemento (cifra trabajada)

Un tapón de cemento de 500 ft está dentro de la zapata de revestimiento, con la parte superior del tapón a 8,200 ft. El lodo debajo del tapón es de 11.8 ppg, la salmuera que desplaza al lodo por encima es de 8.6 ppg. El diferencial de presión a través del tapón es de **1,671 psi** — no 1,364 psi, que es lo que se obtiene si solo se toma en cuenta la diferencia de densidad sobre los 8,200 ft por encima del tapón y se olvida que el tapón tiene longitud real. El cálculo completo agrega un segundo término para esa longitud: (11.8 − 8.6) × 0.052 × 8,200 = 1,364, más 500 × 11.8 × 0.052 = 307, para un total de 1,671 psi. Olvidar que un tapón ocupa profundidad real — no solo un punto — es exactamente lo que produce la respuesta incorrecta común.

## 3. El peligro real de circular una surgencia de gas por el múltiple de estranguladores

Uno de los peligros reales de circular una surgencia de gas por el múltiple de estranguladores es que **el volumen de gas aumentado puede sobrecargar el separador de gas del lodo** — no que aumenta la presión de fondo. El separador tiene una capacidad finita; una surgencia de gas suficientemente grande puede excederla, lo cual es un riesgo de equipo de superficie distinto de cualquier cosa sucediendo en el fondo en ese punto.

## 4. Qué causa realmente una reducción de ECD en una herramienta PWD

Una herramienta de Presión Mientras se Perfora mostrando una reducción en la ECD se explica más probablemente por **una pérdida de sobrebalance, con fluido de formación contaminando el lodo en el anular** — no un cambio en el ROP, que no afecta directamente una lectura basada en presión como la ECD.

## 5. Eligiendo un método de matanza cuando el volumen barrena-zapata excede el volumen de la sarta

En un pozo donde el volumen barrena-zapata es mayor que el volumen de la sarta de perforación, el método de matanza que minimiza el riesgo de pérdidas es el **Método Wait and Weight** — no el Método Volumétrico, que ni siquiera es un método general de matanza por circulación para empezar y no atiende esta relación de volumen en particular.

## 6. Por qué las válvulas de salida lateral permanecen abiertas durante una prueba de tapón de prueba del BOP

Probando un stack de BOP de superficie con un tapón de prueba, las válvulas de salida lateral debajo del tapón se mantienen abiertas específicamente **para verificar que el tapón de prueba no esté goteando** — no para prevenir un bloqueo de presión. Si el tapón estuviera sellando incorrectamente, presión apareciendo debajo de él a través de esas válvulas abiertas es exactamente cómo se detectaría.

## 7. SICP leyendo 300 psi alto después de la primera circulación

Se completa la primera circulación del Método del Perforador, bombas detenidas, y la SICP marca 300 psi más alto que la SIDPP original. La respuesta correcta es **reanudar la circulación y continuar hasta que el influjo esté completamente afuera y la SICP sea igual a la SIDPP** — no saltar directamente a bombear lodo de matanza hasta la barrena mientras se mantiene constante la presión de revestimiento. Un desajuste entre la SICP y la SIDPP en este punto de control significa que la primera circulación en realidad no ha terminado todavía.

---

## Dos Escenarios Específicos de Operaciones Submarinas

*(Las preguntas submarinas tienden a ser más cortas pero más densas — un manómetro equivocado, y toda la respuesta se invierte.)*

### Qué manómetros caen mientras el preventor anular está cerrando

En el panel remoto de BOP, la caída de presión aparece en los manómetros de **presión de acumulador y presión anular** — no presión de manifold y presión de acumulador.

### Para qué están calificados realmente los BOP de arietes de diámetro fijo

Están diseñados para contener la Presión de Trabajo Nominal **solo desde abajo del ariete cerrado** — no "no se pueden usar para colgar la sarta de perforación", una afirmación separada e incorrecta.

---

Para las matemáticas subyacentes, la [calculadora de hoja de control de pozo](/es/calculators/kill-sheet) y la [calculadora de presión hidrostática](/es/calculators/hydrostatic) ejecutan estas fórmulas en vivo. Para las matemáticas específicas submarinas, la [calculadora de margen de riser](/es/calculators/riser-margin) ejecuta la fórmula de margen de riser. El concepto de PWD/ECD en la #4 de arriba se cubre desde un ángulo diferente en [fundamentos de control de pozos](/es/blog/well-control-basics), y el procedimiento de cierre que estos escenarios asumen está en la [página de referencia de control de pozos](/es/drilling/well-control). El material a nivel supervisor detrás de varios de estos casos límite — MPD, consideraciones regionales de matanza — está en la [guía de Control de Pozos Avanzado](/es/pillars/advanced-well-control-and-hydrostatics), y las cinco señales de advertencia sobre las que se construyen estos escenarios están en [cinco señales de advertencia de una surgencia](/es/blog/five-warning-signs-of-a-kick).
