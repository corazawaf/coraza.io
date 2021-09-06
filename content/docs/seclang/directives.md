---
title: "Directives"
Description: "The following section outlines all of the Coraza directives. "
lead: "The following section outlines all of the Coraza directives. "
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "seclang"
weight: 10
toc: true
---

If you are looking to extend OWASP Core Ruleset, check this article.

Note : It is highly encouraged that you do not edit the Core rules files themselves but rather place all changes (such as SecRuleRemoveByID, etc...) in your custom rules file. This will allow for easier upgrading as newer Core rules are released.

## SecAction
**Description:** Unconditionally processes the action list it receives as the first and only parameter. The syntax of the parameter is identical to that of the third parameter of SecRule.

**Syntax:** SecAction "action1,action2,action3,...“

This directive is commonly used to set variables and initialize persistent collections using the initcol action. For example:

```
SecAction nolog,phase:1,initcol:RESOURCE=%{REQUEST_FILENAME}
```

## SecArgumentSeparator

**Description:** Specifies which character to use as the separator for application/x-www-form- urlencoded content.

**Syntax:** SecArgumentSeparator character

**Default:** &

This directive is needed if a backend web application is using a nonstandard argument separator. Applications are sometimes (very rarely) written to use a semicolon separator. You should not change the default setting unless you establish that the application you are working with requires a different separator. If this directive is not set properly for each web application, then Coraza will not be able to parse the arguments appropriately and the effectiveness of the rule matching will be significantly decreased.


## SecAuditEngine
**Description:** Configures the audit logging engine.

**Syntax:** SecAuditEngine RelevantOnly

**Default:** Off

The SecAuditEngine directive is used to configure the audit engine, which logs complete transactions. Coraza is currently able to log most, but not all transactions. Transactions involving errors (e.g., 400 and 404 transactions) use a different execution path, which Coraza does not support.

The possible values for the audit log engine are as follows:

- **On:** log all transactions
- **Off:** do not log any transactions
- **RelevantOnly:** only the log transactions that have triggered a warning or an error, or have a status code that is considered to be relevant (as determined by the SecAuditLogRelevantStatus directive)

**Note :** If you need to change the audit log engine configuration on a per-transaction basis (e.g., in response to some transaction data), use the ctl action.
The following example demonstrates how SecAuditEngine is used:

```
SecAuditEngine RelevantOnly
SecAuditLog logs/audit/audit.log
SecAuditLogParts ABCFHZ 
SecAuditLogType concurrent 
SecAuditLogStorageDir logs/audit 
SecAuditLogRelevantStatus ^(?:5|4(?!04))
```

## SecAuditLog

**Description:** Defines the path to the main audit log file (serial logging format) or the concurrent logging index file (concurrent logging format). When used in combination with mlogc (only possible with concurrent logging), this directive defines the mlogc location and command line.

**Syntax:** SecAuditLog /path/to/audit.log


```
SecAuditLog "|/path/to/mlogc /path/to/mlogc.conf"
```

Note : This audit log file is opened on startup when the server typically still runs as root. You should not allow non-root users to have write privileges for this file or for the directory.

## SecAuditLogParts
**Description:** Defines which parts of each transaction are going to be recorded in the audit log. Each part is assigned a single letter; when a letter appears in the list then the equivalent part will be recorded. See below for the list of all parts.

**Syntax:** SecAuditLogParts PARTLETTERS

**Example Usage:** SecAuditLogParts ABCFHZ

The format of the audit log format is documented in detail in the Audit Log Data Format Documentation.

Available audit log parts:

- **A:** Audit log header (mandatory).
- **B:** Request headers.
- **C:** Request body (present only if the request body exists and Coraza is configured to intercept it. This would require SecRequestBodyAccess to be set to on).
- **D:** Reserved for intermediary response headers; not implemented yet.
- **E:** Intermediary response body (present only if Coraza is configured to intercept response bodies, and if the audit log engine is configured to record it. Intercepting response bodies requires SecResponseBodyAccess to be enabled). Intermediary response body is the same as the actual response body unless Coraza intercepts the intermediary response body, in which case the actual response body will contain the error message (either the Apache default error message, or the ErrorDocument page).
- **F:** Final response headers (excluding the Date and Server headers, which are always added by Apache in the late stage of content delivery).
- **G:** Reserved for the actual response body; not implemented yet.
- **H:** Audit log trailer.
- **I:** This part is a replacement for part C. It will log the same data as C in all cases except when multipart/form-data encoding in used. In this case, it will log a fake application/x-www-form-urlencoded body that contains the information about parameters but not about the files. This is handy if you don’t want to have (often large) files stored in your audit logs.
- **J:** This part contains information about the files uploaded using multipart/form-data encoding.
- **K:** This part contains a full list of every rule that matched (one per line) in the order they were matched. The rules are fully qualified and will thus show inherited actions and default operators.
- **Z:** Final boundary, signifies the end of the entry (mandatory).

