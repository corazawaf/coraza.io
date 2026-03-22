---
title: "Extensión"
description: "Extiende Coraza fácilmente con tus propios operadores, acciones, registradores de auditoría y motores de persistencia."
lead: "Los plugins pueden usarse para extender las funcionalidades de Coraza. Actualmente, solo puedes extender acciones de reglas, operadores de reglas y transacciones de reglas, pero en un futuro cercano podrás agregar muchas funcionalidades adicionales."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 0
toc: true
---

- **Operadores de reglas:** Crea operadores de reglas como @even para detectar números pares
- **Transformaciones de reglas:** Crea transformaciones de reglas como t:rot13 para codificar tus valores en ROT13
- **Acciones de reglas:** Crea acciones de reglas como challenge para redirigir una solicitud maliciosa a algún sistema de detección de bots

La interfaz de plugins proporciona tres funciones para extender operadores de reglas, transformaciones y acciones. Cada una de ellas debe coincidir con su tipo o interfaz apropiados y ser registrada usando el paquete ```plugins```.

- **Operadores**: ```type PluginOperatorWrapper() types.RuleOperator```
- **Acciones**: ```type PluginOperatorWrapper() types.RuleAction```
- **Transformaciones**: ```type Transformation = func(input string, tools *transformations.Tools) string```

Después de definir los plugins, debemos registrarlos usando la función ```plugins.Register...``` dentro de la función init ```func init(){}```.

- **Operadores**: ```operators.RegisterPlugin(operator PluginOperatorWrapper)```
- **Acciones**: ```actions.RegisterPlugin(action PluginActionWrapper)```
- **Transformaciones**: ```transformations.RegisterPlugin(transformation transformations.Transformation)```

**Importante:** Algunas integraciones como Traefik no soportan plugins, porque no podemos controlar cómo la integración es compilada por Pilot.

## Instalación de un plugin

El modelo de plugins está basado en el sistema de plugins de Caddy, deben ser compilados junto con el proyecto simplemente importándolos así:

```go
import(
    "github.com/corazawaf/coraza/v3"
    _ "github.com/someone/somecorazaplugin"
)
```

## Creación de acciones de reglas

### Interfaz de acción de regla

```go
type RuleAction interface {
	// Initializes an action, will be done during compilation
	Init(*Rule, string) error
	// Evaluate will be done during rule evaluation
	Evaluate(*Rule, *Transaction)
	// Type will return the rule type, it's used by Evaluate
	// to choose when to evaluate each action
	Type() types.RuleActionType
}
```

### Tipos de acciones

Cada acción puede tener un tipo que define en qué parte del ciclo de vida de la regla será evaluada.

- **ACTION_TYPE_DISRUPTIVE**: Hace que Coraza realice algo. En muchos casos ese algo significa bloquear la transacción, pero no en todos. Por ejemplo, la acción allow se clasifica como una acción disruptiva, pero hace lo opuesto a bloquear. Solo puede haber una acción disruptiva por regla (si hay múltiples acciones disruptivas presentes o heredadas, solo la última tendrá efecto), o cadena de reglas (en una cadena, una acción disruptiva solo puede aparecer en la primera regla).
- **ACTION_TYPE_NONDISRUPTIVE**: Realiza algo, pero ese algo no afecta ni puede afectar el flujo de procesamiento de reglas. Establecer una variable o cambiar su valor es un ejemplo de una acción no disruptiva. Las acciones no disruptivas pueden aparecer en cualquier regla, incluyendo cada regla perteneciente a una cadena.
- **ACTION_TYPE_FLOW**: Estas acciones afectan el flujo de reglas (por ejemplo skip o skipAfter).
- **ACTION_TYPE_METADATA**: Las acciones de metadatos se usan para proporcionar más información sobre las reglas. Ejemplos incluyen id, rev, severity y msg.
- **ACTION_TYPE_DATA**: No son realmente acciones, son meros contenedores que almacenan datos usados por otras acciones. Por ejemplo, la acción status contiene el estado que se usará para el bloqueo (si ocurre).

### Creación de una acción personalizada

```go
type id15 struct{}

// Initializes an action, will be done during compilation
func (id15) Init(rule *coraza.Rule, _ string) error {
 rule.Id = 15
 return nil
}

// Evaluate will be done during rule evaluation
func (id15) Evaluate(_ *coraza.Rule, _ *coraza.Transaction) {}

// ACTION_TYPE_DATA will be only evaluated while compiling the rule, Evaluate won't be called
func (id15) Type() int {
 return coraza.ACTION_TYPE_DATA
}

// Tripwire to match coraza.RuleAction type
var _ coraza.RuleAction = &id15{}
```

### Transformación de la acción en plugin

Una vez creada la acción, debe ser envuelta dentro de un ```type PluginActionWrapper = func() types.RuleAction``` para poder ser registrada.

