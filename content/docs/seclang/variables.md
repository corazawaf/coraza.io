---
title: "Variables"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "seclang"
weight: 100
toc: true
---

## ARGS

**ARGS** is a collection and can be used on its own (means all arguments including the POST Payload), with a static parameter (matches arguments with that name), or with a regular expression (matches all arguments with name that matches the regular expression). To look at only the query string or body arguments, see the ARGS_GET and ARGS_POST collections.

Some variables are actually collections, which are expanded into more variables at runtime. The following example will examine all request arguments:

```
SecRule ARGS dirty "id:7"
```

Sometimes, however, you will want to look only at parts of a collection. This can be achieved with the help of the selection operator(colon). The following example will only look at the arguments named p (do note that, in general, requests can contain multiple arguments with the same name):

```
SecRule ARGS:p dirty "id:8"
```

It is also possible to specify exclusions. The following will examine all request arguments for the word dirty, except the ones named z (again, there can be zero or more arguments named z):

```
SecRule ARGS|!ARGS:z dirty "id:9"
```

There is a special operator that allows you to count how many variables there are in a collection. The following rule will trigger if there is more than zero arguments in the request (ignore the second parameter for the time being):

```
SecRule &ARGS !^0$ "id:10"
```

And sometimes you need to look at an array of parameters, each with a slightly different name. In this case you can specify a regular expression in the selection operator itself. The following rule will look into all arguments whose names begin with id_:

```
SecRule ARGS:/^id_/ dirty "id:11"
```

**Note :** Using ```ARGS:p``` will not result in any invocations against the operator if argument p does not exist.

## ARGS_COMBINED_SIZE

Contains the combined size of all request parameters. Files are excluded from the calculation. This variable can be useful, for example, to create a rule to ensure that the total size of the argument data is below a certain threshold. The following rule detects a request whose parameters are more than 2500 bytes long:

```
SecRule ARGS_COMBINED_SIZE "@gt 2500" "id:12"
````

## ARGS_GET

**ARGS_GET** is similar to ARGS, but contains only query string parameters.

## ARGS_GET_NAMES

**ARGS_GET_NAMES** is similar to **ARGS_NAMES**, but contains only the names of query string parameters.

## ARGS_NAMES

Contains all request parameter names. You can search for specific parameter names that you want to inspect. In a positive policy scenario, you can also whitelist (using an inverted rule with the exclamation mark) only the authorized argument names. This example rule allows only two argument names: p and a:

```
SecRule ARGS_NAMES "!^(p|a)$" "id:13"
```

## ARGS_POST

**ARGS_POST** is similar to **ARGS**, but only contains arguments from the POST body.

## ARGS_POST_NAMES

**ARGS_POST_NAMES** is similar to **ARGS_NAMES**, but contains only the names of request body parameters.

## AUTH_TYPE
**Not Implemented yet**

This variable holds the authentication method used to validate a user, if any of the methods built into HTTP are used. In a reverse-proxy deployment, this information will not be available if the authentication is handled in the backend web server.

```
SecRule AUTH_TYPE "Basic" "id:14"
```

## DURATION
**Not Implemented yet**

Contains the number of microseconds elapsed since the beginning of the current transaction.

## ENV
**Not Implemented yet**

Collection that provides access to environment variables set by Coraza or other server modules. Requires a single parameter to specify the name of the desired variable.

```
# Set environment variable 
SecRule REQUEST_FILENAME "printenv" \
"phase:2,id:15,pass,setenv:tag=suspicious" 

# Inspect environment variable
SecRule ENV:tag "suspicious" "id:16"

