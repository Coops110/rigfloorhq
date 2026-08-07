---
title: "Torque y Arrastre como Alerta Temprana: Leer la Tendencia, No el Número"
description: "Una cifra de torque no significa nada por sí sola. Lo que importa es la diferencia entre lo que el modelo predijo y lo que la sarta realmente hizo — y esa diferencia se abre varias conexiones antes de que el valor parezca alarmante."
publishDate: "2026-08-03"
author: "RigFloorHQ Team"
category: "Perforación"
tags: ["torque y arrastre", "factor de fricción", "pega de tubería", "limpieza del pozo", "peso al gancho", "datos de perforación"]
diagrams:
  - src: "/images/blog/torque-drag-trend.svg"
    alt: "Gráfico de torque frente a profundidad a lo largo de conexiones sucesivas. Una línea modelada discontinua sube de forma constante. La línea medida la sigue de cerca al principio, luego empieza a separarse, y la diferencia se ensancha con cada conexión hasta que la sarta se pega. El punto donde ambas divergen está marcado como el aviso real."
    title: "Torque medido divergiendo de la línea de fricción modelada"
faq:
  - q: "¿Cuál es la diferencia entre torque y arrastre?"
    a: "El torque es la resistencia rotacional que se siente al girar la sarta, medida en superficie como la carga necesaria para rotar. El arrastre es la resistencia axial al mover la sarta a lo largo del pozo, visible en la diferencia entre el peso al gancho al levantar, al asentar y al rotar fuera del fondo. Ambos provienen del contacto entre la sarta y la pared del pozo."
  - q: "¿Por qué un valor de torque no significa nada por sí solo?"
    a: "El torque depende de la profundidad, el ángulo, la lubricidad del lodo, la configuración de la sarta y el diámetro del pozo, así que una cifra totalmente normal en un pozo puede ser una advertencia seria en otro. La información está en la diferencia entre el torque medido y el que el modelo predijo para esas condiciones."
  - q: "¿Qué es un factor de fricción en el modelado de torque y arrastre?"
    a: "Es un único número calibrado que representa cuánta resistencia encuentra la sarta contra la pared del pozo. El modelo se ajusta para que las cargas previstas coincidan con las medidas al inicio de la sección, y ese factor calibrado se convierte en la referencia. Un factor de fricción en aumento indica que las condiciones se deterioran aunque el torque bruto aún parezca aceptable."
  - q: "¿Qué indican los pesos al levantar, al asentar y al rotar?"
    a: "El peso rotando fuera del fondo da el peso de la sarta con el arrastre axial prácticamente eliminado. El peso al levantar añade el arrastre actuando hacia abajo y el peso al asentar lo resta actuando hacia arriba. Comparar los tres separa un cambio real de fricción de un cambio de peso, y la dirección del cambio apunta a mecanismos distintos."
  - q: "¿Qué hace que el torque y el arrastre aumenten durante la perforación?"
    a: "Lo más habitual es una limpieza deficiente del pozo, donde las camas de recortes aumentan el contacto entre sarta y pared. Otras causas son la inestabilidad del pozo que estrecha el agujero, una pega diferencial que empieza a desarrollarse, el keyseating en una pata de perro, agujero subcalibrado y una lubricidad del lodo degradada."
  - q: "¿Con cuánta antelación avisa una tendencia de torque y arrastre?"
    a: "La divergencia respecto a la línea modelada suele aparecer varias conexiones antes de que el valor absoluto resulte llamativo. Esa diferencia es la ventana de aviso útil, y por eso la comparación contra un modelo calibrado importa más que vigilar una cifra bruta frente a un umbral mental."
---

El torque y el arrastre son la alerta temprana más constantemente disponible en un taladro, y de las más constantemente mal leídas. El error es casi siempre el mismo: mirar el número en lugar de la diferencia.

Una lectura de torque no es un diagnóstico. Depende de la profundidad, el ángulo, el diámetro del pozo, la configuración de la sarta y la lubricidad del lodo — así que una cifra del todo corriente en un pozo es una advertencia seria en otro. La información no está en el valor. Está en la diferencia entre lo que la sarta debería estar haciendo y lo que realmente hace.

## Puntos Clave

| Pregunta | Respuesta |
|---|---|
| ¿Qué es el torque? | Resistencia rotacional: la carga necesaria para girar la sarta. |
| ¿Qué es el arrastre? | Resistencia axial: visible en la separación entre pesos al levantar, asentar y rotar. |
| ¿Qué contiene realmente la señal? | La diferencia entre medido y modelado, expresada como factor de fricción. |
| ¿Cuándo llega el aviso? | Varias conexiones antes de que el valor bruto parezca alarmante. |
| ¿Causa más común de una tendencia al alza? | Limpieza deficiente — ver [limpieza del pozo en alto ángulo](/blog/hole-cleaning-high-angle-wells). |
| ¿Dónde termina? | [Pega de tubería](/pillars/stuck-pipe-and-fishing-operations), si la tendencia se toma como normal. |

