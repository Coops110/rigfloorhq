---
title: "La Constante 0.052: Presión Hidrostática Explicada"
description: "De dónde viene el 0.052 en P = 0.052 × MW × TVD, por qué es un factor de conversión fijo y no una propiedad del lodo, y qué más se confunde al respecto."
publishDate: "2026-10-01"
author: "RigFloorHQ Team"
category: "Control de Pozos"
tags: ["presión hidrostática", "control de pozos", "peso de lodo", "fórmulas"]
faq:
  - q: "¿La constante 0.052 cambia para lodo base aceite, lodo sintético, o salmuera?"
    a: "No. 0.052 es un factor de conversión de unidades — solo convierte libras por galón a psi por pie. Es idéntico para lodo base agua, lodo base aceite, sistemas sintéticos, y salmuera. Lo que cambia entre esos fluidos es el peso de lodo en sí (ppg), no la constante que va delante de él."
  - q: "¿0.052 es exacto, o está redondeado?"
    a: "Está redondeado. El valor exacto es 1 ÷ 19.25, o equivalentemente 12 ÷ 231, que da 0.051948... La industria redondea esto a 0.052 para uso de campo. Para la mayoría del trabajo de control de pozos el error de redondeo es insignificante, pero vale la pena saber que es una aproximación si alguna vez estás reconciliando un cálculo a mano contra un resultado más preciso de software."
---

Todo curso de control de pozos enseña la misma fórmula en los primeros diez minutos: la presión hidrostática es igual al peso de lodo por la profundidad por 0.052. La mayoría memoriza el 0.052 de la misma forma en que memoriza un número de teléfono — una cadena de dígitos que funciona, sin saber por qué es ese número y no otro. Ese vacío importa, porque también es la razón por la que a veces hay confusión sobre si la constante "cambia" para diferentes tipos de lodo. No cambia, y entender por qué hace que toda la fórmula tenga sentido en lugar de ser solo algo en lo que metes números.

## La fórmula, completa

**P = 0.052 × MW × TVD**

Donde:
- **P** es la presión hidrostática, en psi
- **MW** es el peso de lodo, en libras por galón (ppg)
- **TVD** es la profundidad vertical verdadera, en pies

Pruébala en vivo con tus propios números en la [calculadora de presión hidrostática](/es/calculators/hydrostatic) — muestra esta fórmula exacta y se actualiza mientras escribes.

## De dónde viene realmente el 0.052

0.052 no es una propiedad medida del fluido de perforación. Es un factor de conversión de unidades, y puedes derivarlo tú mismo a partir de dos hechos que no tienen nada que ver con el petróleo y gas:

1. **Un galón estadounidense son 231 pulgadas cúbicas.** Esta es simplemente la definición legal de un galón — es cierta para agua, lodo, gasolina, o cualquier otra cosa que midas en galones.
2. **Una columna de fluido de un pie de alto parada sobre una pulgada cuadrada de base contiene 12 pulgadas cúbicas de ese fluido.** Un pie son 12 pulgadas, y la base es 1 pulgada cuadrada, así que el volumen es 12 in × 1 in² = 12 in³.

Junta eso: una columna de 1 pulgada cuadrada y 1 pie de alto de fluido contiene 12 ÷ 231 = 0.0519... galones. Multiplica el peso de un fluido en libras por galón por esa fracción, y obtienes el peso del fluido que está sobre esa pulgada cuadrada — lo cual, porque la presión es simplemente fuerza por unidad de área, es también la presión en libras por pulgada cuadrada que ejerce un pie de ese fluido.

**12 in³ ÷ 231 in³/gal = 0.051948... ≈ 0.052 gal/pie**

Esa es toda la derivación. Sin química, sin ajuste empírico, sin calibración específica de lodo — solo pulgadas cúbicas, divididas entre pulgadas cúbicas por galón. La industria redondea 0.0519 hacia arriba a 0.052 porque es lo bastante preciso para el trabajo de campo y más fácil de decir en voz alta en el piso de perforación.

## Por qué nunca cambia