# Reading an environment variable from other Apache module (mod_ssl)
SecRule TX:ANOMALY_SCORE "@gt 0" "phase:5,id:16,msg:'%{env.ssl_cipher}'"
```

**Note :** Use setenv to set environment variables to be accessed by Apache.

## FILES

Contains a collection of original file names (as they were called on the remote user’s filesys- tem). Available only on inspected multipart/form-data requests.

```
SecRule FILES "@rx \.conf$" "id:17"
```

**Note :** Only available if files were extracted from the request body.

## FILES_COMBINED_SIZE

Contains the total size of the files transported in request body. Available only on inspected multipart/form-data requests.

```
SecRule FILES_COMBINED_SIZE "@gt 100000" "id:18"
```

## FILES_NAMES

Contains a list of form fields that were used for file upload. Available only on inspected multipart/form-data requests.

```
SecRule FILES_NAMES "^upfile$" "id:19"
```

## FULL_REQUEST_LENGTH

Represents the amount of bytes that FULL_REQUEST may use.

```
SecRule FULL_REQUEST_LENGTH "@eq 205" "id:21"
```

## FILES_SIZES

Contains a list of individual file sizes. Useful for implementing a size limitation on individual uploaded files. Available only on inspected multipart/form-data requests.

```
SecRule FILES_SIZES "@gt 100" "id:20"
```

## FILES_TMPNAMES

Contains a list of temporary files’ names on the disk. Useful when used together with @inspectFile. Available only on inspected multipart/form-data requests.

```
SecRule FILES_TMPNAMES "@inspectFile /path/to/inspect_script.pl" "id:21"
```

## FILES_TMP_CONTENT

Contains a key-value set where value is the content of the file which was uploaded. Useful when used together with @fuzzyHash.

```
SecRule FILES_TMP_CONTENT "@fuzzyHash $ENV{CONF_DIR}/ssdeep.txt 1" "id:192372,log,deny"
```

**Note :** SecUploadKeepFiles should be set to 'On' in order to have this collection filled.

## GEO

GEO is a collection populated by the results of the last @geoLookup operator. The collection can be used to match geographical fields looked from an IP address or hostname.

Fields:

- **COUNTRY_CODE:** Two character country code. EX: US, CL, GB, etc.
- **COUNTRY_CODE3:** Up to three character country code.
- **COUNTRY_NAME:** The full country name.
- **COUNTRY_CONTINENT:** The two character continent that the country is located. EX: EU
- **REGION:** The two character region. For US, this is state. For Chile, region, etc.
- **CITY:** The city name if supported by the database.
- **POSTAL_CODE:** The postal code if supported by the database.
- **LATITUDE:** The latitude if supported by the database.
- **LONGITUDE:** The longitude if supported by the database.

**Example:**

```
SecGeoLookupDb maxminddb file=/usr/local/geo/data/GeoLiteCity.dat
...
SecRule REMOTE_ADDR "@geoLookup" "chain,id:22,drop,msg:'Non-GB IP address'"
SecRule GEO:COUNTRY_CODE "!@streq GB"
```

## HIGHEST_SEVERITY

This variable holds the highest severity of any rules that have matched so far. Severities are numeric values and thus can be used with comparison operators such as @lt, and so on. A value of 255 indicates that no severity has been set.

```
SecRule HIGHEST_SEVERITY "@le 2" "phase:2,id:23,deny,status:500,msg:'severity %{HIGHEST_SEVERITY}'"
```

**Note :** Higher severities have a lower numeric value.

## INBOUND_DATA_ERROR

This variable will be set to 1 when the request body size is above the setting configured by **SecRequestBodyLimit** directive. Your policies should always contain a rule to check this variable. Depending on the rate of false positives and your default policy you should decide whether to block or just warn when the rule is triggered.

The best way to use this variable is as in the example below:

```
SecRule INBOUND_DATA_ERROR "@eq 1" "phase:1,id:24,t:none,log,pass,msg:'Request Body Larger than SecRequestBodyLimit Setting'"
```

## MATCHED_VAR

This variable holds the value of the most-recently matched variable. It is similar to the TX:0, but it is automatically supported by all operators and there is no need to specify the capture action.

```
SecRule ARGS pattern chain,deny,id:25
  SecRule MATCHED_VAR "further scrutiny"