## SecAuditLogRelevantStatus
**Description:** Configures which response status code is to be considered relevant for the purpose of audit logging.

**Syntax:** SecAuditLogRelevantStatus REGEX

**Example Usage:** SecAuditLogRelevantStatus "^(?:5|4(?!04))"

Dependencies/Notes: Must have SecAuditEngine set to RelevantOnly. Additionally, the auditlog action is present by default in rules, this will make the engine bypass the 'SecAuditLogRelevantStatus' and send rule matches to the audit log regardless of status. You must specify noauditlog in the rules manually or set it in SecDefaultAction.

The main purpose of this directive is to allow you to configure audit logging for only the transactions that have the status code that matches the supplied regular expression. The example provided would log all 5xx and 4xx level status codes, except for 404s. Although you could achieve the same effect with a rule in phase 5, SecAuditLogRelevantStatus is sometimes better, because it continues to work even when SecRuleEngine is disabled.

## SecCollectionTimeout
**Description:** Specifies the collections timeout. Default is 3600 seconds.

**Syntax:** SecCollectionTimeout seconds

**Default:** 3600

**Supported:** No


## SecComponentSignature
**Description:** Appends component signature to the Coraza signature.

**Syntax:** SecComponentSignature "COMPONENT_NAME/X.Y.Z (COMMENT)"

**Example Usage:** SecComponentSignature "core ruleset/2.1.3"

**Supported:** No

This directive should be used to make the presence of significant rule sets known. The entire signature will be recorded in the transaction audit log.

## SecContentInjection
**Description:** Enables content injection using actions append and prepend.

**Syntax:** SecContentInjection On|Off

**Example Usage:** SecContentInjection On

**Supported:** TBI

This directive provides an easy way to control content injection, no matter what the rules want to do. It is not necessary to have response body buffering enabled in order to use content injection.

Note : This directive must ben enabled if you want to use @rsub + the STREAM_ variables to manipulate live transactional data.


## SecDataDir
**Description:** Path where persistent data (e.g., IP address data, session data, and so on) is to be stored.

**Syntax:** SecDataDir /path/to/dir

**Example Usage:** SecDataDir /usr/local/apache/logs/data

**Supported:** No

This directive must be provided before initcol, setsid, and setuid can be used. The directory to which the directive points must be writable by the web server user.

Note : This directive is not allowed inside VirtualHosts. If enabled, it must be placed in a global server-wide configuration file such as your default Coraza.conf.
Note : SecDataDir is not currently supported. Collections are kept in memory (in_memory-per_process) for now.

## SecDebugLog
**Description:** Path to the Coraza debug log file.

**Syntax:** SecDebugLog /path/to/modsec-debug.log

**Example Usage:** SecDebugLog /usr/local/apache/logs/modsec-debug.log

**Supported:** Yes


## SecDebugLogLevel
**Description:** Configures the verboseness of the debug log data.

**Syntax:** SecDebugLogLevel 0|1|2|3|4|5

**Example Usage:** SecDebugLogLevel 4

**Supported:** Yes

Messages at levels 1–3 are always copied to the Apache error log. Therefore you can always use level 0 as the default logging level in production if you are very concerned with performance. Having said that, the best value to use is 3. Higher logging levels are not recommended in production, because the heavy logging affects performance adversely.

The possible values for the debug log level are:

- **0:** Fatal
- **1:** Panic
- **2:** Error
- **3:** Warning
- **4:** details of how transactions are handled
- **5:** log everything, including very detailed debugging information

## SecDefaultAction
**Description:** Defines the default list of actions, which will be inherited by the rules in the same configuration context.

**Syntax:** SecDefaultAction "action1,action2,action3“

**Example Usage:** SecDefaultAction "phase:2,log,auditlog,deny,status:403,tag:'SLA 24/7'“

