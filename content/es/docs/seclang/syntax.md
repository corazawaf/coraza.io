---
title: "Sintaxis"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 10
toc: true
---

El lenguaje original para configurar el módulo de Apache ModSecurity era un conjunto de directivas de extensión del lenguaje de configuración de Apache. Esta extensión permite generar una Política de Seguridad en la que se toma una decisión de control de acceso basada en un conjunto de parámetros. Las directivas pueden utilizarse para configurar el motor en sí, pero también para enviar instrucciones al motor para el control de acceso. Las directivas tienen el aspecto de los ejemplos siguientes:

```modsecurity
SecDirective1 some options
SecDirective2 "some option between brackets \" and escaped"
```

```modsecurity
SecSampleDirective this \
    directive \
    is splitted \
    in lines

```

## Sintaxis de reglas

Las reglas son una directiva especial que debe contener variables, operador y acciones: ```SecRule VARIABLES "@OPERATOR OPERATOR_ARGUMENTS" "ACTIONS"```.

* Todas las reglas **deben** tener una acción de ID única, por ejemplo ```"id:1"```.
* Si no se especifica una acción de **phase** (fase), la fase por defecto será la 2 (cuerpo de la solicitud).
* Las reglas solo pueden contener una acción disruptiva.
* Se pueden definir más acciones por defecto con [SecDefaultAction]({{< relref "directives/#SecDefaultAction" >}}).

```modsecurity
SecRule REMOTE_ADDR "127.0.0.1" "id:1, phase:1, pass, log, logdata:'Request from localhost'"
```

### Variables

Las variables son una estructura de CLAVE:VALOR(ES). Algunas variables son objetos mapeados que contienen ```KEY:[VALUE1,VALUE2,VALUE3]```, mientras que otras son simplemente ```KEY:VALUE```. Si se solicita una variable sin ningún parámetro, devolverá todos los valores de cada clave; si es una variable ```KEY:VALUE```, devolverá un único valor. Los parámetros de las variables utilizan la sintaxis ```VARIABLE:PARAMETER```.

**Clave de variable**

Las variables pueden consultarse por una clave específica sin distinción de mayúsculas y minúsculas, por ejemplo:

```modsecurity
SecRule REQUEST_HEADERS:user-agent "@contains firefox" "id:1, pass, log, logdata:'someone used firefox to access'"
```

**Variable con expresión regular**

(Solo v2): Se puede utilizar una expresión regular compatible con PCRE para consultar una VARIABLE mapeada como ARGS. El siguiente ejemplo coincidirá con todos los parámetros (GET y POST) cuya clave comience con ```param``` y cuyo valor sea ```someval```.

```modsecurity
SecRule ARGS:/^param.*$/ "someval" "id:1"
```

{{< callout context="note" >}}
Solo RE2 será soportado en v3.
{{< /callout >}}

**Conteo de variables**

Se puede contar el número de valores disponibles para una colección utilizando el prefijo **&**, por ejemplo:

```modsecurity
# You want to block requests without host header
SecRule &REQUEST_HEADERS:host "@eq 0" "id:1, deny, status:403"
```

**Excepciones de variables**

Se pueden eliminar claves objetivo específicas de la lista de variables utilizando el prefijo **!**, por ejemplo:

```modsecurity
# We want to apply some Sql Injection validations against the REQUEST_HEADERS
SecRule REQUEST_HEADERS "@detectSQLi" "id:1,deny,status:403"

# There is a false positive for some User-Agents so we want to ignore the
# User-Agent header:
SecRule REQUEST_HEADERS|!REQUEST_HEADERS:User-Agent "@detectSQLi" "id:2,deny,status:403"

## The second rule will be evaluated for each request header except User-Agent.
```

**Múltiples variables**

Se pueden evaluar múltiples variables separándolas con el carácter pipe (|), por ejemplo:

```modsecurity
SecRule VARIABLE1|VARIABLE2|VARIABLE3:/some-regex/|!VARIABLE3:id "!@rx \w+" "id:1,pass"
```

