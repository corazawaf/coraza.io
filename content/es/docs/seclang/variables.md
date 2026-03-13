---
title: "Variables"
description: "Variables disponibles en el lenguaje SecLang de Coraza."
lead: "Variables disponibles en el lenguaje SecLang de Coraza."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
---

## ARGS

**ARGS** es una colección y puede usarse por sí sola (significa todos los argumentos incluyendo la carga del POST), con un parámetro estático (coincide con argumentos con ese nombre), o con una expresión regular (coincide con todos los argumentos cuyo nombre coincida con la expresión regular). Para examinar solo los argumentos de la cadena de consulta o del cuerpo, véanse las colecciones ARGS_GET y ARGS_POST.

Algunas variables son en realidad colecciones, que se expanden en más variables en tiempo de ejecución. El siguiente ejemplo examinará todos los argumentos de la solicitud:

```modsecurity
SecRule ARGS dirty "id:7"
```

Sin embargo, a veces querrá examinar solo partes de una colección. Esto se puede lograr con la ayuda del operador de selección (dos puntos). El siguiente ejemplo solo examinará los argumentos llamados p (tenga en cuenta que, en general, las solicitudes pueden contener múltiples argumentos con el mismo nombre):

```modsecurity
SecRule ARGS:p dirty "id:8"
```

También es posible especificar exclusiones. El siguiente ejemplo examinará todos los argumentos de la solicitud en busca de la palabra dirty, excepto los llamados z (de nuevo, puede haber cero o más argumentos llamados z):

```modsecurity
SecRule ARGS|!ARGS:z dirty "id:9"
```

Existe un operador especial que permite contar cuántas variables hay en una colección. La siguiente regla se activará si hay más de cero argumentos en la solicitud (ignore el segundo parámetro por ahora):

```modsecurity
SecRule &ARGS !^0$ "id:10"
```

Y a veces necesita examinar un conjunto de parámetros, cada uno con un nombre ligeramente diferente. En este caso puede especificar una expresión regular en el propio operador de selección. La siguiente regla examinará todos los argumentos cuyos nombres comiencen con id_:

```modsecurity
SecRule ARGS:/^id_/ dirty "id:11"
```

**Nota:** Usar ```ARGS:p``` no resultará en ninguna invocación contra el operador si el argumento p no existe.

## ARGS_COMBINED_SIZE

Contiene el tamaño combinado de todos los parámetros de la solicitud. Los archivos se excluyen del cálculo. Esta variable puede ser útil, por ejemplo, para crear una regla que asegure que el tamaño total de los datos de los argumentos esté por debajo de un cierto umbral. La siguiente regla detecta una solicitud cuyos parámetros tienen más de 2500 bytes de longitud:

```modsecurity
SecRule ARGS_COMBINED_SIZE "@gt 2500" "id:12"
````

## ARGS_GET

**ARGS_GET** es similar a ARGS, pero contiene solo los parámetros de la cadena de consulta.

## ARGS_GET_NAMES

**ARGS_GET_NAMES** es similar a **ARGS_NAMES**, pero contiene solo los nombres de los parámetros de la cadena de consulta.

## ARGS_NAMES

Contiene todos los nombres de los parámetros de la solicitud. Puede buscar nombres de parámetros específicos que desee inspeccionar. En un escenario de política positiva, también puede crear una lista de permitidos (usando una regla invertida con el signo de exclamación) con solo los nombres de argumentos autorizados. Esta regla de ejemplo permite solo dos nombres de argumento: p y a:

```modsecurity
SecRule ARGS_NAMES "!^(p|a)$" "id:13"
```

## ARGS_POST

**ARGS_POST** es similar a **ARGS**, pero solo contiene los argumentos del cuerpo del POST.

## ARGS_POST_NAMES

**ARGS_POST_NAMES** es similar a **ARGS_NAMES**, pero contiene solo los nombres de los parámetros del cuerpo de la solicitud.

## AUTH_TYPE

**Aún no implementado**

Esta variable contiene el método de autenticación utilizado para validar un usuario, si se usa alguno de los métodos integrados en HTTP. En un despliegue de proxy inverso, esta información no estará disponible si la autenticación se gestiona en el servidor web del backend.

```modsecurity
SecRule AUTH_TYPE "Basic" "id:14"
```

## DURATION

**Aún no implementado**

Contiene el número de microsegundos transcurridos desde el inicio de la transacción actual.

## ENV

**Aún no implementado**

Colección que proporciona acceso a las variables de entorno establecidas por Coraza u otros módulos del servidor. Requiere un único parámetro para especificar el nombre de la variable deseada.

```modsecurity
# Set environment variable
SecRule REQUEST_FILENAME "printenv" \
"phase:2,id:15,pass,setenv:tag=suspicious"

