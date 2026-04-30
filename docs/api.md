# Paso 11. Backend y API
El backend es el cerebro central (servidor) donde se guardan los datos para que sean accesibles desde cualquier parte del mundo por cualquier usuario, en cualquier navegador

En resumen ahora nos toca darle una "memoria" permanente y segura que no dependa solo del navegador propio.

    Tenemos 3 objetivos:
        1. La Persistencia Real (Adiós al LocalStorage)
        Hasta ahora, si guardabamos un producto "Dragón Rojo" en el LocalStorage y se abría la web desde otro ordenador, ya no se vería nada.

        2. Integración de Sistemas (Fase Full-Stack)
        Necesitaremos:
            Un Frontend (React): La cara bonita que el usuario toca.  

            El Backend (Node/Express): El motor que procesa la lógica, valida que los datos sean correctos y se comunica con la base de datos.  

            Y un API: El puente o "túnel" que permite que ambos hablen.

        3. 3. Seguridad y Validación "en la frontera"
        Ademas nos piden validación "en la frontera de red". El El backend será una segunda línea de defensa


1. Estructura del Backend