## Torque, Arrastre y de Dónde Vienen

El **torque** es lo que cuesta rotar la sarta. El **arrastre** es lo que cuesta moverla a lo largo del pozo. Ambos surgen de la misma causa física: el contacto entre la sarta y la pared, multiplicado por la fricción que ese contacto produzca.

Cualquier cosa que aumente el contacto — una cama de recortes, un pozo que se cierra, una pata de perro que presiona la sarta contra la pared — eleva ambos. Cualquier cosa que aumente la fricción en el contacto, como una lubricidad degradada, hace lo mismo sin ningún cambio geométrico.

Esa causa compartida es la razón por la que se leen juntos. El torque por sí solo puede engañar; el torque y el arrastre moviéndose juntos, o llamativamente *no* juntos, reduce bastante las posibilidades.

## Los Tres Pesos

El arrastre no se mide directamente. Se deduce de tres lecturas de peso al gancho tomadas a la misma profundidad:

- **Rotando fuera del fondo** — la sarta gira pero no se mueve axialmente. El arrastre axial queda prácticamente eliminado, así que es lo más cercano al peso real de la sarta en el pozo.
- **Al levantar** — sacando. El arrastre se opone al movimiento, actúa hacia abajo y el peso al levantar es **mayor** que el peso rotando.
- **Al asentar** — bajando. El arrastre se opone de nuevo, ahora actuando hacia arriba, y el peso al asentar es **menor**.

La separación entre los tres es el arrastre. Tomar los tres importa porque separa un cambio real de fricción de un cambio de peso: si la sarta se hizo más pesada, los tres suben juntos. Si subió la fricción, la separación se ensancha mientras el peso rotando se mantiene.

La dirección también informa. Un peso al levantar que sube mientras el de asentar sigue normal apunta a algo que resiste específicamente el movimiento hacia arriba — el caso clásico es un keyseat, ya que la sarta baja libremente por la ranura y se atasca al salir.

## Modelado Frente a Medido

![Gráfico de torque frente a profundidad a lo largo de conexiones sucesivas. Una línea modelada discontinua sube de forma constante, mostrando el torque esperado para el factor de fricción planificado. La línea medida la sigue de cerca al principio, luego empieza a separarse, y la diferencia se ensancha con cada conexión hasta que la sarta se pega. El punto donde ambas líneas divergen por primera vez está marcado como el aviso real, varias conexiones antes de que el valor absoluto parezca alarmante.](/images/blog/torque-drag-trend.svg)

Aquí está toda la disciplina en una imagen.

Un modelo de torque y arrastre predice qué cargas deberían verse para una trayectoria, sarta y lodo dados, usando un **factor de fricción**: un único número calibrado que representa la resistencia que encuentra la sarta. Al inicio de la sección, el modelo se ajusta hasta que las cargas previstas coinciden con las medidas. Ese factor calibrado pasa a ser la referencia.

A partir de ahí, la pregunta útil no es «¿está alto el torque?» sino «**¿está subiendo el factor de fricción?**»

Fíjese en dónde se separan las dos líneas. Esa divergencia empieza varias conexiones antes de que el valor absoluto alcance algo que merezca una segunda mirada. Cuando la cifra bruta parece alarmante, la tendencia lleva horas corriendo.

Por eso también un modelo nunca calibrado es prácticamente inútil. Una predicción sin calibrar dice lo que haría un pozo de manual. Una calibrada dice lo que *este* pozo hacía ayer, que es la única comparación con sentido.

## Qué Significa Realmente una Tendencia al Alza

Una diferencia que se ensancha indica que la fricción aumenta. No dice por qué. En orden aproximado de probabilidad:

**Limpieza deficiente.** La causa más común con diferencia. Las camas de recortes aumentan el área de contacto en el lado bajo, y el efecto se acumula. La evidencia confirmatoria está en las zarandas: volumen de recortes por debajo de lo que implica el avance perforado. Se trata en [limpieza del pozo en alto ángulo](/blog/hole-cleaning-high-angle-wells).

**Inestabilidad del pozo.** Lutitas que se desmoronan o una formación que se cierra reducen el espacio. Busque derrumbes en lugar de recortes en las zarandas, y un pozo que admite más llenado del calculado.

**Pega diferencial en desarrollo.** Un arrastre creciente con circulación normal, especialmente tras conexiones sobre un intervalo permeable, puede ser la fase inicial de la tubería hundiéndose en el revoque — ver [pega diferencial](/blog/differential-sticking-explained).

**Keyseating.** Característicamente específico en dirección y profundidad: sobretensión a una profundidad constante al salir, con la bajada aún libre.

**Lubricidad del lodo.** Un cambio en las propiedades puede elevar la fricción sin ningún cambio geométrico, y por eso las comprobaciones de lodo forman parte de la misma conversación.

Lo importante de la lista es que un factor de fricción en aumento es un motivo para mirar, no una conclusión. La evidencia confirmatoria — zarandas, llenado, estado de la circulación, en qué dirección aprieta — es lo que separa estas causas.

