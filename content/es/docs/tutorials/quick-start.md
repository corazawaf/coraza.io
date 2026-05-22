---
title: "Inicio Rápido"
description: "Comienza con Coraza WAF: instala la biblioteca, escribe tu primera regla SecLang e integra la proteccion WAF en tu aplicacion web con Go."
lead: "Resumen en una página de cómo iniciar un nuevo proyecto con Coraza WAF."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
weight: 110
toc: true
---

Si no buscas usar Coraza WAF como biblioteca y deseas una implementación o integración de WAF funcional, consulta la página de [Conectores](/connectors/) para ver las integraciones disponibles.

## Requisitos

- Golang {{< goversion >}}+

## Agregar Coraza a tu proyecto Go

```sh
go install github.com/corazawaf/coraza/v3@latest
```

### Crear una instancia de WAF

Las instancias de WAF son el contenedor principal de configuraciones y reglas que son heredadas por las transacciones que procesaran solicitudes, respuestas y registros. Una instancia de WAF puede crearse de la siguiente manera:

```go
package main
import (
  "github.com/corazawaf/coraza/v3"
)
func initCoraza(){
  cfg := coraza.NewWAFConfig()
  waf, err := coraza.NewWAF(cfg)
}
```

### Agregar reglas a una instancia de WAF

La sintaxis de reglas Seclang se utiliza para crear reglas de Coraza, las cuales serán evaluadas por las transacciones y aplicaran acciones disruptivas como deny(403) o simplemente registraran el evento. Consulta las referencias de Seclang.

Las reglas pueden agregarse usando el método ```coraza.NewWAFConfig().WithDirectives()```:
```go
package main

import (
  "github.com/corazawaf/coraza/v3"
)

func createWAF() coraza.WAF {
  waf, err := coraza.NewWAF(coraza.NewWAFConfig().WithDirectives(`SecAction "id:1,phase:1,deny:403,log"`))
  if err != nil {
    panic(err)
  }
  return waf
}
```

### Crear una transacción

Las transacciones se crean para cada solicitud HTTP, son seguras para uso concurrente y manejan [Fases](#) para evaluar reglas y generar auditorias e interrupciones. Una transacción puede crearse usando ```waf.NewTransaction()```.
El ID de la transacción también puede especificarse usando ```waf.NewTransactionWithID(id)```.

#### Manejar una interrupción

Las interrupciones son creadas por las Transacciones para indicar al servidor web o aplicacion que acción se requiere basandose en las reglas de acción. Las interrupciones pueden obtenerse usando ```tx.Interruption()```, una interrupción nula significa que no se necesita ninguna acción (pasar) y una interrupción no nula significa que el servidor web debe hacer algo como denegar la solicitud. Por ejemplo:

```go
//...
tx := waf.NewTransaction()
// Add some variables and process some phases
if it := tx.Interruption();it != nil {
  switch it.Action() {
    case "deny":
      rw.WriteStatus(it.Status())
      rw.Write([]byte("Some error message"))
      return
  }
}
```

#### Manejar una solicitud

Hay dos formas de manejar una solicitud, puedes procesar manualmente cada fase de la solicitud o puedes enviar un http.Request a Coraza.

Para procesar una estructura http.Request debes usar el ayudante ```tx.ProcessRequest(req)```. ProcessRequest evaluara las fases 1 y 2, y detendra el flujo de ejecución si la transacción fue interrumpida. **Importante**: req.Body sera leido y reemplazado con un nuevo puntero, apuntando a un buffer o archivo creado por Coraza.

Para procesar manualmente una solicitud debemos ejecutar 5 funciones en el siguiente orden:

- **ProcessConnection**: Crea variables con información de conexión como direcciones IP y puertos.
- **ProcessUri**: Crea variables a partir de cadenas extraidas de la línea de solicitud, estas son método, url y protocolo.
- **AddRequestHeader**: Debe ejecutarse para cada encabezado HTTP, creara encabezados, variables y cookies.
- **ProcessRequestHeaders**: Evalua las reglas de la fase 1 con todas las variables recopiladas anteriormente. Esta función es disruptiva.
- **RequestBodyBuffer.Write**: Escribe en el buffer del cuerpo de la solicitud, puedes simplemente ```io.Copy(tx.RequestBodyBuffer, someReader)```
- **ProcessRequestBody**: Evalua las reglas de la fase 2 con las variables ```REQUEST_BODY``` y POST. Hay otros casos como MULTIPART, JSON y XML

```go
tx := waf.NewTransaction()
// 127.0.0.1:55555 -> 127.0.0.1:80
tx.ProcessConnection("127.0.0.1", 55555, "127.0.0.1", 80)
// Request URI was /some-url?with=args
tx.ProcessURI("/some-url?with=args")
// We add some headers
tx.AddRequestHeader("Host", "somehost.com")
tx.AddRequestHeader("Cookie", "some-cookie=with-value")
// Content-Type is important to tell coraza which BodyProcessor must be used
tx.AddRequestHeader("Content-Type", "application/x-www-form-urlencoded")
// We process phase 1 (Request)
if it := tx.ProcessRequestHeaders();it != nil {
  return processInterruption(it)
}
// We add urlencoded POST data
tx.RequestBodyBuffer.Write([]byte("somepost=data&with=paramenters"))
// We process phase 2 (Request Body)
if it := tx.ProcessRequestBody();it != nil {
  return processInterruption(it)
}
```

#### Manejar una respuesta

Las respuestas son más dificiles de manejar, por eso no hay un ayudante para hacerlo. Muchas integraciones requieren que crees "interceptores de cuerpo" u otro tipo de funciones.

Hay un ayudante especial, ```IsProcessableResponseBody``` que devuelve **true** si la solicitud puede ser interceptada por Coraza.
Se debe crear un interceptor de cuerpo para almacenar el cuerpo en buffer dentro de la transacción, llamar a ```ProcessResponseBody``` y luego enviar este buffer de vuelta al servidor.

#### Manejar el registro

El registro es una fase obligatoria que debe procesarse incluso si la transacción fue interrumpida. La mejor forma de forzar la llamada a ```ProcessLogging()``` es usar defer, por ejemplo:

```go
//...
tx := waf.NewTransaction()
defer tx.ProcessLogging()
//Process phases
```

#### Manejar solicitudes y respuestas completas
El paquete http de Coraza contiene un middleware que puede usarse para manejar una solicitud y respuesta completa. Este middleware puede usarse con cualquier framework web que soporte http.Handler.

```go
package main

import (
  txhttp "github.com/corazawaf/coraza/v3/http"
)

func main() {
	waf, _ := coraza.NewWAF(coraza.NewWAFConfig())
	http.Handle("/", txhttp.WrapHandler(waf, http.HandlerFunc(exampleHandler)))
	fmt.Println("Server is running. Listening port: 8090")
	log.Fatal(http.ListenAndServe(":8090", nil))
}
```