```

**Note :** Be aware that this variable holds data for the last operator match. This means that if there are more than one matches, only the last one will be populated. Use MATCHED_VARS variable if you want all matches.

## MATCHED_VARS

Similar to **MATCHED_VAR** except that it is a collection of all matches for the current operator check.

```
SecRule ARGS pattern "chain,deny,id:26"
  SecRule MATCHED_VARS "@eq ARGS:param"
```

## MATCHED_VAR_NAME

This variable holds the full name of the variable that was matched against.

```
SecRule ARGS pattern "chain,deny,id:27"
  SecRule MATCHED_VAR_NAME "@eq ARGS:param"
```

**Note :** Be aware that this variable holds data for the last operator match. This means that if there are more than one matches, only the last one will be populated. Use MATCHED_VARS_NAMES variable if you want all matches.

## MATCHED_VARS_NAMES

Similar to MATCHED_VAR_NAME except that it is a collection of all matches for the current operator check.

```
SecRule ARGS pattern "chain,deny,id:28"
  SecRule MATCHED_VARS_NAMES "@eq ARGS:param"
```

## MULTIPART_FILENAME

This variable contains the multipart data from field FILENAME.

## MULTIPART_NAME

This variable contains the multipart data from field NAME.

## OUTBOUND_DATA_ERROR

This variable will be set to 1 when the response body size is above the setting configured by SecResponseBodyLimit directive. Your policies should always contain a rule to check this variable. Depending on the rate of false positives and your default policy you should decide whether to block or just warn when the rule is triggered.

The best way to use this variable is as in the example below:

```
SecRule OUTBOUND_DATA_ERROR "@eq 1" "phase:1,id:32,t:none,log,pass,msg:'Response Body Larger than SecResponseBodyLimit Setting'"
```

## PATH_INFO

Contains the extra request URI information, also known as path info. (For example, in the URI /index.php/123, /123 is the path info.) Available only in embedded deployments.

```
SecRule PATH_INFO "^/(bin|etc|sbin|opt|usr)" "id:33"
```

## PERF_ALL
**Not Implemented yet**

This special variable contains a string that’s a combination of all other performance variables, arranged in the same order in which they appear in the Stopwatch2 audit log header. It’s intended for use in custom Apache logs

**Supported on Coraza:** TBI

## PERF_COMBINED
**Not Implemented yet**

Contains the time, in microseconds, spent in Coraza during the current transaction. The value in this variable is arrived to by adding all the performance variables except PERF_SREAD (the time spent reading from persistent storage is already included in the phase measurements).

**Supported on Coraza:** TBI

PERF_GC
Contains the time, in microseconds, spent performing garbage collection.

**Supported on Coraza:** TBI

## PERF_LOGGING
**Not Implemented yet**

Contains the time, in microseconds, spent in audit logging. This value is known only after the handling of a transaction is finalized, which means that it can only be logged using mod_log_config and the %{VARNAME}M syntax.

**Supported on Coraza:** TBI

## PERF_PHASE1
**Not Implemented yet**

Contains the time, in microseconds, spent processing phase 1.

**Supported on Coraza:** TBI

## PERF_PHASE2
**Not Implemented yet**

Contains the time, in microseconds, spent processing phase 2.

**Supported on Coraza:** TBI

## PERF_PHASE3
**Not Implemented yet**

Contains the time, in microseconds, spent processing phase 3.

**Supported on Coraza:** TBI

## PERF_PHASE4
**Not Implemented yet**

Contains the time, in microseconds, spent processing phase 4.

**Supported on Coraza:** TBI

## PERF_PHASE5
**Not Implemented yet**

Contains the time, in microseconds, spent processing phase 5.

**Supported on Coraza:** TBI

## PERF_RULES
**Not Implemented yet**

PERF_RULES is a collection, that is populated with the rules hitting the performance threshold defined with SecRulePerfTime. The collection contains the time, in microseconds, spent processing the individual rule. The various items in the collection can be accessed via the rule id.

Supported on Coraza: TBI

```
SecRulePerfTime            100