## Cómo Hacer Legible la Tendencia

La tendencia solo vale lo que valga la consistencia de las mediciones que la construyen.

**Mismas condiciones.** Tome los pesos a la misma referencia de profundidad, con velocidades de rotación y bombeo consistentes. Lecturas tomadas en condiciones variables generan dispersión que oculta justo la señal que busca.

**La misma disciplina en cada conexión.** Una tendencia hecha con lecturas ocasionales cuando alguien se acordó no es una tendencia. Es poco vistoso y es todo el trabajo.

**Represéntela.** Una tabla de números esconde una divergencia que un gráfico hace evidente. Aquí es donde los sistemas de [datos de perforación en tiempo real](/blog/real-time-drilling-data) justifican su coste: no por medir algo nuevo, sino por hacer la comparación contra el modelo continua y visible.

**Registre el contexto.** Un escalón tras un viaje de barrena, un cambio de peso de lodo o un tramo deslizando es explicable. El mismo escalón sin nada que lo explique, no.

## El Otro Límite

El torque y el arrastre no son solo diagnósticos. También son una restricción dura.

El torque rotacional está limitado por el torque de enrosque de las conexiones y por la capacidad del top drive. El peso al gancho lo limitan el mástil y la resistencia a tracción de la junta más débil — que en tubería usada fija su clase de inspección y no el grado estampado, como se explica en la [página de la sarta de perforación](/equipment/drill-string).

Un torque alto además provoca desgaste del revestimiento, porque una sarta rotando bajo carga lateral desgasta el casing que atraviesa. En pozos de alcance extendido esto se convierte en una restricción de diseño y no en una molestia operativa, y es una de las razones por las que los perfiles se eligen para mantener el torque manejable en lugar de tomar la ruta más corta — ver [perforación direccional](/drilling/directional).

## Conclusión

El torque y el arrastre avisan con más antelación que casi cualquier otra cosa disponible, y avisan pronto — pero solo contra una referencia. El número por sí solo es ruido. La diferencia entre medido y modelado es la señal, y se abre mucho antes de que nada parezca dramático.

El hábito que conviene construir no tiene nada de espectacular: tomar los tres pesos de forma consistente, representarlos contra un modelo calibrado, y tratar la divergencia como un motivo para mirar las zarandas y no como algo que anotar y seguir. La mayoría de los eventos de pega eran visibles en estos datos horas antes.

Dónde termina si la tendencia se ignora, y cómo distinguir los mecanismos una vez que la sarta deja de moverse, está en [pega de tubería y operaciones de pesca](/pillars/stuck-pipe-and-fishing-operations).

## Preguntas Frecuentes

### ¿Cuál es la diferencia entre torque y arrastre?

El torque es la resistencia rotacional que se siente al girar la sarta, medida en superficie como la carga necesaria para rotar. El arrastre es la resistencia axial al mover la sarta a lo largo del pozo, visible en la diferencia entre el peso al gancho al levantar, al asentar y al rotar fuera del fondo. Ambos provienen del contacto entre la sarta y la pared del pozo.

### ¿Por qué un valor de torque no significa nada por sí solo?

El torque depende de la profundidad, el ángulo, la lubricidad del lodo, la configuración de la sarta y el diámetro del pozo, así que una cifra totalmente normal en un pozo puede ser una advertencia seria en otro. La información está en la diferencia entre el torque medido y el que el modelo predijo para esas condiciones.

### ¿Qué es un factor de fricción en el modelado de torque y arrastre?

Es un único número calibrado que representa cuánta resistencia encuentra la sarta contra la pared del pozo. El modelo se ajusta para que las cargas previstas coincidan con las medidas al inicio de la sección, y ese factor calibrado se convierte en la referencia. Un factor de fricción en aumento indica que las condiciones se deterioran aunque el torque bruto aún parezca aceptable.

### ¿Qué indican los pesos al levantar, al asentar y al rotar?

El peso rotando fuera del fondo da el peso de la sarta con el arrastre axial prácticamente eliminado. El peso al levantar añade el arrastre actuando hacia abajo y el peso al asentar lo resta actuando hacia arriba. Comparar los tres separa un cambio real de fricción de un cambio de peso, y la dirección del cambio apunta a mecanismos distintos.

### ¿Qué hace que el torque y el arrastre aumenten durante la perforación?

Lo más habitual es una limpieza deficiente del pozo, donde las camas de recortes aumentan el contacto entre sarta y pared. Otras causas son la inestabilidad del pozo que estrecha el agujero, una pega diferencial que empieza a desarrollarse, el keyseating en una pata de perro, agujero subcalibrado y una lubricidad del lodo degradada.

### ¿Con cuánta antelación avisa una tendencia de torque y arrastre?

La divergencia respecto a la línea modelada suele aparecer varias conexiones antes de que el valor absoluto resulte llamativo. Esa diferencia es la ventana de aviso útil, y por eso la comparación contra un modelo calibrado importa más que vigilar una cifra bruta frente a un umbral mental.