```go
import(
    "github.com/corazawaf/coraza/v3/experimental/plugins/actions"
    "github.com/corazawaf/coraza/v3/experimental/plugins/types"
)

func init() {
 actions.RegisterPlugin("id15", func() types.RuleAction {
  return &id15{}
 })
}
```

Después de importar correctamente el plugin, podrás crear reglas con la acción ```id15```, por ejemplo:

```conf
SecAction "id15, nolog, pass"
```

## Creación de transformaciones de reglas

Las transformaciones son los componentes más fáciles de extender. Cada transformación implementa el tipo ```transformations.Transformation``` y puede registrarse directamente usando ```plugins.RegisterPlugin(transformation transformations.Transformation)```.

El struct *Tools está diseñado para agregar funcionalidades adicionales como registro y mapeo unicode.

### Tipo de transformación

```go
type Transformation = func(input string, tools *Tools) string
```

### Ejemplo

```go
import (
  "github.com/corazawaf/coraza/v3/experimental/plugins/transformations"
  "strings"
)

func transformationToLowercase(input string) (string, error) {
 return strings.ToLower(input)
}

func init() {
  transformations.RegisterPlugin("tolower2", transformationToLowercase)
}
```

## Creación de operadores de reglas

### Interfaz de operador de regla

```go
// Operator interface is used to define rule @operators
type Operator interface {
 // Init is used during compilation to setup and cache
 // the operator
 Init(string) error
 // Evaluate is used during the rule evaluation,
 // it returns true if the operator succeeded against
 // the input data for the transaction
 Evaluate(*Transaction, string) bool
}
```

### Creación de un operador personalizado

```go
type opEven struct{}

func (opEven) Init(_ string) error {
 return nil
}

func (opEven) Evaluate(_ *coraza.Transaction, input string) bool {
 i, _ := strconv.Atoi(input)
 return i%2 == 0
}

//Tripwire
var _ coraza.Operator = &opEven{}
```

### Transformación del operador en plugin

Una vez creado el operador, debe ser envuelto dentro de un ```type PluginOperatorWrapper = func() coraza.Operator``` para poder ser registrado.

```go
import(
    "github.com/corazawaf/coraza/v3/experimental/plugins/operators"
    "github.com/corazawaf/coraza/v3/experimental/plugins/types"
)

func init() {
 operators.RegisterPlugin("even", func() types.Operator {
  return &opEven{}
 })
}
```

Después de importar correctamente el plugin, podrás crear reglas con el operador ```even```, por ejemplo:

```conf
SecRule ARGS:id "@even" "id:1, nolog, pass"
```

## Pruebas de tu plugin

No hay utilidades especiales para probar plugins pero puedes usar el compilador seclang para lograrlo. Por ejemplo, si queremos probar que la transformación tolower2 funciona, debemos escribir la siguiente prueba:

```go
import(
    "github.com/corazawaf/coraza/v3"
    "strings"
    "testing"
)

func TestToLower2(t *testing.T){
  waf, err := coraza.NewWAF(coraza.NewWAFConfig().WithDirectives(`SecRule ARGS:id "lowercase" "id:1, t:tolower2"`))
  if err != nil {
    t.Error(err)
  }
  str := "TOLowEr"
  if strings.ToLower(str) != transformationToLowercase(str) {
    t.Error("Transformation tolower2 failed")
  }
}
```

## Agregar plugins al repositorio de plugins de Coraza

Esta funcionalidad estará disponible pronto. Mientras tanto, puedes editar este sitio y agregar plugins a ```plugins.html```.

El sitio actualizará su base de datos cada 60 minutos, buscando proyectos con el topic ```coraza-plugin```.

Si el sitio no logra agregar el plugin a la base de datos, creará un issue con los detalles.

### Requisitos

* El proyecto debe ser público en GitHub.
* El proyecto debe tener la palabra clave ```coraza-plugin```.
* El proyecto debe tener un archivo ```.coraza.yml``` válido en la ruta raíz.
* El proyecto debe tener un archivo ```go.mod``` válido.

### .coraza.yml

Este archivo será utilizado en el futuro por el Repositorio Público de Plugins de Coraza, no es requerido por el plugin en sí.

```.coraza.yml``` debe colocarse en el directorio raíz de tu repositorio y debe contener la siguiente estructura YAML válida:

```yaml
# We only accept alphanumeric and -.  ([\w-])
name: some-plugin
author: Your Full name or whatever you want to show
repository: github.com/path/to-project
# Coraza Plugin repository will only accept projects with apache2, MIT and BSD licenses,
# we might accept more in the future
license: apache2
description: Short description to display in plugins.coraza.io
# We are using Ruby Gem versión syntax: https://guides.rubygems.org/patterns/#pessimistic-versión-constraint
# The min supported Coraza versión, each item represents an AND operator
versión:
  - ">= v1.1"
  - "< v2"
  # or ~> that is identical to the previous statements
  - "~> v1.1"
tags:
  - Add some tags
  - For filtering
defs:
  - name: even
    type: action|operator|transformation
    description: Will match if the number is even
```