SecRule FILES_TMPNAMES "@inspectFile /path/to/util/runav.pl" \
  "phase:2,id:10001,deny,log,msg:'Virus scan detected an error.'"

SecRule   &PERF_RULES "@eq 0"    "phase:5,id:95000,\
  pass,log,msg:'All rules performed below processing time limit.'"
SecRule   PERF_RULES  "@ge 1000" "phase:5,id:95001,pass,log,\
  msg:'Rule %{MATCHED_VAR_NAME} spent at least 1000 usec.'"
SecAction "phase:5,id:95002,pass,log, msg:'File inspection took %{PERF_RULES.10001} usec.'"
```

The rule with id 10001 defines an external file inspection rule. The rule with id 95000 checks the size of the PERF_RULES collection. If the collection is empty, it writes a note in the logfile. Rule 95001 is executed for every item in the PERF_RULES collection. Every item is thus being checked against the limit of 1000 microseconds. If the rule spent at least that amount of time, then a note containing the rule id is being written to the logfile. The final rule 95002 notes the time spent in rule 10001 (the virus inspection).

## PERF_SREAD
**Not Implemented yet**

Contains the time, in microseconds, spent reading from persistent storage.

**Supported on Coraza:** TBI

## PERF_SWRITE
**Not Implemented yet**

Contains the time, in microseconds, spent writing to persistent storage.

**Supported on Coraza:** TBI

## QUERY_STRING
Contains the query string part of a request URI. The value in QUERY_STRING is always provided raw, without URL decoding taking place.

```
SecRule QUERY_STRING "attack" "id:34"
```

## REMOTE_ADDR
This variable holds the IP address of the remote client.

```
SecRule REMOTE_ADDR "@ipMatch 192.168.1.101" "id:35"
```

## REMOTE_HOST

If the Apache directive HostnameLookups is set to On, then this variable will hold the remote hostname resolved through DNS. If the directive is set to Off, this variable it will hold the remote IP address (same as REMOTE_ADDR). Possible uses for this variable would be to deny known bad client hosts or network blocks, or conversely, to allow in authorized hosts.

```
SecRule REMOTE_HOST "\.evil\.network\org$" "id:36"
```

## REMOTE_PORT

This variable holds information on the source port that the client used when initiating the connection to our web server.

In the following example, we are evaluating to see whether the REMOTE_PORT is less than 1024, which would indicate that the user is a privileged user:

```
SecRule REMOTE_PORT "@lt 1024" "id:37"
```

## REMOTE_USER

This variable holds the username of the authenticated user. If there are no password access controls in place (Basic or Digest authentication), then this variable will be empty.

```
SecRule REMOTE_USER "@streq admin" "id:38"
```

**Note :** In a reverse-proxy deployment, this information will not be available if the authentication is handled in the backend web server.

## REQBODY_ERROR

Contains the status of the request body processor used for request body parsing. The values can be 0 (no error) or 1 (error). This variable will be set by request body processors (typically the multipart/request-data parser, JSON or the XML parser) when they fail to do their work.

```
SecRule REQBODY_ERROR "@eq 1" deny,phase:2,id:39
```

**Note :** Your policies must have a rule to check for request body processor errors at the very beginning of phase 2. Failure to do so will leave the door open for impedance mismatch attacks. It is possible, for example, that a payload that cannot be parsed by Coraza can be successfully parsed by more tolerant parser operating in the application. If your policy dictates blocking, then you should reject the request if error is detected. When operating in detection-only mode, your rule should alert with high severity when request body processing fails.

## REQBODY_ERROR_MSG

If there’s been an error during request body parsing, the variable will contain the following error message:

```
SecRule REQBODY_ERROR_MSG "failed to parse" "id:40"
```

## REQBODY_PROCESSOR

Contains the name of the currently used request body processor. The possible values are URLENCODED, JSON, MULTIPART, and XML.

```
SecRule REQBODY_PROCESSOR "^XML$ chain,id:41 
  SecRule XML://* "something" "id:123"