**Supported:** Yes

**Default:** phase:2,log,auditlog,pass

Every rule following a previous SecDefaultAction directive in the same configuration context will inherit its settings unless more specific actions are used. Every SecDefaultAction directive must specify a disruptive action and a processing phase and cannot contain metadata actions.


## SecDisableBackendCompression
**Description:** Disables backend compression while leaving the frontend compression enabled.

**Syntax:** SecDisableBackendCompression On|Off

**Supported:** TBI

**Default:** Off

This directive is necessary in reverse proxy mode when the backend servers support response compression, but you wish to inspect response bodies. Unless you disable backend compression, Coraza will only see compressed content, which is not very useful. This directive is not necessary in embedded mode, because Coraza performs inspection before response compression takes place.


## SecHashEngine
**Description:** Configures the hash engine.

**Syntax:** SecHashEngine On|Off

**Example Usage:** SecHashEngine On

**Supported:** TBI

**Default:** Off

The possible values are:

- **On:** Hash engine can process the request/response data.
- **Off:** Hash engine will not process any data.

**Note**: Users must enable stream output variables and content injection.

## SecHashKey
**Description:** Define the key that will be used by HMAC.

**Syntax:** SecHashKey rand|TEXT KeyOnly|SessionID|RemoteIP

**Example Usage:** SecHashKey "this_is_my_key" KeyOnly

**Supported:** TBI

Coraza hash engine will append, if specified, the user's session id or remote ip to the key before the MAC operation. If the first parameter is "rand" then a random key will be generated and used by the engine.


## SecHashParam
**Description:** Define the parameter name that will receive the MAC hash.

**Syntax:** SecHashParam TEXT

**Example Usage:** SecHashParam "hmac"

**Supported:** TBI

Coraza hash engine will add a new parameter to protected HTML elements containing the MAC hash.


## SecHashMethodRx
**Description:** Configures what kind of HTML data the hash engine should sign based on regular expression.

**Syntax:** SecHashMethodRx TYPE REGEX

**Example Usage:** SecHashMethodRx HashHref "product_info|list_product"

**Supported:** TBI

As a initial support is possible to protect HREF, FRAME, IFRAME and FORM ACTION html elements as well response Location header when http redirect code are sent.

The possible values for TYPE are:

- **HashHref:** Used to sign href= html elements
- **HashFormAction:** Used to sign form action= html elements
- **HashIframeSrc:** Used to sign iframe src= html elements
- **HashframeSrc:** Used to sign frame src= html elements
- **HashLocation:** Used to sign Location response header

Note : This directive is used to sign the elements however user must use the @validateHash operator to enforce data integrity.

## SecHashMethodPm
**Description:** Configures what kind of HTML data the hash engine should sign based on string search algoritm.

**Syntax:** SecHashMethodPm TYPE "string1 string2 string3..."

**Example Usage:** SecHashMethodPm HashHref "product_info list_product"

**Supported:** TBI

As a initial support is possible to protect HREF, FRAME, IFRAME and FORM ACTION html elements as well response Location header when http redirect code are sent.

The possible values for TYPE are:

- **HashHref:** Used to sign href= html elements
- **HashFormAction:** Used to sign form action= html elements
- **HashIframeSrc:** Used to sign iframe src= html elements
- **HashframeSrc:** Used to sign frame src= html elements
- **HashLocation:** Used to sign Location response header

Note : This directive is used to sign the elements however user must use the @validateHash operator to enforce data integrity.

## SecGeoLookupDb
**Description:** Defines the path to the database that will be used for geolocation lookups.

**Syntax:** SecGeoLookupDb /path/to/db

**Example Usage:** SecGeoLookupDb /path/to/GeoLiteCity.mmdb

**Supported:** Yes

Coraza relies on the free geolocation databases (GeoLite City and GeoLite Country) that can be obtained from MaxMind http://www.maxmind.com. Only .mmdb format is supported.


## SecHttpBlKey
**Description:** Configures the user's registered Honeypot Project HTTP BL API Key to use with @rbl.

**Syntax:** SecHttpBlKey [12 char access key]

**Example Usage:** SecHttpBlKey whdkfieyhtnf

**Supported:** TBI

