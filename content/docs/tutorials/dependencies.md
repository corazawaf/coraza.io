---
title: "Installing libinjection & libpcre"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 1105
toc: true
---

Coraza requires two C libraries in order to work, **libinjection** is used to perform ```@isSQLi``` and ```@isXSS```, and **libpcre** is used to perform ```@rx```.

Future versions of Coraza won´t require these dependencies, in order to replace libpcre with golang´s RE2 compiler, rules using pcre compatible expresions must migrate to RE2 standard. Libinjection is being replaced by a golang port, follow the development in [this repository](https://github.com/jptosso/libinjection-go).

## Install libpcre

**Debian/Ubuntu:**

```sh
apt install -y libpcre++-dev
```

**Centos/Rhel:**
```sh
yum install pcre-devel
```

## Install libinjection

```sh
git clone https://github.com/libinjection/libinjection && cd libinjection
gcc -std=c99 -Wall -Werror -fpic -c src/libinjection_sqli.c -o libinjection_sqli.o 
gcc -std=c99 -Wall -Werror -fpic -c src/libinjection_xss.c -o libinjection_xss.o
gcc -std=c99 -Wall -Werror -fpic -c src/libinjection_html5.c -o libinjection_html5.o
gcc -dynamiclib -shared -o libinjection.so libinjection_sqli.o libinjection_xss.o libinjection_html5.o
cp *.so /usr/local/lib
cp *.o /usr/local/lib
cp src/*.h /usr/local/include/
chmod 444 /usr/local/include/libinjection*
ldconfig
```