```

## REQUEST_BASENAME

This variable holds just the filename part of REQUEST_FILENAME (e.g., index.php).

```
SecRule REQUEST_BASENAME "^login\.php$" phase:2,id:42,t:none,t:lowercase
```

**Note :** Please note that anti-evasion transformations are not applied to this variable by default. REQUEST_BASENAME will recognize both / and \ as path separators. You should understand that the value of this variable depends on what was provided in request, and that it does not have to correspond to the resource (on disk) that will be used by the web server.

## REQUEST_BODY

Holds the raw request body. This variable is available only if the URLENCODED request body processor was used, which will occur by default when the application/x-www-form-urlencoded content type is detected, or if the use of the URLENCODED request body parser was forced.

```
SecRule REQUEST_BODY "^username=\w{25,}\&password=\w{25,}\&Submit\=login$" "id:43"
```

It is possible to force the presence of the REQUEST_BODY variable, but only when there is no request body processor defined using the ```ctl:forceRequestBodyVariable``` option in the REQUEST_HEADERS phase.

## REQUEST_BODY_LENGTH

Contains the number of bytes read from a request body.

## REQUEST_COOKIES

This variable is a collection of all of request cookies (values only). Example: the following example is using the Ampersand special operator to count how many variables are in the collection. In this rule, it would trigger if the request does not include any Cookie headers.

```
SecRule &REQUEST_COOKIES "@eq 0" "id:44"
```

## REQUEST_COOKIES_NAMES

This variable is a collection of the names of all request cookies. For example, the following rule will trigger if the JSESSIONID cookie is not present:

```
SecRule &REQUEST_COOKIES_NAMES:JSESSIONID "@eq 0" "id:45"
```

## REQUEST_FILENAME

This variable holds the relative request URL without the query string part (e.g., /index.php).

```
SecRule REQUEST_FILENAME "^/cgi-bin/login\.php$" phase:2,id:46,t:none,t:normalizePath
```

**Note :** Please note that anti-evasion transformations are not used on REQUEST_FILENAME, which means that you will have to specify them in the rules that use this variable.

## REQUEST_HEADERS

This variable can be used as either a collection of all of the request headers or can be used to inspect selected headers (by using the REQUEST_HEADERS:Header-Name syntax).

```
SecRule REQUEST_HEADERS:Host "^[\d\.]+$" "deny,id:47,log,status:400,msg:'Host header is a numeric IP address'"
```

**Note:** Coraza will treat multiple headers that have identical names as a "list", processing each single value.

## REQUEST_HEADERS_NAMES

This variable is a collection of the names of all of the request headers.

```
SecRule REQUEST_HEADERS_NAMES "^x-forwarded-for" "log,deny,id:48,status:403,t:lowercase,msg:'Proxy Server Used'"
```

## REQUEST_LINE

This variable holds the complete request line sent to the server (including the request method and HTTP version information).

```
# Allow only POST, GET and HEAD request methods, as well as only
# the valid protocol versions 
SecRule REQUEST_LINE "!(^((?:(?:POS|GE)T|HEAD))|HTTP/(0\.9|1\.0|1\.1)$)" "phase:1,id:49,log,block,t:none"
```

## REQUEST_METHOD

This variable holds the request method used in the transaction.

```
SecRule REQUEST_METHOD "^(?:CONNECT|TRACE)$" "id:50,t:none"
```

## REQUEST_PROTOCOL

This variable holds the request protocol version information.

```
SecRule REQUEST_PROTOCOL "!^HTTP/(0\.9|1\.0|1\.1)$" "id:51"
```

## REQUEST_URI

This variable holds the full request URL including the query string data (e.g., /index.php? p=X). However, it will never contain a domain name, even if it was provided on the request line.

```
SecRule REQUEST_URI "attack" "phase:1,id:52,t:none,t:urlDecode,t:lowercase,t:normalizePath"
```

**Note :** Please note that anti-evasion transformations are not used on REQUEST_URI, which means that you will have to specify them in the rules that use this variable.

## REQUEST_URI_RAW

Same as REQUEST_URI but will contain the domain name if it was provided on the request line (e.g., http://www.example.com/index.php?p=X).

```
SecRule REQUEST_URI_RAW "http:/" "phase:1,id:53,t:none,t:urlDecode,t:lowercase,t:normalizePath"
```

**Note :** Please note that anti-evasion transformations are not used on REQUEST_URI_RAW, which means that you will have to specify them in the rules that use this variable.

## RESPONSE_BODY

This variable holds the data for the response body, but only when response body buffering is enabled.

```
SecRule RESPONSE_BODY "ODBC Error Code" "phase:4,id:54,t:none"
```

## RESPONSE_CONTENT_LENGTH

Response body length in bytes. Can be available starting with phase 3, but it does not have to be (as the length of response body is not always known in advance). If the size is not known, this variable will contain a zero. If RESPONSE_CONTENT_LENGTH contains a zero in phase 5 that means the actual size of the response body was 0. The value of this variable can change between phases if the body is modified. For example, in embedded mode, mod_deflate can compress the response body between phases 4 and 5.

## RESPONSE_CONTENT_TYPE

Response content type. Available only starting with phase 3. The value available in this variable is taken directly from the internal structures of Apache, which means that it may contain the information that is not yet available in response headers. In embedded deployments, you should always refer to this variable, rather than to RESPONSE_HEADERS:Content-Type.

## RESPONSE_HEADERS

This variable refers to response headers, in the same way as REQUEST_HEADERS does to request headers.

```
SecRule RESPONSE_HEADERS:X-Cache "MISS" "id:55"
```

This variable may not have access to some headers when running in embedded mode. Headers such as Server, Date, Connection, and Content-Type could be added just prior to sending the data to the client. This data should be available in phase 5 or when deployed in proxy mode.

## RESPONSE_HEADERS_NAMES

This variable is a collection of the response header names.

```
SecRule RESPONSE_HEADERS_NAMES "Set-Cookie" "phase:3,id:56,t:none"
```

The same limitations apply as the ones discussed in RESPONSE_HEADERS.

## RESPONSE_PROTOCOL

This variable holds the HTTP response protocol information.

```
SecRule RESPONSE_PROTOCOL "^HTTP\/0\.9" "phase:3,id:57,t:none"
```

## RESPONSE_STATUS

This variable holds the HTTP response status code:

```
SecRule RESPONSE_STATUS "^[45]" "phase:3,id:58,t:none"
```

This variable may not work as expected, as some implementations might change the status before releasing the output buffers.

## RULE

This is a special collection that provides access to the id, rev, severity, logdata, and msg fields of the rule that triggered the action. It can be used to refer to only the same rule in which it resides.

```
SecRule &REQUEST_HEADERS:Host "@eq 0" "log,deny,id:59,setvar:tx.varname=%{RULE.id}"
```

## SERVER_ADDR

This variable contains the IP address of the server.

```
SecRule SERVER_ADDR "@ipMatch 192.168.1.100" "id:67"
```

## SERVER_NAME

This variable contains the transaction’s hostname or IP address, taken from the request itself (which means that, in principle, it should not be trusted).

```
SecRule SERVER_NAME "hostname\.com$" "id:68"
```

## SERVER_PORT

This variable contains the local port that the web server (or reverse proxy) is listening on.

```
SecRule SERVER_PORT "^80$" "id:69"
```

## SESSION

This variable is a collection that contains session information. It becomes available only after setsid is executed.

The following example shows how to initialize SESSION using setsid, how to use setvar to increase the SESSION.score values, how to set the SESSION.blocked variable, and finally, how to deny the connection based on the SESSION:blocked value:

```
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