If the @rbl operator uses the dnsbl.httpbl.org RBL (http://www.projecthoneypot.org/httpbl_api.php) you must provide an API key. This key is registered to individual users and is included within the RBL DNS requests.


## SecInterceptOnError
**Description:** Configures how to respond when rule processing fails.

**Syntax:** SecInterceptOnError On|Off

**Example Usage:** SecInterceptOnError On

**Supported:** TBI

When an operator execution fails, that is it returns greater than 0, this directive configures how to react. When set to "Off", the rule is just ignored and the engine will continue executing the rules in phase. When set to "On", the rule will be just dropped and no more rules will be executed in the same phase, also no interception is made.


## SecMarker
**Description:** Adds a fixed rule marker that can be used as a target in a skipAfter action. A SecMarker directive essentially creates a rule that does nothing and whose only purpose is to carry the given ID.

**Syntax:** SecMarker ID|TEXT

**Example Usage:** SecMarker 9999

**Supported:** Yes

The value can be either a number or a text string. The SecMarker directive is available to allow you to choose the best way to implement a skip-over. Here is an example used from the Core Rule Set:

```
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" \
        "skipAfter:END_HOST_CHECK,phase:2,rev:'2.1.1',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21',tag:'OWASP_TOP_10/A7',tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score},setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score},setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}"
SecRule REQUEST_HEADERS:Host "^$" \
        "phase:2,rev:'2.1.1',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21',tag:'OWASP_TOP_10/A7',tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score},setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score},setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}"
SecMarker END_HOST_CHECK
```


## SecSensorId
**Description:** Define a sensor ID that will be present into log part H.

**Syntax:** SecSensorId TEXT

**Example Usage:** SecSensorId WAFSensor01

**Supported:** TBI


## SecRemoteRules

**Description:** Load rules from a given file hosted on a HTTPS site.

**Syntax:** SecRemoteRules [crypto] key https://url

**Example Usage:** SecRemoteRules some-key https://www.yourserver.com/plain-text-rules.txt

**Supported:** Yes

This is an optional directive that allow the user to load rules from a remote server. Notice that besides the URL the user also needs to supply a key, which could be used by the target server to provide different content for different keys.

Along with the key, supplied by the users, Coraza will also send its Unique ID and the `status call' in the format of headers to the target web server. The following headers are used:

 - Coraza-status
 - Coraza-unique-id
 - ModSec-key

The utilization of SecRemoteRules is only allowed over TLS.

**Note :** A valid and trusted digital certificate is expected on the end server. It is also expected that the server uses TLS, preferable TLS 1.2.

## SecRemoteRulesFailAction
**Description:** Action that will be taken if SecRemoteRules specify an URL that Coraza was not able to download.

**Syntax:** SecRemoteRulesFailAction Abort|Warn

**Example Usage:** SecRemoteRulesFailAction Abort

**Supported:** Yes

The default action is to Abort whenever there is a problem downloading a given URL.

**Note :** This directive also influences the behaviour of @ipMatchFromFile when used with a HTTPS URI to retrieve the remote file.

## SecRequestBodyAccess
**Description:** Configures whether request bodies will be buffered and processed by Coraza.

**Syntax:** SecRequestBodyAccess On|Off

**Example Usage:** SecRequestBodyAccess On

**Supported:** Yes

This directive is required if you want to inspect the data transported request bodies (e.g., POST parameters). Request buffering is also required in order to make reliable blocking possible. The possible values are:

- **On:** buffer request bodies
- **Off:** do not buffer request bodies

## SecRequestBodyInMemoryLimit
**Description:** Configures the maximum request body size that Coraza will store in memory.

**Syntax:** SecRequestBodyInMemoryLimit LIMIT_IN_BYTES

**Example Usage:** SecRequestBodyInMemoryLimit 131072

**Supported:** No

**Default:** 131072 (128 KB)

When a multipart/form-data request is being processed, once the in-memory limit is reached, the request body will start to be streamed into a temporary file on disk.

## SecRequestBodyLimit
**Description:** Configures the maximum request body size Coraza will accept for buffering.

**Syntax:** SecRequestBodyLimit LIMIT_IN_BYTES

**Example Usage:** SecRequestBodyLimit 134217728

**Supported:** Yes

**Default:** 134217728 (131072 KB)

Anything over the limit will be rejected with status code 413 (Request Entity Too Large). There is a hard limit of 1 GB.

## SecRequestBodyNoFilesLimit
**Description:** Configures the maximum request body size Coraza will accept for buffering, excluding the size of any files being transported in the request. This directive is useful to reduce susceptibility to DoS attacks when someone is sending request bodies of very large sizes. Web applications that require file uploads must configure SecRequestBodyLimit to a high value, but because large files are streamed to disk, file uploads will not increase memory consumption. However, it’s still possible for someone to take advantage of a large request body limit and send non-upload requests with large body sizes. This directive eliminates that loophole.

**Syntax:** SecRequestBodyNoFilesLimit NUMBER_IN_BYTES

**Example Usage:** SecRequestBodyNoFilesLimit 131072

**Supported:** No

**Default:** 1048576 (1 MB)

Generally speaking, the default value is not small enough. For most applications, you should be able to reduce it down to 128 KB or lower. Anything over the limit will be rejected with status code 413 (Request Entity Too Large). There is a hard limit of 1 GB.


## SecRequestBodyLimitAction
**Description:** Controls what happens once a request body limit, configured with SecRequestBodyLimit, is encountered

**Syntax:** SecRequestBodyLimitAction Reject|ProcessPartial

**Example Usage:** SecRequestBodyLimitAction ProcessPartial

**Supported:** Yes

By default, Coraza will reject a request body that is longer than specified. This is problematic especially when Coraza is being run in DetectionOnly mode and the intent is to be totally passive and not take any disruptive actions against the transaction. With the ability to choose what happens once a limit is reached, site administrators can choose to inspect only the first part of the request, the part that can fit into the desired limit, and let the rest through. This is not ideal from a possible evasion issue perspective, however it may be acceptable under certain circumstances.

Note : When the SecRuleEngine is set to DetectionOnly, SecRequestBodyLimitAction is automatically set to ProcessPartial in order to not cause any disruptions. If you want to know if/when a request body size is over your limit, you can create a rule to check for the existence of the INBOUND_ERROR_DATA variable.

## SecResponseBodyLimit
**Description:** Configures the maximum response body size that will be accepted for buffering.

**Syntax:** SecResponseBodyLimit LIMIT_IN_BYTES

**Example Usage:** SecResponseBodyLimit 524228

**Supported:** Yes

**Default:** 524288 (512 KB)

Anything over this limit will be rejected with status code 500 (Internal Server Error). This setting will not affect the responses with MIME types that are not selected for buffering. There is a hard limit of 1 GB.


## SecResponseBodyLimitAction
**Description:** Controls what happens once a response body limit, configured with SecResponseBodyLimit, is encountered.

**Syntax:** SecResponseBodyLimitAction Reject|ProcessPartial

**Example Usage:** SecResponseBodyLimitAction ProcessPartial

**Supported:** Yes

By default, Coraza will reject a response body that is longer than specified. Some web sites, however, will produce very long responses, making it difficult to come up with a reasonable limit. Such sites would have to raise the limit significantly to function properly, defying the purpose of having the limit in the first place (to control memory consumption). With the ability to choose what happens once a limit is reached, site administrators can choose to inspect only the first part of the response, the part that can fit into the desired limit, and let the rest through. Some could argue that allowing parts of responses to go uninspected is a weakness. This is true in theory, but applies only to cases in which the attacker controls the output (e.g., can make it arbitrary long). In such cases, however, it is not possible to prevent leakage anyway. The attacker could compress, obfuscate, or even encrypt data before it is sent back, and therefore bypass any monitoring device.


## SecResponseBodyMimeType
**Description:** Configures which MIME types are to be considered for response body buffering.

**Syntax:** SecResponseBodyMimeType MIMETYPE MIMETYPE ...

**Example Usage:** SecResponseBodyMimeType text/plain text/html text/xml

**Supported:** Yes

**Default:** text/plain text/html

Multiple SecResponseBodyMimeType directives can be used to add MIME types. Use SecResponseBodyMimeTypesClear to clear previously configured MIME types and start over.

## SecResponseBodyMimeTypesClear
**Description:** Clears the list of MIME types considered for response body buffering, allowing you to start populating the list from scratch.

**Syntax:** SecResponseBodyMimeTypesClear

**Example Usage:** SecResponseBodyMimeTypesClear

**Supported:** Yes


## SecResponseBodyAccess
**Description:** Configures whether response bodies are to be buffered.

**Syntax:** SecResponseBodyAccess On|Off

**Example Usage:** SecResponseBodyAccess On

**Supported:** Yes

**Default:** Off

This directive is required if you plan to inspect HTML responses and implement response blocking. Possible values are:

- **On:** buffer response bodies (but only if the response MIME type matches the list configured with SecResponseBodyMimeType).
- **Off:** do not buffer response bodies.

## SecRule
**Description:** Creates a rule that will analyze the selected variables using the selected operator.

**Syntax:** SecRule VARIABLES OPERATOR [ACTIONS]

**Example Usage:** SecRule ARGS "@rx attack" "phase:1,log,deny,id:1"

**Supported:** Yes

Every rule must provide one or more variables along with the operator that should be used to inspect them. If no actions are provided, the default list will be used. (There is always a default list, even if one was not explicitly set with SecDefaultAction.) If there are actions specified in a rule, they will be merged with the default list to form the final actions that will be used. (The actions in the rule will overwrite those in the default list.) Refer to SecDefaultAction for more information.

## SecRuleEngine
**Description:** Configures the rules engine.

**Syntax:** SecRuleEngine On|Off|DetectionOnly

**Example Usage:** SecRuleEngine On

**Supported:** Yes

**Default:** Off

The possible values are:

- **On:** process rules
- **Off:** do not process rules
- **DetectionOnly:** process rules but never executes any disruptive actions (block, deny, drop, allow, proxy and redirect)

## SecRulePerfTime
**Description:** Set a performance threshold for rules. Rules that spend at least the time defined will be logged into audit log Part H as Rules-Performance-Info in the format id=usec, comma separated.

**Syntax:** SecRulePerfTime USECS

**Example Usage:** SecRulePerfTime 1000

**Supported:** TBI

The rules hitting the threshold can be accessed via the collection PERF_RULES.

## SecRuleRemoveById
**Description:** Removes the matching rules from the current configuration context.

**Syntax:** SecRuleRemoveById ID ID RANGE ...

**Example Usage:** SecRuleRemoveByID 1 2 "9000-9010"

**Supported:** Partially, it supports one rule per directive.

This directive supports multiple parameters, each of which can be a rule ID or a range. Parameters that contain spaces must be delimited using double quotes.

Note : This directive must be specified after the rule in which it is disabling. This should be used within local custom rule files that are processed after third party rule sets. Example file - Coraza_crs_60_customrules.conf.

## SecRuleRemoveByMsg
**Description:** Removes the matching rules from the current configuration context.

**Syntax:** SecRuleRemoveByMsg REGEX

**Example Usage:** SecRuleRemoveByMsg "FAIL"

**Supported:** Yes

Normally, you would use SecRuleRemoveById to remove rules, but that requires the rules to have IDs defined. If they don’t, then you can remove them with SecRuleRemoveByMsg, which matches a regular expression against rule messages.

Note : This directive must be specified after the rule in which it is disabling. This should be used within local custom rule files that are processed after third party rule sets.

## SecRuleRemoveByTag
**Description:** Removes the matching rules from the current configuration context.

**Syntax:** SecRuleRemoveByTag REGEX

**Example Usage:** SecRuleRemoveByTag "WEB_ATTACK/XSS"

**Supported:** Yes

Normally, you would use SecRuleRemoveById to remove rules, but that requires the rules to have IDs defined. If they don’t, then you can remove them with SecRuleRemoveByTag, which matches a regular expression against rule tag data. This is useful if you want to disable entire groups of rules based on tag data. Example tags used in the OWASP Coraza CRS include:

- AUTOMATION/MALICIOUS
- AUTOMATION/MISC
- AUTOMATION/SECURITY_SCANNER
- LEAKAGE/SOURCE_CODE_ASP_JSP
- LEAKAGE/SOURCE_CODE_CF
- LEAKAGE/SOURCE_CODE_PHP
- WEB_ATTACK/CF_INJECTION
- WEB_ATTACK/COMMAND_INJECTION
- WEB_ATTACK/FILE_INJECTION
- WEB_ATTACK/HTTP_RESPONSE_SPLITTING
- WEB_ATTACK/LDAP_INJECTION
- WEB_ATTACK/PHP_INJECTION
- WEB_ATTACK/REQUEST_SMUGGLING
- WEB_ATTACK/SESSION_FIXATION
- WEB_ATTACK/SQL_INJECTION
- WEB_ATTACK/SSI_INJECTION
- WEB_ATTACK/XSS

Note : This directive must be specified after the rule in which it is disabling. This should be used within local custom rule files that are processed after third party rule sets. Example file - Coraza_crs_60_customrules.conf.

## SecRuleUpdateActionById
**Description:** Updates the action list of the specified rule.

**Syntax:** SecRuleUpdateActionById RULEID[:offset] ACTIONLIST

**Example Usage:** SecRuleUpdateActionById 12345 "deny,status:403"

**Supported:** TBI but it's supported by CTL

This directive will overwrite the action list of the specified rule with the actions provided in the second parameter. It has two limitations: it cannot be used to change the ID or phase of a rule. Only the actions that can appear only once are overwritten. The actions that are allowed to appear multiple times in a list, will be appended to the end of the list.


```
SecRule ARGS attack "phase:2,id:12345,t:lowercase,log,pass,msg:'Message text'"
SecRuleUpdateActionById 12345 "t:none,t:compressWhitespace,deny,status:403,msg:'New message text'"
```

The effective resulting rule in the previous example will be as follows:

```
SecRule ARGS attack "phase:2,id:12345,t:lowercase,t:none,t:compressWhitespace,deny,status:403,msg:'New Message text'"
```

The addition of t:none will neutralize any previous transformation functions specified (t:lowercase, in the example).

**Note :** If the target rule is a chained rule, you must currently specify chain in the SecRuleUpdateActionById action list as well. This will be fixed in a future version.

## SecRuleUpdateTargetById
**Description:** Updates the target (variable) list of the specified rule.

**Syntax:** SecRuleUpdateTargetById RULEID TARGET1[,TARGET2,TARGET3] REPLACED_TARGET

**Example Usage:** SecRuleUpdateTargetById 12345 "!ARGS:foo"

**Supported:** TBI but it's supported by CTL

This directive will append (or replace) variables to the current target list of the specified rule with the targets provided in the second parameter.

Explicitly Appending Targets

This is useful for implementing exceptions where you want to externally update a target list to exclude inspection of specific variable(s).


```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"
```

SecRuleUpdateTargetById 958895 !ARGS:email
The effective resulting rule in the previous example will append the target to the end of the variable list as follows:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/*|!ARGS:email "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"
```

Note that is is also possible to use regular expressions in the target specification:

```
SecRuleUpdateTargetById 981172 "!REQUEST_COOKIES:/^appl1_.*/"
````

**Explicitly Replacing Targets**

You can also entirely replace the target list to something more appropriate for your environment. For example, lets say you want to inspect REQUEST_URI instead of REQUEST_FILENAME, you could do this:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"

SecRuleUpdateTargetById 958895 REQUEST_URI REQUEST_FILENAME
````

The effective resulting rule in the previous example replaces the target in the begin of the variable list as follows:

```
SecRule REQUEST_URI|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"
````

Note : You could also do the same by using the ctl action with the ruleRemoveById directive. That would be useful if you want to only update the targets for a particular URL, thus conditionally appending targets.

## SecRuleUpdateTargetByMsg
**Description:** Updates the target (variable) list of the specified rule by rule message.

**Syntax:** SecRuleUpdateTargetByMsg TEXT TARGET1[,TARGET2,TARGET3] REPLACED_TARGET

**Example Usage:** SecRuleUpdateTargetByMsg "Cross-site Scripting (XSS) Attack" "!ARGS:foo"

**Supported:** TBI

This directive will append (or replace) variables to the current target list of the specified rule with the targets provided in the second parameter.

Explicitly Appending Targets

This is useful for implementing exceptions where you want to externally update a target list to exclude inspection of specific variable(s).

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"

SecRuleUpdateTargetByMsg "System Command Injection" !ARGS:email
```

The effective resulting rule in the previous example will append the target to the end of the variable list as follows:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/*|!ARGS:email "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"
```

Explicitly Replacing Targets
You can also entirely replace the target list to something more appropriate for your environment. For example, lets say you want to inspect REQUEST_URI instead of REQUEST_FILENAME, you could do this:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"

SecRuleUpdateTargetByMsg "System Command Injection" REQUEST_URI REQUEST_FILENAME
```

The effective resulting rule in the previous example will append the target to the end of the variable list as follows:

```
SecRule REQUEST_URI|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"
```

## SecRuleUpdateTargetByTag
**Description:** Updates the target (variable) list of the specified rule by rule tag.

**Syntax:** SecRuleUpdateTargetByTag TEXT TARGET1[,TARGET2,TARGET3] REPLACED_TARGET

**Example Usage:** SecRuleUpdateTargetByTag "WEB_ATTACK/XSS" "!ARGS:foo"

**Supported:** TBI

This directive will append (or replace) variables to the current target list of the specified rule with the targets provided in the second parameter.

Explicitly Appending Targets

This is useful for implementing exceptions where you want to externally update a target list to exclude inspection of specific variable(s).

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"

SecRuleUpdateTargetByTag "WASCTC/WASC-31" !ARGS:email
```

The effective resulting rule in the previous example will append the target to the end of the variable list as follows:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/*|!ARGS:email "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"
```

Explicitly Replacing Targets

You can also entirely replace the target list to something more appropriate for your environment. For example, lets say you want to inspect REQUEST_URI instead of REQUEST_FILENAME, you could do this:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}"

SecRuleUpdateTargetByTag "WASCTC/WASC-31" REQUEST_URI REQUEST_FILENAME
```

The effective resulting rule in the previous example will append the target to the end of the variable list as follows:

```
SecRule REQUEST_URI|ARGS_NAMES|ARGS|XML:/* "[\;\|\`]\W*?\bmail\b" \
     "phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}""
```


## SecUnicodeMap
**Description:** Defines which Unicode code point will be used by the urlDecodeUni transformation function during normalization.

**Syntax:** SecUnicodeMap CODEPOINT

**Example Usage:** SecUnicodeMapFile 20127

**Supported:** Yes


## SecUploadDir
**Description:** Configures the directory where intercepted files will be stored.

**Syntax:** SecUploadDir /path/to/dir

**Example Usage:** SecUploadDir /tmp

**Supported:** Yes

This directory must be on the same filesystem as the temporary directory defined with SecTmpDir. This directive is used with SecUploadKeepFiles.


## SecUploadFileLimit
**Description:** Configures the maximum number of file uploads processed in a multipart POST.

**Syntax:** SecUploadFileLimit number

**Example Usage:** SecUploadFileLimit 10

**Supported:** Yes

The default is set to 100 files, but you are encouraged to reduce this value. Any file over the limit will not be extracted and the MULTIPART_FILE_LIMIT_EXCEEDED and MULTIPART_STRICT_ERROR flags will be set. To prevent bypassing any file checks, you must check for one of these flags.

Note : If the limit is exceeded, the part name and file name will still be recorded in FILES_NAME and FILES, the file size will be recorded in FILES_SIZES, but there will be no record in FILES_TMPNAMES as a temporary file was not created.

## SecUploadFileMode
**Description:** Configures the mode (permissions) of any uploaded files using an octal mode (as used in chmod).

**Syntax:** SecUploadFileMode octal_mode|"default"

**Example Usage:** SecUploadFileMode 0640

**Supported:** Yes

This feature is not available on operating systems not supporting octal file modes. The default mode (0600) only grants read/write access to the account writing the file. If access from another account is needed (using clamd is a good example), then this directive may be required. However, use this directive with caution to avoid exposing potentially sensitive data to unauthorized users. Using the value "default" will revert back to the default setting.

Note : The process umask may still limit the mode if it is being more restrictive than the mode set using this directive.

## SecUploadKeepFiles
**Description:** Configures whether or not the intercepted files will be kept after transaction is processed.

**Syntax:** SecUploadKeepFiles On|Off|RelevantOnly

**Example Usage:** SecUploadKeepFiles On

**Supported:** TBI

This directive requires the storage directory to be defined (using SecUploadDir).

Possible values are:

- **On** - Keep uploaded files.
- **Off** - Do not keep uploaded files.
- **RelevantOnly** - This will keep only those files that belong to requests that are deemed relevant. **(Not implemented)**

## SecWebAppId
**Description:** Creates an application namespace, allowing for separate persistent session and user storage.

**Syntax:** SecWebAppId "NAME"

**Example Usage:** SecWebAppId "WebApp1"

**Supported:** Yes

**Default:** default

Application namespaces are used to avoid collisions between session IDs and user IDs when multiple applications are deployed on the same server. If it isn’t used, a collision between session IDs might occur.