# Inspect environment variable
SecRule ENV:tag "suspicious" "id:16"

# Reading an environment variable from other Apache module (mod_ssl)
SecRule TX:ANOMALY_SCORE "@gt 0" "phase:5,id:16,msg:'%{env.ssl_cipher}'"
```

**Nota:** Use setenv para establecer variables de entorno a las que Apache pueda acceder.

## FILES

Contiene una colección de nombres de archivo originales (tal como se llamaban en el sistema de archivos del usuario remoto). Disponible solo en solicitudes multipart/form-data inspeccionadas.

```modsecurity
SecRule FILES "@rx \.conf$" "id:17"
```

**Nota:** Solo disponible si se extrajeron archivos del cuerpo de la solicitud.

## FILES_COMBINED_SIZE

Contiene el tamaño total de los archivos transportados en el cuerpo de la solicitud. Disponible solo en solicitudes multipart/form-data inspeccionadas.

```modsecurity
SecRule FILES_COMBINED_SIZE "@gt 100000" "id:18"
```

## FILES_NAMES

Contiene una lista de campos de formulario que se utilizaron para la subida de archivos. Disponible solo en solicitudes multipart/form-data inspeccionadas.

```modsecurity
SecRule FILES_NAMES "^upfile$" "id:19"
```

## FULL_REQUEST_LENGTH

Representa la cantidad de bytes que FULL_REQUEST puede utilizar.

```modsecurity
SecRule FULL_REQUEST_LENGTH "@eq 205" "id:21"
```

## FILES_SIZES

Contiene una lista de tamaños individuales de archivos. Útil para implementar una limitación de tamaño en archivos subidos individualmente. Disponible solo en solicitudes multipart/form-data inspeccionadas.

```modsecurity
SecRule FILES_SIZES "@gt 100" "id:20"
```

## FILES_TMPNAMES

Contiene una lista de nombres de archivos temporales en disco. Útil cuando se usa junto con @inspectFile. Disponible solo en solicitudes multipart/form-data inspeccionadas.

```modsecurity
SecRule FILES_TMPNAMES "@inspectFile /path/to/inspect_script.pl" "id:21"
```

## FILES_TMP_CONTENT

Contiene un conjunto clave-valor donde el valor es el contenido del archivo que fue subido. Útil cuando se usa junto con @fuzzyHash.

```modsecurity
SecRule FILES_TMP_CONTENT "@fuzzyHash $ENV{CONF_DIR}/ssdeep.txt 1" "id:192372,log,deny"
```

**Nota:** SecUploadKeepFiles debe estar establecido en 'On' para que esta colección se llene.

## GEO

GEO es una colección que se rellena con los resultados del último operador @geoLookup. La colección puede usarse para coincidir con campos geográficos buscados a partir de una dirección IP o nombre de host.

Campos:

- **COUNTRY_CODE:** Código de país de dos caracteres. Ejemplo: US, CL, GB, etc.
- **COUNTRY_CODE3:** Código de país de hasta tres caracteres.
- **COUNTRY_NAME:** El nombre completo del país.
- **COUNTRY_CONTINENT:** El continente de dos caracteres donde se encuentra el país. Ejemplo: EU
- **REGION:** La región de dos caracteres. Para EE.UU., es el estado. Para Chile, la región, etc.
- **CITY:** El nombre de la ciudad si es compatible con la base de datos.
- **POSTAL_CODE:** El código postal si es compatible con la base de datos.
- **LATITUDE:** La latitud si es compatible con la base de datos.
- **LONGITUDE:** La longitud si es compatible con la base de datos.

**Ejemplo:**

```modsecurity
SecGeoLookupDb maxminddb file=/usr/local/geo/data/GeoLiteCity.dat
...
SecRule REMOTE_ADDR "@geoLookup" "chain,id:22,drop,msg:'Non-GB IP address'"
SecRule GEO:COUNTRY_CODE "!@streq GB"
```

## HIGHEST_SEVERITY

Esta variable contiene la severidad más alta de cualquier regla que haya coincidido hasta el momento. Las severidades son valores numéricos y por tanto pueden usarse con operadores de comparación como @lt, etc. Un valor de 255 indica que no se ha establecido ninguna severidad.

```modsecurity
SecRule HIGHEST_SEVERITY "@le 2" "phase:2,id:23,deny,status:500,msg:'severity %{HIGHEST_SEVERITY}'"
```

**Nota:** Las severidades más altas tienen un valor numérico más bajo.

## INBOUND_DATA_ERROR

Esta variable se establecerá en 1 cuando el tamaño del cuerpo de la solicitud supere la configuración establecida por la directiva **SecRequestBodyLimit**. Sus políticas siempre deben contener una regla para verificar esta variable. Dependiendo de la tasa de falsos positivos y su política predeterminada, debería decidir si bloquear o solo advertir cuando se active la regla.

La mejor manera de usar esta variable es como en el ejemplo a continuación:

```modsecurity
SecRule INBOUND_DATA_ERROR "@eq 1" "phase:1,id:24,t:none,log,pass,msg:'Request Body Larger than SecRequestBodyLimit Setting'"
```

## MATCHED_VAR

Esta variable contiene el valor de la variable que coincidió más recientemente. Es similar a TX:0, pero es compatible automáticamente con todos los operadores y no es necesario especificar la acción capture.

```modsecurity
SecRule ARGS pattern chain,deny,id:25
  SecRule MATCHED_VAR "further scrutiny"