#### Variables XPath

Si el procesador de cuerpo está configurado para procesar JSON o XML, se pueden utilizar las variables especiales **XML** y **JSON**, por ejemplo:

```modsecurity
SecAction "id:1, phase:1,ctl:setRequestBodyProcessor=XML,pass,nolog"
# We are denying a book because we don't like it
SecRule XML:/* "name of the book" "id:2,phase:2,log,logdata:'We don´t like this book!',deny,status:403"
```

Para XML, actualmente solo se soportan dos expresiones XPath: `XML:/*` y `XML://@*`.
Para JSON, se puede acceder a los elementos utilizando `.OBJECT_KEY` o `.ARRAY_ELEMENT_INDEX` (por ejemplo: `JSON.a.1` para `{"a":[1,2]}` devuelve 2).

### Operadores

Los operadores son funciones que devuelven verdadero o falso. Solo se puede utilizar un operador por regla, a menos que se usen cadenas (chains). La sintaxis de un operador es: ```"@OPERATOR ARGUMENTS"```, y se puede negar el resultado utilizando ```"!@OPERATOR ARGUMENTS"```.

{{< callout context="note" >}}
* Si no se indica ningún operador, el operador utilizado por defecto será ```@rx```.
* Los operadores deben comenzar con **@**.
{{< /callout >}}

### Acciones

Las acciones son instrucciones clave-valor para la regla que se activarán en la compilación, interrupción o transacción, dependiendo del tipo de acción.

Los valores de las acciones son opcionales. La sintaxis clave-valor es ```key:value```, y algunas acciones pueden reutilizarse tantas veces como se desee, como **t**.

**Tipos de acciones:**

* **Acciones no disruptivas** - Realizan alguna operación, pero esa operación no afecta ni puede afectar el flujo de procesamiento de reglas. Establecer una variable o cambiar su valor es un ejemplo de acción no disruptiva. Las acciones no disruptivas pueden aparecer en cualquier regla, incluyendo cada regla perteneciente a una cadena.
* **Acciones de flujo** - Estas acciones afectan el flujo de las reglas (por ejemplo, skip o skipAfter).
* **Acciones de metadatos** - Las acciones de metadatos se utilizan para proporcionar más información sobre las reglas. Ejemplos incluyen id, rev, severity y msg.
* **Acciones de datos** - No son realmente acciones, sino meros contenedores que almacenan datos utilizados por otras acciones. Por ejemplo, la acción status contiene el código de estado que se usará para el bloqueo (si este se produce).

### Acciones por defecto

`SecDefaultAction` se utiliza para definir una lista de acciones por defecto por fase. Las fases por defecto se añadirán a cada regla y pueden sobrescribirse utilizando la acción especificada nuevamente.

Si se definen acciones por defecto, es obligatorio indicar una **fase** (phase) y una **acción disruptiva**.

```modsecurity
SecDefaultAction "phase:1, deny, status:403"

# This rule will deny the request with status 403 because of the default actions
SecAction "id:2, phase:1"

# This rule will be triggered but it will pas instead of deny
SecAction "id:3, phase:1, pass"
```

### SecAction

Las SecActions se utilizan para crear reglas que siempre coincidirán; no contienen ni operador ni variables.

## Expansión de macros

Las expansiones de macros son mensajes especiales que pueden transformarse en su valor evaluado. La sintaxis es: ```%{VARIABLE.KEY}```, por ejemplo ```%{REQUEST_HEADERS.host}``` devolverá el contenido de la cabecera de solicitud "Host".

```modsecurity
SecAction "id:1, log, logdata:'Transaction %{unique_id}'"

# we assign a variable to tx.argcount
SecRule &ARGS "!@eq 0" "id:2, setvar:'tx.argcount=%{MATCHED_VAR}', pass"
# we print the args count to the log
SecAction "id:3, log, logdata:'%{tx.argcount} arguments found.'"
```
