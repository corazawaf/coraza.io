---
title: "Transformaciones"
description: "Las funciones de transformación se utilizan para modificar los datos de entrada antes de usarlos en la coincidencia."
lead: "Las funciones de transformación se utilizan para modificar los datos de entrada antes de usarlos en la coincidencia (es decir, la ejecución del operador). Los datos de entrada nunca se modifican realmente: cada vez que solicita que se utilice una función de transformación, Coraza creará una copia de los datos, la transformará y luego ejecutará el operador contra el resultado."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
---

En el siguiente ejemplo, los valores de los parámetros de la solicitud se convierten a minúsculas antes de la coincidencia:

```modsecurity
SecRule ARGS "xp_cmdshell" "t:lowercase,id:91"
```

Se pueden utilizar múltiples acciones de transformación en la misma regla, formando una cadena de transformación. Las transformaciones se realizarán en el orden en que aparecen en la regla.

En la mayoría de los casos, el orden en que se realizan las transformaciones es muy importante. En el siguiente ejemplo, se realiza una serie de funciones de transformación para contrarrestar la evasión. Realizar las transformaciones en cualquier otro orden permitiría a un atacante hábil evadir la detección:

```modsecurity
SecRule ARGS "(asfunction|javascript|vbscript|data|mocha|livescript):" "id:92,t:none,t:htmlEntityDecode,t:lowercase,t:removeNulls,t:removeWhitespace"
```

{{< callout context="caution" >}}
Actualmente es posible usar SecDefaultAction para especificar una lista predeterminada de funciones de transformación, que se aplicarán a todas las reglas que sigan a la directiva SecDefaultAction. Sin embargo, esta práctica no se recomienda, porque significa que es muy fácil cometer errores. Se recomienda que siempre especifique las funciones de transformación que necesita una regla particular, comenzando la lista con t:none (lo cual borra las funciones de transformación posiblemente heredadas).
{{< /callout >}}
El resto de esta sección documenta las funciones de transformación disponibles actualmente en Coraza.

## base64Decode

Decodifica una cadena codificada en Base64.