```

**Nota:** Tenga en cuenta que esta variable contiene datos de la última coincidencia del operador. Esto significa que si hay más de una coincidencia, solo se rellenará la última. Use la variable MATCHED_VARS si desea todas las coincidencias.

## MATCHED_VARS

Similar a **MATCHED_VAR** excepto que es una colección de todas las coincidencias para la comprobación del operador actual.

```modsecurity
SecRule ARGS pattern "chain,deny,id:26"
  SecRule MATCHED_VARS "@eq ARGS:param"
```

## MATCHED_VAR_NAME

Esta variable contiene el nombre completo de la variable que coincidió.

```modsecurity
SecRule ARGS pattern "chain,deny,id:27"
  SecRule MATCHED_VAR_NAME "@eq ARGS:param"
```

**Nota:** Tenga en cuenta que esta variable contiene datos de la última coincidencia del operador. Esto significa que si hay más de una coincidencia, solo se rellenará la última. Use la variable MATCHED_VARS_NAMES si desea todas las coincidencias.

## MATCHED_VARS_NAMES

Similar a MATCHED_VAR_NAME excepto que es una colección de todas las coincidencias para la comprobación del operador actual.

```modsecurity
SecRule ARGS pattern "chain,deny,id:28"
  SecRule MATCHED_VARS_NAMES "@eq ARGS:param"
```

## MULTIPART_FILENAME

Esta variable contiene los datos multipart del campo FILENAME.

## MULTIPART_NAME

Esta variable contiene los datos multipart del campo NAME.

## OUTBOUND_DATA_ERROR

Esta variable se establecerá en 1 cuando el tamaño del cuerpo de la respuesta supere la configuración establecida por la directiva SecResponseBodyLimit. Sus políticas siempre deben contener una regla para verificar esta variable. Dependiendo de la tasa de falsos positivos y su política predeterminada, debería decidir si bloquear o solo advertir cuando se active la regla.

La mejor manera de usar esta variable es como en el ejemplo a continuación:

```modsecurity
SecRule OUTBOUND_DATA_ERROR "@eq 1" "phase:1,id:32,t:none,log,pass,msg:'Response Body Larger than SecResponseBodyLimit Setting'"
```

## PATH_INFO

Contiene la información extra de la URI de la solicitud, también conocida como path info. (Por ejemplo, en la URI /index.php/123, /123 es el path info.) Disponible solo en despliegues embebidos.

```modsecurity
SecRule PATH_INFO "^/(bin|etc|sbin|opt|usr)" "id:33"
```

## PERF_ALL

**Aún no implementado**

Esta variable especial contiene una cadena que es una combinación de todas las demás variables de rendimiento, dispuestas en el mismo orden en que aparecen en la cabecera Stopwatch2 del registro de auditoría. Está destinada para su uso en registros personalizados de Apache.

**Soportado en Coraza:** TBI

## PERF_COMBINED

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en Coraza durante la transacción actual. El valor de esta variable se obtiene sumando todas las variables de rendimiento excepto PERF_SREAD (el tiempo empleado leyendo del almacenamiento persistente ya está incluido en las mediciones de fase).

**Soportado en Coraza:** TBI

PERF_GC
Contiene el tiempo, en microsegundos, empleado en la recolección de basura.

**Soportado en Coraza:** TBI

## PERF_LOGGING

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en el registro de auditoría. Este valor se conoce solo después de que se haya finalizado el manejo de una transacción, lo que significa que solo puede registrarse usando mod_log_config y la sintaxis %{VARNAME}M.

**Soportado en Coraza:** TBI

## PERF_PHASE1

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en el procesamiento de la fase 1.

**Soportado en Coraza:** TBI

## PERF_PHASE2

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en el procesamiento de la fase 2.

**Soportado en Coraza:** TBI

## PERF_PHASE3

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en el procesamiento de la fase 3.

**Soportado en Coraza:** TBI

## PERF_PHASE4

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en el procesamiento de la fase 4.

**Soportado en Coraza:** TBI

## PERF_PHASE5

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en el procesamiento de la fase 5.

**Soportado en Coraza:** TBI

## PERF_RULES

**Aún no implementado**

PERF_RULES es una colección que se rellena con las reglas que superan el umbral de rendimiento definido con SecRulePerfTime. La colección contiene el tiempo, en microsegundos, empleado en el procesamiento de cada regla individual. Se puede acceder a los distintos elementos de la colección mediante el ID de la regla.

Soportado en Coraza: TBI

```modsecurity
SecRulePerfTime            100