This variable contains the value set with setsid. See SESSION (above) for a complete example.

## STATUS_LINE

This variable holds the full status line sent by the server (including the request method and HTTP version information).

```
# Generate an alert when the application generates 500 errors.
SecRule STATUS_LINE "@contains 500" "phase:3,id:49,log,pass,logdata:'Application error detected!,t:none"
Version: 2.x
```

**Supported on Coraza:** TBI

## TIME

This variable holds a formatted string representing the time (hour:minute:second).

```
SecRule TIME "^(([1](8|9))|([2](0|1|2|3))):\d{2}:\d{2}$" "id:74"
```

## TIME_DAY

This variable holds the current date (1–31). The following rule triggers on a transaction that’s happening anytime between the 10th and 20th in a month:

```
SecRule TIME_DAY "^(([1](0|1|2|3|4|5|6|7|8|9))|20)$" "id:75"
```

## TIME_EPOCH

This variable holds the time in seconds since 1970.

## TIME_HOUR

This variable holds the current hour value (0–23). The following rule triggers when a request is made “off hours”:

```
SecRule TIME_HOUR "^(0|1|2|3|4|5|6|[1](8|9)|[2](0|1|2|3))$" "id:76"
```

## TIME_MIN

This variable holds the current minute value (0–59). The following rule triggers during the last half hour of every hour:

```
SecRule TIME_MIN "^(3|4|5)" "id:77"
```

## TIME_MON

This variable holds the current month value (0–11). The following rule matches if the month is either November (value 10) or December (value 11):

```
SecRule TIME_MON "^1" "id:78"
```

## TIME_SEC

This variable holds the current second value (0–59).

**Supported:** TBI

```
SecRule TIME_SEC "@gt 30" "id:79"
```

## TIME_WDAY

This variable holds the current weekday value (0–6). The following rule triggers only on Satur- day and Sunday:

**Supported:** TBI

```
SecRule TIME_WDAY "^(0|6)$" "id:80"
```

## TIME_YEAR

This variable holds the current four-digit year value.

**Supported:** TBI

```
SecRule TIME_YEAR "^2006$" "id:81"
```

## TX

This is the transient transaction collection, which is used to store pieces of data, create a transaction anomaly score, and so on. The variables placed into this collection are available only until the transaction is complete.

```
# Increment transaction attack score on attack 
SecRule ARGS attack "phase:2,id:82,nolog,pass,setvar:TX.score=+5"

# Block the transactions whose scores are too high 
SecRule TX:SCORE "@gt 20" "phase:2,id:83,log,deny"
```

Some variable names in the TX collection are reserved and cannot be used:

- **TX:0:** the matching value when using the @rx or @pm operator with the capture action
- **TX:1-TX:9:** the captured subexpression value when using the @rx operator with capturing parens and the capture action

## UNIQUE_ID

This variable holds the unique id for the transaction.

## URLENCODED_ERROR

This variable is created when an invalid URL encoding is encountered during the parsing of a query string (on every request) or during the parsing of an application/x-www-form-urlencoded request body (only on the requests that use the URLENCODED request body processor).

## USERID

This variable contains the value set with setuid.

**Supported:** TBI

```
# Initialize user tracking
SecAction "nolog,id:84,pass,setuid:%{REMOTE_USER}" 

# Is the current user the administrator?
SecRule USERID "admin" "id:85"
```

## WEBAPPID

This variable contains the current application name, which is set in configuration using SecWebAppId.

**Supported:** TBI

## XML

Special collection used to interact with the XML parser. It must contain a valid XPath expression, which will then be evaluated against a previously parsed XML DOM tree.

```
SecDefaultAction log,deny,status:403,phase:2,id:90
SecRule REQUEST_HEADERS:Content-Type ^text/xml$ "phase:1,id:87,t:lowercase,nolog,pass,ctl:requestBodyProcessor=XML"
SecRule REQBODY_PROCESSOR "!^XML$" skipAfter:12345,id:88
```

It would match against payload such as this one:

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