```modsecurity
SecRule REQUEST_HEADERS:Authorization "^Basic ([a-zA-Z0-9]+=*)$" "phase:1,id:93,capture,chain,logdata:%{TX.1}"
  SecRule TX:1 ^(\w+): t:base64Decode,capture,chain
    SecRule TX:1 ^(admin|root|backup)$
````

Nota: Tenga cuidado al aplicar base64Decode con otras transformaciones. El orden de las transformaciones es importante en este caso, ya que ciertas transformaciones pueden cambiar o invalidar la cadena codificada en base64 antes de ser decodificada (por ejemplo, t:lowercase, etc.). Esto por supuesto significa que también es muy difícil escribir una sola regla que compruebe un valor decodificado en base64 O un valor no codificado con transformaciones; es mejor escribir dos reglas en esta situación.
sqlHexDecode
Decodifica datos hexadecimales de SQL. Ejemplo: (0x414243) se decodificará como (ABC).

## base64DecodeExt

Decodifica una cadena codificada en Base64. A diferencia de base64Decode, esta versión utiliza una implementación tolerante, que ignora los caracteres inválidos.

Consulte la publicación del blog sobre problemas de evasión con Base64Decoding en sitios PHP - http://blog.spiderlabs.com/2010/04/impedance-mismatch-and-base64.html

## base64Encode

Codifica la cadena de entrada utilizando la codificación Base64.

## cmdLine

En Windows y Unix, los comandos pueden ser escapados por diferentes medios, como:

- c^ommand /c ...
- "command" /c ...
- command,/c ...
- barra invertida en medio de un comando Unix

La función de transformación cmdLine evita este problema manipulando el contenido de la variable de las siguientes maneras:

- eliminando todas las barras invertidas [\]
- eliminando todas las comillas dobles ["]
- eliminando todas las comillas simples [']
- eliminando todos los acentos circunflejos [^]
- eliminando espacios antes de una barra /
- eliminando espacios antes de un paréntesis de apertura [(]
- reemplazando todas las comas [,] y punto y coma [;] por un espacio
- reemplazando todos los espacios múltiples (incluyendo tabulación, nueva línea, etc.) por un solo espacio
- transformando todos los caracteres a minúsculas

**Ejemplo de uso:**

```modsecurity
SecRule ARGS "(?:command(?:.com)?|cmd(?:.exe)?)(?:/.*)?/[ck]" "phase:2,id:94,t:none, t:cmdLine"
```

## compressWhitespace

Convierte cualquiera de los caracteres de espacio en blanco (0x20, \f, \t, \n, \r, \v, 0xa0) en espacios (ASCII 0x20), comprimiendo múltiples caracteres de espacio consecutivos en uno solo.

## cssDecode

Decodifica caracteres codificados usando las reglas de escape de CSS 2.x syndata.html#characters. Esta función utiliza solo hasta dos bytes en el proceso de decodificación, lo que significa que es útil para descubrir caracteres ASCII codificados usando codificación CSS (que normalmente no necesitarían codificarse), o para contrarrestar la evasión, que es una combinación de una barra invertida y caracteres no hexadecimales (por ejemplo, ja\vascript es equivalente a javascript).

## escapeSeqDecode

Decodifica secuencias de escape ANSI C: \a, \b, \f, \n, \r, \t, \v, \\, \?, \', \", \xHH (hexadecimal), \0OOO (octal). Las codificaciones inválidas se dejan en la salida.

## hexDecode

Decodifica una cadena que ha sido codificada usando el mismo algoritmo que el utilizado en hexEncode (véase la siguiente entrada).

## hexEncode

Codifica una cadena (que posiblemente contenga caracteres binarios) reemplazando cada byte de entrada con dos caracteres hexadecimales. Por ejemplo, xyz se codifica como 78797a.

## htmlEntityDecode

Decodifica los caracteres codificados como entidades HTML. Se admiten las siguientes variantes:

- HH y HH; (donde H es cualquier número hexadecimal)
- DDD y DDD; (donde D es cualquier número decimal)
- &quotand"
- &nbspand
- &ltand<
- &gtand>

Esta función siempre convierte una entidad HTML en un byte, lo que posiblemente resulte en una pérdida de información (si la entidad se refiere a un carácter que no puede representarse con un solo byte). Por tanto, es útil para descubrir bytes que de otro modo no necesitarían codificarse, pero no puede hacer nada significativo con los caracteres del rango por encima de 0xff.

## jsDecode

Decodifica secuencias de escape de JavaScript. Si un código \uHHHH está en el rango de FF01-FF5E (los códigos ASCII de ancho completo), entonces el byte superior se utiliza para detectar y ajustar el byte inferior. De lo contrario, solo se utilizará el byte inferior y el byte superior se pondrá a cero (lo que puede llevar a una pérdida de información).

## length

Busca la longitud de la cadena de entrada en bytes, colocándola (como cadena) en la salida. Por ejemplo, si recibe ABCDE como entrada, esta función de transformación devolverá 5 como salida.

## lowercase

Convierte todos los caracteres a minúsculas usando la configuración regional C actual.

## md5

Calcula un hash MD5 a partir de los datos de entrada. El hash calculado está en forma binaria sin procesar y puede necesitar codificarse en texto para ser impreso (o registrado). Las funciones hash se usan comúnmente en combinación con hexEncode (por ejemplo: t:md5,t:hexEncode).

## none

No es una función de transformación real, sino una instrucción para Coraza de eliminar todas las funciones de transformación asociadas con la regla actual.

## normalizePath

Elimina barras múltiples, autorreferencias de directorio y referencias hacia atrás de directorio (excepto cuando están al inicio de la entrada) de la cadena de entrada.

## normalizePathWin

Igual que normalizePath, pero primero convierte los caracteres de barra invertida en barras diagonales.

## parityEven7bit

Calcula la paridad par de datos de 7 bits reemplazando el octavo bit de cada byte de destino con el bit de paridad calculado.

## parityOdd7bit

Calcula la paridad impar de datos de 7 bits reemplazando el octavo bit de cada byte de destino con el bit de paridad calculado.

## parityZero7bit

Calcula la paridad cero de datos de 7 bits reemplazando el octavo bit de cada byte de destino con un bit de paridad cero, lo que permite inspeccionar datos de 7 bits con paridad par/impar como datos ASCII7.

## removeNulls

Elimina todos los bytes NUL de la entrada.

## removeWhitespace

Elimina todos los caracteres de espacio en blanco de la entrada.

## replaceComments

Reemplaza cada ocurrencia de un comentario de estilo C (/*...*/) con un solo espacio (las múltiples ocurrencias consecutivas no se comprimirán). Los comentarios sin terminar también se reemplazarán con un espacio (ASCII 0x20). Sin embargo, un cierre de comentario independiente (*/) no se procesará.

## removeCommentsChar

Elimina los caracteres comunes de comentarios (/*,*/, --, #).

## removeComments

Elimina cada ocurrencia de comentario (/*...*/, --, #). Las múltiples ocurrencias consecutivas no se comprimirán.

Nota: Esta transformación es conocida por ser poco fiable, puede causar comportamientos inesperados y podría quedar obsoleta pronto en una versión futura. Consulte el issue #1207 para más información.

## replaceNulls

Reemplaza los bytes NUL en la entrada con caracteres de espacio (ASCII 0x20).

## urlDecode

Decodifica una cadena de entrada codificada en URL. Las codificaciones inválidas (es decir, las que usan caracteres no hexadecimales, o las que están al final de la cadena y les faltan uno o dos bytes) no se convierten, pero no se genera ningún error. Para detectar codificaciones inválidas, use el operador @validateUrlEncoding sobre los datos de entrada primero. La función de transformación no debería usarse contra variables que ya han sido decodificadas de URL (como los parámetros de solicitud) a menos que su intención sea realizar la decodificación de URL dos veces.

## uppercase

Convierte todos los caracteres a mayúsculas usando la configuración regional C actual.

## urlDecodeUni

Como urlDecode, pero con soporte para la codificación específica de Microsoft %u. Si el código está en el rango de FF01-FF5E (los códigos ASCII de ancho completo), entonces el byte superior se utiliza para detectar y ajustar el byte inferior. De lo contrario, solo se utilizará el byte inferior y el byte superior se pondrá a cero.

## urlEncode

Codifica la cadena de entrada usando codificación URL.

## utf8toUnicode

Convierte todas las secuencias de caracteres UTF-8 a Unicode. Esto ayuda a la normalización de la entrada, especialmente para idiomas distintos del inglés, minimizando los falsos positivos y falsos negativos.

## sha1

Calcula un hash SHA1 a partir de la cadena de entrada. El hash calculado está en forma binaria sin procesar y puede necesitar codificarse en texto para ser impreso (o registrado). Las funciones hash se usan comúnmente en combinación con hexEncode (por ejemplo, t:sha1,t:hexEncode).

## trimLeft

Elimina los espacios en blanco del lado izquierdo de la cadena de entrada.

## trimRight

Elimina los espacios en blanco del lado derecho de la cadena de entrada.

## trim

Elimina los espacios en blanco de ambos lados (izquierdo y derecho) de la cadena de entrada.