SecRule FILES_TMPNAMES "@inspectFile /path/to/útil/runav.pl" \
  "phase:2,id:10001,deny,log,msg:'Virus scan detected an error.'"

SecRule   &PERF_RULES "@eq 0"    "phase:5,id:95000,\
  pass,log,msg:'All rules performed below processing time limit.'"
SecRule   PERF_RULES  "@ge 1000" "phase:5,id:95001,pass,log,\
  msg:'Rule %{MATCHED_VAR_NAME} spent at least 1000 usec.'"
SecAction "phase:5,id:95002,pass,log, msg:'File inspection took %{PERF_RULES.10001} usec.'"
```

La regla con id 10001 define una regla de inspección de archivos externos. La regla con id 95000 comprueba el tamaño de la colección PERF_RULES. Si la colección está vacía, escribe una nota en el archivo de registro. La regla 95001 se ejecuta para cada elemento de la colección PERF_RULES. Cada elemento se comprueba contra el límite de 1000 microsegundos. Si la regla empleó al menos esa cantidad de tiempo, se escribe una nota con el ID de la regla en el archivo de registro. La regla final 95002 registra el tiempo empleado en la regla 10001 (la inspección de virus).

## PERF_SREAD

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en la lectura del almacenamiento persistente.

**Soportado en Coraza:** TBI

## PERF_SWRITE

**Aún no implementado**

Contiene el tiempo, en microsegundos, empleado en la escritura en el almacenamiento persistente.

**Soportado en Coraza:** TBI

## QUERY_STRING

Contiene la parte de la cadena de consulta de la URI de la solicitud. El valor en QUERY_STRING siempre se proporciona sin procesar, sin que se realice la decodificación de URL.

```modsecurity
SecRule QUERY_STRING "attack" "id:34"
```

## REMOTE_ADDR

Esta variable contiene la dirección IP del cliente remoto.

```modsecurity
SecRule REMOTE_ADDR "@ipMatch 192.168.1.101" "id:35"
```

## REMOTE_HOST

Si la directiva de Apache HostnameLookups está establecida en On, entonces esta variable contendrá el nombre de host remoto resuelto a través de DNS. Si la directiva está establecida en Off, esta variable contendrá la dirección IP remota (igual que REMOTE_ADDR). Los usos posibles de esta variable serían denegar hosts o bloques de red de clientes conocidos como maliciosos, o a la inversa, permitir la entrada de hosts autorizados.

```modsecurity
SecRule REMOTE_HOST "\.evil\.network\org$" "id:36"
```

## REMOTE_PORT

Esta variable contiene información sobre el puerto de origen que el cliente utilizó al iniciar la conexión con nuestro servidor web.

En el siguiente ejemplo, evaluamos si REMOTE_PORT es menor que 1024, lo que indicaría que el usuario es un usuario privilegiado:

```modsecurity
SecRule REMOTE_PORT "@lt 1024" "id:37"
```

## REMOTE_USER

Esta variable contiene el nombre de usuario del usuario autenticado. Si no hay controles de acceso por contraseña establecidos (autenticación Basic o Digest), esta variable estará vacía.

```modsecurity
SecRule REMOTE_USER "@streq admin" "id:38"
```

**Nota:** En un despliegue de proxy inverso, esta información no estará disponible si la autenticación se gestiona en el servidor web del backend.

## REQBODY_ERROR

Contiene el estado del procesador del cuerpo de la solicitud utilizado para el análisis del cuerpo de la solicitud. Los valores pueden ser 0 (sin error) o 1 (error). Esta variable será establecida por los procesadores del cuerpo de la solicitud (típicamente el analizador multipart/request-data, JSON o el analizador XML) cuando no puedan realizar su trabajo.

```modsecurity
SecRule REQBODY_ERROR "@eq 1" deny,phase:2,id:39
```

**Nota:** Sus políticas deben tener una regla para comprobar los errores del procesador del cuerpo de la solicitud al inicio de la fase 2. No hacerlo dejará la puerta abierta a ataques de desajuste de impedancia. Es posible, por ejemplo, que una carga útil que no pueda ser analizada por Coraza pueda ser analizada con éxito por un analizador más tolerante que opere en la aplicación. Si su política dicta el bloqueo, entonces debería rechazar la solicitud si se detecta un error. Cuando opera en modo de solo detección, su regla debería alertar con severidad alta cuando falla el procesamiento del cuerpo de la solicitud.

## REQBODY_ERROR_MSG

Si ha habido un error durante el análisis del cuerpo de la solicitud, la variable contendrá el siguiente mensaje de error:

```modsecurity
SecRule REQBODY_ERROR_MSG "failed to parse" "id:40"
```

## REQBODY_PROCESSOR

Contiene el nombre del procesador del cuerpo de la solicitud actualmente en uso. Los valores posibles son URLENCODED, JSON, MULTIPART y XML.

```modsecurity
SecRule REQBODY_PROCESSOR "^XML$ chain,id:41
  SecRule XML://* "something" "id:123"