Porque el 0.052 viene de la geometría de un galón y un pie — no de nada relacionado con el fluido de perforación — se aplica idénticamente sin importar qué haya en el pozo. Cambia un lodo base agua de 10 ppg por un lodo base aceite de 10 ppg, y la presión hidrostática a una profundidad dada sale exactamente igual, porque la fórmula nunca preguntó de qué estaba hecho el fluido. Solo preguntó cuánto pesa un galón de él. La constante convierte peso-por-galón en presión-por-pie; nunca estuvo haciendo doble función como sustituto del tipo de fluido.

Esta es la parte que confunde a la gente. Dos lodos con el mismo ppg pero química completamente distinta — lodo base agua cargado con barita contra un sistema sintético base aceite — producen presión hidrostática idéntica a la misma TVD. La gente a veces espera que el lodo base aceite "se comporte diferente" en la fórmula porque se comporta diferente en otros aspectos (reología, filtración, estabilidad térmica), pero la presión hidrostática no le importa nada de eso. Solo le importa el peso y la altura, y 0.052 es simplemente el puente de unidades entre ellos.

## Lo que sí cambia

Si el 0.052 es fijo, ¿qué es lo que realmente mueve la aguja de la presión hidrostática real en campo? Dos cosas, y ninguna es la constante:

- **El peso de lodo (MW).** Lodo más pesado significa más presión a la misma profundidad — esta es toda la razón por la que el peso de lodo se ajusta durante la perforación, y está cubierto a fondo en la [guía de peso de lodo](/es/drilling/mud-weight).
- **La profundidad vertical verdadera (TVD), no la profundidad medida.** En un pozo desviado u horizontal, la tubería puede recorrer miles de pies más que la distancia vertical hasta ese mismo punto — ver la distinción entre TVD y profundidad medida en la [referencia de Métodos para Matar un Pozo](/es/pillars/well-kill-methods). Mete la profundidad medida en esta fórmula en cualquier pozo que no sea verdaderamente vertical, y la respuesta estará mal, no porque la constante fallara, sino porque entró la profundidad equivocada.

## La versión métrica usa una constante distinta — la misma idea, unidades distintas

¿Trabajas en unidades SI (gravedad específica y metros en lugar de ppg y pies)? La constante equivalente es **0.0981**, usada como P (bar) = 0.0981 × SG × profundidad (m). Es un número distinto porque está convirtiendo unidades distintas — pero está construida exactamente de la misma forma: un factor fijo de geometría/conversión de unidades, no algo que varía por tipo de lodo tampoco. Si alguna vez ves 0.052 y 0.0981 juntos y te preguntas por qué no coinciden, esa es la razón — no son valores alternativos de la misma constante, son dos constantes distintas haciendo el mismo trabajo en dos sistemas de unidades distintos.

## Por qué vale la pena saberlo, no solo memorizarlo

Entender la derivación no cambia cómo usas la fórmula día a día — seguirás simplemente multiplicando peso de lodo por profundidad por 0.052. Pero sí logra dos cosas reales. Primero, aclara de forma definitiva la confusión de "¿cambia para diferentes lodos?", ya que la respuesta se vuelve obvia una vez que ves de dónde viene el número. Segundo, es el tipo de detalle fundamental que aparece en los exámenes de control de pozos de IWCF e IADC y en entrevistas con quien esté revisando si un candidato realmente entiende la presión o solo memorizó una fórmula — "¿de dónde viene el 0.052?" es una forma clásica de distinguir entre los dos.

---

Para la matemática completa detrás del peso de lodo de matanza, el MAASP, y el resto de las fórmulas que se construyen sobre esta constante, la [calculadora de presión hidrostática](/es/calculators/hydrostatic) y la [suite completa de calculadoras](/es/calculators) ejecutan todas y cada una en vivo. La referencia completa sobre presión hidrostática — presión de poro, presión de fractura, y la ventana de peso de lodo — es el [pilar de presión hidrostática](/es/pillars/hydrostatic-pressure). Para TVD vs. profundidad medida, métodos de matanza, y perforación con control de presión gestionado a nivel de supervisor, ver la referencia de [Métodos para Matar un Pozo](/es/pillars/well-kill-methods). Las formas comunes en que exactamente esta matemática de presión se malinterpreta en los exámenes está cubierta en [comportamiento de la presión de cierre y los conceptos que se malinterpretan](/es/blog/shut-in-pressure-behavior-explained). Para el procedimiento de cierre al que alimenta esta matemática, ver la [página de referencia de control de pozos](/es/drilling/well-control).