```

## REQUEST_BASENAME

Esta variable contiene solo la parte del nombre de archivo de REQUEST_FILENAME (por ejemplo, index.php).

```modsecurity
SecRule REQUEST_BASENAME "^login\.php$" phase:2,id:42,t:none,t:lowercase
```

**Nota:** Tenga en cuenta que las transformaciones anti-evasión no se aplican a esta variable por defecto. REQUEST_BASENAME reconocerá tanto / como \ como separadores de ruta. Debe entender que el valor de esta variable depende de lo que se proporcionó en la solicitud, y que no tiene por qué corresponder al recurso (en disco) que será utilizado por el servidor web.

## REQUEST_BODY

Contiene el cuerpo de la solicitud sin procesar. Esta variable está disponible solo si se utilizó el procesador del cuerpo de la solicitud URLENCODED, lo que ocurrirá por defecto cuando se detecte el tipo de contenido application/x-www-form-urlencoded, o si se forzó el uso del analizador del cuerpo de la solicitud URLENCODED.

```modsecurity
SecRule REQUEST_BODY "^username=\w{25,}\&password=\w{25,}\&Submit\=login$" "id:43"
```

Es posible forzar la presencia de la variable REQUEST_BODY, pero solo cuando no hay un procesador del cuerpo de la solicitud definido, utilizando la opción ```ctl:forceRequestBodyVariable``` en la fase REQUEST_HEADERS.

## REQUEST_BODY_LENGTH

Contiene el número de bytes leídos del cuerpo de la solicitud.

## REQUEST_COOKIES

Esta variable es una colección de todas las cookies de la solicitud (solo valores). Ejemplo: el siguiente ejemplo utiliza el operador especial Ampersand para contar cuántas variables hay en la colección. En esta regla, se activaría si la solicitud no incluye ninguna cabecera Cookie.

```modsecurity
SecRule &REQUEST_COOKIES "@eq 0" "id:44"
```

## REQUEST_COOKIES_NAMES

Esta variable es una colección de los nombres de todas las cookies de la solicitud. Por ejemplo, la siguiente regla se activará si la cookie JSESSIONID no está presente:

```modsecurity
SecRule &REQUEST_COOKIES_NAMES:JSESSIONID "@eq 0" "id:45"
```

## REQUEST_FILENAME

Esta variable contiene la URL relativa de la solicitud sin la parte de la cadena de consulta (por ejemplo, /index.php).

```modsecurity
SecRule REQUEST_FILENAME "^/cgi-bin/login\.php$" phase:2,id:46,t:none,t:normalizePath
```

**Nota:** Tenga en cuenta que las transformaciones anti-evasión no se usan en REQUEST_FILENAME, lo que significa que tendrá que especificarlas en las reglas que usen esta variable.

## REQUEST_HEADERS

Esta variable puede usarse como colección de todas las cabeceras de la solicitud o para inspeccionar cabeceras seleccionadas (usando la sintaxis REQUEST_HEADERS:Nombre-Cabecera).

```modsecurity
SecRule REQUEST_HEADERS:Host "^[\d\.]+$" "deny,id:47,log,status:400,msg:'Host header is a numeric IP address'"
```

**Nota:** Coraza tratará múltiples cabeceras con nombres idénticos como una "lista", procesando cada valor individual.

## REQUEST_HEADERS_NAMES

Esta variable es una colección de los nombres de todas las cabeceras de la solicitud.

```modsecurity
SecRule REQUEST_HEADERS_NAMES "^x-forwarded-for" "log,deny,id:48,status:403,t:lowercase,msg:'Proxy Server Used'"
```

## REQUEST_LINE

Esta variable contiene la línea completa de la solicitud enviada al servidor (incluyendo el método de solicitud y la información de la versión HTTP).

```modsecurity
# Allow only POST, GET and HEAD request methods, as well as only
# the valid protocol versions
SecRule REQUEST_LINE "!(^((?:(?:POS|GE)T|HEAD))|HTTP/(0\.9|1\.0|1\.1)$)" "phase:1,id:49,log,block,t:none"
```

## REQUEST_METHOD

Esta variable contiene el método de solicitud utilizado en la transacción.

```modsecurity
SecRule REQUEST_METHOD "^(?:CONNECT|TRACE)$" "id:50,t:none"
```

## REQUEST_PROTOCOL

Esta variable contiene la información de la versión del protocolo de la solicitud.

```modsecurity
SecRule REQUEST_PROTOCOL "!^HTTP/(0\.9|1\.0|1\.1)$" "id:51"
```

##  REQUEST_URI

Esta variable contiene la URL completa de la solicitud incluyendo los datos de la cadena de consulta (por ejemplo, /index.php?p=X). Sin embargo, nunca contendrá un nombre de dominio, incluso si se proporcionó en la línea de la solicitud.

```modsecurity
SecRule REQUEST_URI "attack" "phase:1,id:52,t:none,t:urlDecode,t:lowercase,t:normalizePath"
```

**Nota:** Tenga en cuenta que las transformaciones anti-evasión no se usan en REQUEST_URI, lo que significa que tendrá que especificarlas en las reglas que usen esta variable.

## REQUEST_URI_RAW

Igual que REQUEST_URI pero contendrá el nombre de dominio si se proporcionó en la línea de la solicitud (por ejemplo, http://www.example.com/index.php?p=X).

```modsecurity
SecRule REQUEST_URI_RAW "http:/" "phase:1,id:53,t:none,t:urlDecode,t:lowercase,t:normalizePath"
```

**Nota:** Tenga en cuenta que las transformaciones anti-evasión no se usan en REQUEST_URI_RAW, lo que significa que tendrá que especificarlas en las reglas que usen esta variable.

## RESPONSE_BODY

Esta variable contiene los datos del cuerpo de la respuesta, pero solo cuando el almacenamiento en búfer del cuerpo de la respuesta está habilitado.

```modsecurity
SecRule RESPONSE_BODY "ODBC Error Code" "phase:4,id:54,t:none"
```

## RESPONSE_CONTENT_LENGTH

Longitud del cuerpo de la respuesta en bytes. Puede estar disponible a partir de la fase 3, pero no necesariamente (ya que la longitud del cuerpo de la respuesta no siempre se conoce de antemano). Si el tamaño no se conoce, esta variable contendrá un cero. Si RESPONSE_CONTENT_LENGTH contiene un cero en la fase 5, eso significa que el tamaño real del cuerpo de la respuesta fue 0. El valor de esta variable puede cambiar entre fases si el cuerpo se modifica. Por ejemplo, en modo embebido, mod_deflate puede comprimir el cuerpo de la respuesta entre las fases 4 y 5.

## RESPONSE_CONTENT_TYPE

Tipo de contenido de la respuesta. Disponible solo a partir de la fase 3. El valor disponible en esta variable se toma directamente de las estructuras internas de Apache, lo que significa que puede contener información que aún no está disponible en las cabeceras de respuesta. En despliegues embebidos, siempre debería hacer referencia a esta variable en lugar de a RESPONSE_HEADERS:Content-Type.

## RESPONSE_HEADERS

Esta variable se refiere a las cabeceras de respuesta, de la misma manera que REQUEST_HEADERS lo hace con las cabeceras de solicitud.

```modsecurity
SecRule RESPONSE_HEADERS:X-Cache "MISS" "id:55"
```

Esta variable puede no tener acceso a algunas cabeceras cuando se ejecuta en modo embebido. Cabeceras como Server, Date, Connection y Content-Type podrían añadirse justo antes de enviar los datos al cliente. Estos datos deberían estar disponibles en la fase 5 o cuando se despliega en modo proxy.

## RESPONSE_HEADERS_NAMES

Esta variable es una colección de los nombres de las cabeceras de respuesta.

```modsecurity
SecRule RESPONSE_HEADERS_NAMES "Set-Cookie" "phase:3,id:56,t:none"
```

Se aplican las mismas limitaciones que las discutidas en RESPONSE_HEADERS.

## RESPONSE_PROTOCOL

Esta variable contiene la información del protocolo HTTP de la respuesta.

```modsecurity
SecRule RESPONSE_PROTOCOL "^HTTP\/0\.9" "phase:3,id:57,t:none"
```

## RESPONSE_STATUS

Esta variable contiene el código de estado HTTP de la respuesta:

```modsecurity
SecRule RESPONSE_STATUS "^[45]" "phase:3,id:58,t:none"
```

Esta variable puede no funcionar como se espera, ya que algunas implementaciones podrían cambiar el estado antes de liberar los búferes de salida.

## RULE

Esta es una colección especial que proporciona acceso a los campos id, rev, severity, logdata y msg de la regla que activó la acción. Solo puede usarse para referirse a la misma regla en la que reside.

```modsecurity
SecRule &REQUEST_HEADERS:Host "@eq 0" "log,deny,id:59,setvar:tx.varname=%{RULE.id}"
```

## SERVER_ADDR

Esta variable contiene la dirección IP del servidor.

```modsecurity
SecRule SERVER_ADDR "@ipMatch 192.168.1.100" "id:67"
```

## SERVER_NAME

Esta variable contiene el nombre de host o la dirección IP de la transacción, tomada de la propia solicitud (lo que significa que, en principio, no debería ser de confianza).

```modsecurity
SecRule SERVER_NAME "hostname\.com$" "id:68"
```

## SERVER_PORT

Esta variable contiene el puerto local en el que el servidor web (o proxy inverso) está escuchando.

```modsecurity
SecRule SERVER_PORT "^80$" "id:69"
```

## SESSION

Esta variable es una colección que contiene información de sesión. Solo está disponible después de que se ejecute setsid.

El siguiente ejemplo muestra cómo inicializar SESSION usando setsid, cómo usar setvar para incrementar los valores de SESSION.score, cómo establecer la variable SESSION.blocked y, finalmente, cómo denegar la conexión basándose en el valor de SESSION:blocked:

```modsecurity
# Initialize session storage
SecRule REQUEST_COOKIES:PHPSESSID !^$ "phase:2,id:70,nolog,pass,setsid:%{REQUEST_COOKIES.PHPSESSID}"

# Increment session score on attack
SecRule REQUEST_URI "^/cgi-bin/finger$" "phase:2,id:71,t:none,t:lowercase,t:normalizePath,pass,setvar:SESSION.score=+10"

# Detect too many attacks in a session
SecRule SESSION:score "@gt 50" "phase:2,id:72,pass,setvar:SESSION.blocked=1"

# Enforce session block
SecRule SESSION:blocked "@eq 1" "phase:2,id:73,deny,status:403"
```

## SESSIONID

Esta variable contiene el valor establecido con setsid. Véase SESSION (arriba) para un ejemplo completo.

## STATUS_LINE

Esta variable contiene la línea de estado completa enviada por el servidor (incluyendo el método de solicitud y la información de la versión HTTP).

```modsecurity
# Generate an alert when the application generates 500 errors.
SecRule STATUS_LINE "@contains 500" "phase:3,id:49,log,pass,logdata:'Application error detected!,t:none"
Versión: 2.x
```

**Soportado en Coraza:** TBI

## TIME

Esta variable contiene una cadena formateada que representa la hora (hora:minuto:segundo).

```modsecurity
SecRule TIME "^(([1](8|9))|([2](0|1|2|3))):\d{2}:\d{2}$" "id:74"
```

## TIME_DAY

Esta variable contiene la fecha actual (1-31). La siguiente regla se activa en una transacción que ocurre en cualquier momento entre el día 10 y el 20 del mes:

```modsecurity
SecRule TIME_DAY "^(([1](0|1|2|3|4|5|6|7|8|9))|20)$" "id:75"
```

## TIME_EPOCH

Esta variable contiene el tiempo en segundos desde 1970.

## TIME_HOUR

Esta variable contiene el valor de la hora actual (0-23). La siguiente regla se activa cuando se realiza una solicitud "fuera de horario":

```modsecurity
SecRule TIME_HOUR "^(0|1|2|3|4|5|6|[1](8|9)|[2](0|1|2|3))$" "id:76"
```

## TIME_MIN

Esta variable contiene el valor del minuto actual (0-59). La siguiente regla se activa durante la última media hora de cada hora:

```modsecurity
SecRule TIME_MIN "^(3|4|5)" "id:77"
```

## TIME_MON

Esta variable contiene el valor del mes actual (0-11). La siguiente regla coincide si el mes es noviembre (valor 10) o diciembre (valor 11):

```modsecurity
SecRule TIME_MON "^1" "id:78"
```

## TIME_SEC

Esta variable contiene el valor del segundo actual (0-59).

**Soportado:** TBI

```modsecurity
SecRule TIME_SEC "@gt 30" "id:79"
```

## TIME_WDAY

Esta variable contiene el valor del día de la semana actual (0-6). La siguiente regla se activa solo los sábados y domingos:

**Soportado:** TBI

```modsecurity
SecRule TIME_WDAY "^(0|6)$" "id:80"
```

## TIME_YEAR

Esta variable contiene el valor del año actual de cuatro dígitos.

**Soportado:** TBI

```modsecurity
SecRule TIME_YEAR "^2006$" "id:81"
```

## TX

Esta es la colección de transacción transitoria, que se utiliza para almacenar piezas de datos, crear una puntuación de anomalía de transacción, etc. Las variables colocadas en esta colección están disponibles solo hasta que se complete la transacción.

```modsecurity
# Increment transaction attack score on attack
SecRule ARGS attack "phase:2,id:82,nolog,pass,setvar:TX.score=+5"

# Block the transactions whose scores are too high
SecRule TX:SCORE "@gt 20" "phase:2,id:83,log,deny"
```

Algunos nombres de variables en la colección TX están reservados y no pueden usarse:

- **TX:0:** el valor coincidente cuando se usa el operador @rx o @pm con la acción capture
- **TX:1-TX:9:** los valores de subexpresión capturados cuando se usa el operador @rx con paréntesis de captura y la acción capture

## UNIQUE_ID

Esta variable contiene el identificador único de la transacción.

## URLENCODED_ERROR

Esta variable se crea cuando se encuentra una codificación de URL inválida durante el análisis de una cadena de consulta (en cada solicitud) o durante el análisis de un cuerpo de solicitud application/x-www-form-urlencoded (solo en las solicitudes que utilizan el procesador del cuerpo de la solicitud URLENCODED).

## USERID

Esta variable contiene el valor establecido con setuid.

**Soportado:** TBI

```modsecurity
# Initialize user tracking
SecAction "nolog,id:84,pass,setuid:%{REMOTE_USER}"

# Is the current user the administrator?
SecRule USERID "admin" "id:85"
```

## WEBAPPID

Esta variable contiene el nombre de la aplicación actual, que se establece en la configuración usando SecWebAppId.

**Soportado:** TBI

## XML

Colección especial utilizada para interactuar con el analizador XML. Debe contener una expresión XPath válida, que se evaluará contra un árbol DOM XML previamente analizado.

```modsecurity
SecDefaultAction log,deny,status:403,phase:2,id:90
SecRule REQUEST_HEADERS:Content-Type ^text/xml$ "phase:1,id:87,t:lowercase,nolog,pass,ctl:requestBodyProcessor=XML"
SecRule REQBODY_PROCESSOR "!^XML$" skipAfter:12345,id:88
```

Coincidiría con una carga útil como esta:

```xml
<employees>
    <employee>
        <name>Fred Jones</name>
        <address location="home">
            <street>900 Aurora Ave.</street>
            <city>Seattle</city>
            <state>WA</state>
            <zip>98115</zip>
        </address>
        <address location="work">
            <street>2011 152nd Avenue NE</street>
            <city>Redmond</city>
            <state>WA</state>
            <zip>98052</zip>
        </address>
        <phone location="work">(425)555-5665</phone>
        <phone location="home">(206)555-5555</phone>
        <phone location="mobile">(206)555-4321</phone>
    </employee>
</employees>
```
