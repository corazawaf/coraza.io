---
title: "Actions"
description: "Actions available in Coraza"
lead: "The action of a rule defines how to handle HTTP requests that have matched one or more rule conditions."
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

Actions are defined as part of a `SecRule` or as parameter for `SecAction` or `SecDefaultAction`. A rule can have no or serveral actions which need to be separated by a comma.

Actions can be categorized by how they affect overall processing:

* **Disruptive actions** - Cause Coraza to do something. In many cases something means block transaction, but not in all. For example, the allow action is classified as a disruptive action, but it does the opposite of blocking. There can only be one disruptive action per rule (if there are multiple disruptive actions present, or inherited, only the last one will take effect), or rule chain (in a chain, a disruptive action can only appear in the first rule).
{{< alert icon="👉" >}}
Disruptive actions will NOT be executed if the `SecRuleEngine` is set to `DetectionOnly`. If you are creating exception/allowlisting rules that use the allow action, you should also add the `ctl:ruleEngine=On` action to execute the action.
{{< /alert >}}
* **Non-disruptive actions** - Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.
* **Flow actions** - These actions affect the rule flow (for example skip or skipAfter).
* **Meta-data actions** - used to provide more information about rules. Examples include id, rev, severity and msg.
* **Data actions** - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).

## accuracy

**Description**: Specifies the relative accuracy level of the rule related to false positives/negatives. The value is a string based on a numeric scale (1-9 where 9 is very strong and 1 has many false positives).

**Action Group:** Meta-data

**Example:**

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "\bgetparentfolder\b" \
    "id:'958016',phase:2,ver:'CRS/2.2.4,accuracy:'9',maturity:'9',capture,\
    t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,\
    ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',\
    tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',\
    tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'%{TX.0}',\
    severity:'2',setvar:'tx.msg=%{rule.msg}',\
    setvar:tx.xss_score=+%{tx.critical_anomaly_score},\
    setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},\
    setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}"
```

## allow

**Description**: Stops rule processing on a successful match and allows the transaction to proceed.

**Action Group:** Disruptive

**Example:**

```
# Allow unrestricted access from 192.168.1.100
SecRule REMOTE_ADDR "^192\.168\.1\.100$" phase:1,id:95,nolog,allow
```

Prior to Coraza 2.5 the allow action would only affect the current phase. An allow in phase 1 would skip processing the remaining rules in phase 1 but the rules from phase 2 would execute. Starting with v2.5.0 allow was enhanced to allow for fine-grained control of what is done. The following rules now apply:

If used on its own, like in the example above, allow will affect the entire transaction, stopping processing of the current phase, but also skipping over all other phases apart from the logging phase. (The logging phase is special; it is designed to always execute.)
If used with parameter "phase", allow will cause the engine to stop processing the current phase. Other phases will continue as normal.
If used with parameter "request", allow will cause the engine to stop processing the current phase. The next phase to be processed will be phase RESPONSE_HEADERS.
Examples:

```
# Do not process request but process response.
SecAction phase:1,allow:request,id:96

# Do not process transaction (request and response).
SecAction phase:1,allow,id:97
If you want to allow a response through, put a rule in phase RESPONSE_HEADERS and simply use allow on its own:

# Allow response through.
SecAction phase:3,allow,id:98
```

## append

**Description**: Appends text given as parameter to the end of response body. Content injection must be enabled (using the SecContentInjection directive). No content type checks are made, which means that before using any of the content injection actions, you must check whether the content type of the response is adequate for injection.

**Action Group:** Non-disruptive

**Processing Phases:** 3 and 4.

**Example:**

```
SecRule RESPONSE_CONTENT_TYPE "^text/html" "nolog,id:99,pass,append:'<hr>Footer'"
```

Warning : Although macro expansion is allowed in the additional content, you are strongly cautioned against inserting user-defined data fields into output. Doing so would create a cross-site scripting vulnerability.

## auditlog

**Description**: Marks the transaction for logging in the audit log.

**Action Group:** Non-disruptive

**Example:**

```
SecRule REMOTE_ADDR "^192\.168\.1\.100$" "auditlog,phase:1,id:100,allow"
```

Note : The auditlog action is now explicit if log is already specified.

## block

**Description**: Performs the disruptive action defined by the previous `SecDefaultAction`.

**Action Group:** Disruptive

This action is essentially a placeholder that is intended to be used by rule writers to request a blocking action, but without specifying how the blocking is to be done. The idea is that such decisions are best left to rule users, as well as to allow users, to override blocking if they so desire. In future versions of Coraza, more control and functionality will be added to define "how" to block.

**Examples:**

```
# Specify how blocking is to be done
SecDefaultAction "phase:2,deny,id:101,status:403,log,auditlog"

# Detect attacks where we want to block
SecRule ARGS "@rx attack1" "phase:2,block,id:102"

# Detect attacks where we want only to warn
SecRule ARGS "@rx attack2" "phase:2,pass,id:103"
```

It is possible to use the `SecRuleUpdateActionById` directive to override how a rule handles blocking. This is useful in three cases:

1. If a rule has blocking hard-coded, and you want it to use the policy you determine
2. If a rule was written to `block`, but you want it to only warn
3. If a rule was written to only `warn`, but you want it to block

The following example demonstrates the first case, in which the hard-coded block is removed in favor of the user-controllable block:

```
# Specify how blocking is to be done
SecDefaultAction "phase:2,deny,status:403,log,auditlog,id:104"

# Detect attacks and block
SecRule ARGS "@rx attack1" "phase:2,id:1,deny"

# Change how rule ID 1 blocks
SecRuleUpdateActionById 1 "block"
```

## capture

**Description**: When used together with the regular expression operator `@rx`, the capture action creates a copy of the regular expression captures and places them into the transaction variable collection.

**Action Group:** Non-disruptive

**Example:**

```
SecRule REQUEST_BODY "^username=(\w{25,})" phase:2,capture,t:none,chain,id:105
  SecRule TX:1 "(?:(?:a(dmin|nonymous)))"
```

Up to 10 captures will be copied on a successful pattern match, each with a name consisting of a digit from 0 to 9. The `TX.0` variable always contains the entire area that the regular expression matched. All the other variables contain the captured values, in the order in which the capturing parentheses appear in the regular expression.

**This action is being forced by now, it might be reused in the future)

## chain

**Description**: Chains the current rule with the rule that immediately follows it, creating a rule chain. Chained rules allow for more complex processing logic.

**Action Group:** Flow

**Example:**

```bash
# Refuse to accept POST requests that do not contain a Content-Length header.
#
# Note: this rule should be preceded by a rule that verifies only valid
# request methods are used.
SecRule REQUEST_METHOD "^POST$" "phase:1,chain,t:none,id:105"
  SecRule &REQUEST_HEADERS:Content-Length "@eq 0" "t:none"
```

Note : Rule chains allow you to simulate logical AND. The disruptive actions specified in the first portion of the chained rule will be triggered only if all of the variable checks return positive hits. If any one aspect of a chained rule comes back negative, then the entire rule chain will fail to match. Also note that disruptive actions, execution phases, metadata actions (id, rev, msg, tag, severity, logdata), skip, and skipAfter actions can be specified only by the chain starter rule.
The following directives can be used in rule chains:

* `SecAction`
* `SecRule`
* `SecRuleScript`

Special rules control the usage of actions in chained rules:

* Any actions that affect the rule flow (i.e., the disruptive actions, `skip` and `skipAfter`) can be used only in the chain starter. They will be executed only if the entire chain matches.
* Non-disruptive rules can be used in any rule; they will be executed if the rule that contains them matches and not only when the entire chain matches.
* The metadata actions (e.g., `id`, `rev`, `msg`) can be used only in the chain starter.

## ctl

**Description**: Changes Coraza configuration on transient, per-transaction basis. Any changes made using this action will affect only the transaction in which the action is executed. The default configuration, as well as the other transactions running in parallel, will be unaffected.

**Action Group:** Non-disruptive

**Example:**

```
# Parse requests with Content-Type "text/xml" as XML
SecRule REQUEST_CONTENT_TYPE ^text/xml "nolog,pass,id:106,ctl:requestBodyProcessor=XML"

# white-list the user parameter for rule #981260 when the REQUEST_URI is /index.php
SecRule REQUEST_URI "@beginsWith /index.php" "phase:1,t:none,pass,\
  nolog,ctl:ruleRemoveTargetById=981260;ARGS:user"
```

The following configuration options are supported:

* `auditEngine`
* `auditLogParts`
* `debugLogLevel`
* `forceRequestBodyVariable`
* `requestBodyAccess`
* `requestBodyLimit`
* `requestBodyProcessor`
* `responseBodyAccess`
* `responseBodyLimit`
* `ruleEngine`
* `ruleRemoveById` - since this action us triggered at run time, it should be specified before the rule in which it is disabling.
* `ruleRemoveByMsg`
* `ruleRemoveByTag`
* `ruleRemoveTargetById` - since this action is used to just remove targets, users don't need to use the char ! before the target list.
* `ruleRemoveTargetByMsg` - since this action is used to just remove targets, users don't need to use the char ! before the target list.
* `ruleRemoveTargetByTag` - since this action is used to just remove targets, users don't need to use the char ! before the target list.
* `hashEngine` (**Supported on Coraza:** TBI)
* `hashEnforcement` (**Supported on Coraza:** TBI)

With the exception of the `requestBodyProcessor` and `forceRequestBodyVariable` settings, each configuration option corresponds to one configuration directive and the usage is identical.

The `requestBodyProcessor` option allows you to configure the request body processor. By default, Coraza will use the `URLENCODED` and `MULTIPART` processors to process an `application/x-www-form-urlencoded` and a `multipart/form-data` body, respectively. Other two processors are also supported: `JSON` and `XML`, but they are never used implicitly. Instead, you must tell Coraza to use it by placing a few rules in the `REQUEST_HEADERS` processing phase. After the request body is processed as XML, you will be able to use the XML-related features to inspect it.

Request body processors will not interrupt a transaction if an error occurs during parsing. Instead, they will set the variables `REQBODY_PROCESSOR_ERROR` and `REQBODY_PROCESSOR_ERROR_MSG`. These variables should be inspected in the `REQUEST_BODY` phase and an appropriate action taken. The forceRequestBodyVariable option allows you to configure the `REQUEST_BODY` variable to be set when there is no request body processor configured. This allows for inspection of request bodies of unknown types.

## deny

**Description**: Stops rule processing and intercepts transaction.

**Action Group:** Disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "nikto" "log,deny,id:107,msg:'Nikto Scanners Identified'"
```

## drop

**Description**: Initiates an immediate close of the TCP connection by sending a FIN packet.

**Action Group:** Disruptive

**Example:** The following example initiates an IP collection for tracking Basic Authentication attempts. If the client goes over the threshold of more than 25 attempts in 2 minutes, it will `DROP` subsequent connections.

```
SecAction phase:1,id:109,initcol:ip=%{REMOTE_ADDR},nolog
SecRule ARGS:login "!^$" "nolog,phase:1,id:110,setvar:ip.auth_attempt=+1,deprecatevar:ip.auth_attempt=25/120"
SecRule IP:AUTH_ATTEMPT "@gt 25" "log,drop,phase:1,id:111,msg:'Possible Brute Force Attack'"
```

**Note :** This action depends on each implementation, the server is instructed to drop the connection.

This action is extremely useful when responding to both Brute Force and Denial of Service attacks in that, in both cases, you want to minimize both the network bandwidth and the data returned to the client. This action causes error message to appear in the log "(9)Bad file descriptor: core_output_filter: writing data to the network"

## exec

**Description**: Executes an external script/binary supplied as parameter.

**Action Group:** Non-disruptive

**Example:**

```
# Run external program on rule match
SecRule REQUEST_URI "^/cgi-bin/script\.pl" "phase:2,id:112,t:none,t:lowercase,t:normalizePath,block,\ exec:/usr/local/apache/bin/test.sh"

# Run Lua script on rule match
SecRule ARGS:p attack "phase:2,id:113,block,exec:/usr/local/apache/conf/exec.lua"
```

The `exec` action is executed independently from any disruptive actions specified. External scripts will always be called with no parameters. Some transaction information will be placed in environment variables. All the usual CGI environment variables will be there. You should be aware that forking a threaded process results in all threads being replicated in the new process. Forking can therefore incur larger overhead in a multithreaded deployment. The script you execute must write something (anything) to stdout; if it doesn’t, Coraza will assume that the script failed, and will record the failure.

## expirevar

**Description**: Configures a collection variable to expire after the given time period (in seconds).

**Supported on Coraza:** TBI

**Action Group:** Non-disruptive

**Example:**

```
SecRule REQUEST_COOKIES:JSESSIONID "!^$" "nolog,phase:1,id:114,pass,setsid:%{REQUEST_COOKIES:JSESSIONID}"
SecRule REQUEST_URI "^/cgi-bin/script\.pl" "phase:2,id:115,t:none,t:lowercase,t:normalizePath,log,allow,\
    setvar:session.suspicious=1,expirevar:session.suspicious=3600,phase:1"
```

You should use the expirevar actions at the same time that you use setvar actions in order to keep the intended expiration time. If they are used on their own (perhaps in a SecAction directive), the expire time will be reset.

## id

**Description**: Assigns a unique ID to the rule or chain in which it appears. This action is mandatory and must be numeric.

**Action Group:** Meta-data

**Example:**

```
SecRule &REQUEST_HEADERS:Host "@eq 0" "log,id:60008,severity:2,msg:'Request Missing a Host Header'"
```

Note : The id action is required for all SecRule/SecAction.

## initcol

**Description**: Initializes a named persistent collection, either by loading data from storage or by creating a new collection in memory.

**Action Group:** Non-disruptive

**Supported on Coraza:** TBI

**Example:** The following example initiates IP address tracking, which is best done in phase 1:

```
SecAction "phase:1,id:116,nolog,pass,initcol:ip=%{REMOTE_ADDR}"
```

Collections are loaded into memory on-demand, when the initcol action is executed. A collection will be persisted only if a change was made to it in the course of transaction processing.

See the "Persistent Storage" section for further details.

## log

**Description**: Indicates that a successful match of the rule needs to be logged.

**Action Group:** Non-disruptive

**Example:**

```
SecAction "phase:1,id:117,pass,initcol:ip=%{REMOTE_ADDR},log"
```

This action will log matches to the Apache error log file and the Coraza audit log.

## logdata

**Description**: Logs a data fragment as part of the alert message.

**Action Group:** Non-disruptive

**Example:**

```
SecRule ARGS:p "@rx <script>" "phase:2,id:118,log,pass,logdata:%{MATCHED_VAR}"
```

The logdata information appears in the error and/or audit log files. Macro expansion is performed, so you may use variable names such as %{TX.0} or %{MATCHED_VAR}. The information is properly escaped for use with logging of binary data.

## maturity

**Description**: Specifies the relative maturity level of the rule related to the length of time a rule has been public and the amount of testing it has received. The value is a string based on a numeric scale (1-9 where 9 is extensively tested and 1 is a brand new experimental rule).

**Action Group:** Meta-data

**Example:**

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "\bgetparentfolder\b" \
    "phase:2,ver:'CRS/2.2.4,accuracy:'9',maturity:'9',capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}"
```

## msg

**Description**: Assigns a custom message to the rule or chain in which it appears. The message will be logged along with every alert.

**Action Group:** Meta-data

**Example:**

```
SecRule &REQUEST_HEADERS:Host "@eq 0" "log,id:60008,severity:2,msg:'Request Missing a Host Header'"
```

Note : The msg information appears in the error and/or audit log files and is not sent back to the client in response headers.

## multiMatch

**Description**: If enabled, Coraza will perform multiple operator invocations for every target, before and after every anti-evasion transformation is performed.

**Action Group:** Non-disruptive

**Example:**

```
SecRule ARGS "attack" "phase1,log,deny,id:119,t:removeNulls,t:lowercase,multiMatch"
```

Normally, variables are inspected only once per rule, and only after all transformation functions have been completed. With multiMatch, variables are checked against the operator before and after every transformation function that changes the input.

## noauditlog

**Description**: Indicates that a successful match of the rule should not be used as criteria to determine whether the transaction should be logged to the audit log.

**Action Group:** Non-disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "@streq Test" "allow,noauditlog,id:120"
```

If the SecAuditEngine is set to On, all of the transactions will be logged. If it is set to RelevantOnly, then you can control the logging with the noauditlog action.

The noauditlog action affects only the current rule. If you prevent audit logging in one rule only, a match in another rule will still cause audit logging to take place. If you want to prevent audit logging from taking place, regardless of whether any rule matches, use ctl:auditEngine=Off.

## nolog

**Description**: Prevents rule matches from appearing in both the error and audit logs.

**Action Group:** Non-disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "@streq Test" "allow,nolog,id:121"
```

Although nolog implies noauditlog, you can override the former by using nolog,auditlog.

## pass

**Description**: Continues processing with the next rule in spite of a successful match.

**Action Group:** Disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "@streq Test" "log,pass,id:122"
```

When using pass with a SecRule with multiple targets, all variables will be inspected and all non-disruptive actions trigger for every match. In the following example, the TX.test variable will be incremented once for every request parameter:

```
# Set TX.test to zero
SecAction "phase:2,nolog,pass,setvar:TX.test=0,id:123"

# Increment TX.test for every request parameter
SecRule ARGS "test" "phase:2,log,pass,setvar:TX.test=+1,id:124"
```

## pause

**Description**: Pauses transaction processing for the specified number of milliseconds. This feature also supports macro expansion.

**Action Group:** Disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "Test" "log,pause:5000,id:125"
```

Warning : This feature can be of limited benefit for slowing down brute force authentication attacks, but use with care. If you are under a denial of service attack, the pause feature may make matters worse, as it will cause an entire Apache worker (process or thread, depending on the deployment mode) to sit idle until the pause is completed.

## phase

**Description**: Places the rule or chain into one of five available processing phases. It can also be used in `SecDefaultAction` to establish the rule defaults.

**Action Group:** Meta-data

**Example:**

```
# Initialize IP address tracking in phase 1
SecAction phase:1,nolog,pass,id:126,initcol:IP=%{REMOTE_ADDR}
```

There are aliases for some phase numbers:

* 2 - request
* 4 - response
* 5 - logging

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "Test" "phase:request,log,deny,id:127"
```

Warning : Keep in mind that if you specify the incorrect phase, the variable used in the rule may not yet be available. This could lead to a false negative situation where your variable and operator may be correct, but it misses malicious data because you specified the wrong phase.

## prepend

**Description**: Prepends the text given as parameter to response body. Content injection must be enabled (using the SecContentInjection directive). No content type checks are made, which means that before using any of the content injection actions, you must check whether the content type of the response is adequate for injection.

**Action Group:** Non-disruptive

**Processing Phases:** 3 and 4.

**Example:**

```
SecRule RESPONSE_CONTENT_TYPE "^text/html" "phase:3,nolog,pass,id:128,prepend:'Header<br>'"
```

Warning : Although macro expansion is allowed in the injected content, you are strongly cautioned against inserting user defined data fields int output. Doing so would create a cross-site scripting vulnerability.

## proxy

**Description**: Intercepts the current transaction by forwarding the request to another web server using the proxy backend. The forwarding is carried out transparently to the HTTP client (i.e., there’s no external redirection taking place).

**Action Group:** Disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "@streq Test" "log,id:129,proxy:http://honeypothost/"
SecRule REQUEST_URI "@streq /test.txt" "phase:1,proxy:'http://$ENV{SERVER_NAME}:$ENV{SERVER_PORT}/test.txt',id:500005"
```

For this action to work, the implementation must handle the proxy connection after the interruption notification.

## redirect

**Description**: Intercepts transaction by issuing an external (client-visible) redirection to the given location..

**Action Group:** Disruptive

**Example:**

```
SecRule REQUEST_HEADERS:User-Agent "@streq Test" "phase:1,id:130,log,redirect:http://www.example.com/failed.html"
```

If the status action is present on the same rule, and its value can be used for a redirection (i.e., is one of the following: 301, 302, 303, or 307), the value will be used for the redirection status code. Otherwise, status code 302 will be used.

## rev

**Description**: Specifies rule revision. It is useful in combination with the id action to provide an indication that a rule has been changed.

**Action Group:** Meta-data

**Example:**

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "(?:(?:[\;\|\`]\W*?\bcc|\b(wget|curl))\b|\/cc(?:[\'\"\|\;\`\-\s]|$))" \
    "phase:2,rev:'2.1.3',capture,t:none,t:normalizePath,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'950907',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%{tx.0},skipAfter:END_COMMAND_INJECTION1"
```

Note : This action is used in combination with the id action to allow the same rule ID to be used after changes take place but to still provide some indication the rule changed.

## sanitiseArg

**Description**: Prevents sensitive request parameter data from being logged to audit log. Each byte of the named parameter(s) is replaced with an asterisk.

**Supported on Coraza:** TBI

**Action Group:** Non-disruptive

**Example:**

```
# Never log passwords
SecAction "nolog,phase:2,id:131,sanitiseArg:password,sanitiseArg:newPassword,sanitiseArg:oldPassword"
```

Note : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.

## sanitiseMatched

**Description**: Prevents the matched variable (request argument, request header, or response header) from being logged to audit log. Each byte of the named parameter(s) is replaced with an asterisk.

**Supported on Coraza:** TBI

**Action Group:** Non-disruptive

**Example:** This action can be used to sanitise arbitrary transaction elements when they match a condition. For example, the example below will sanitise any argument that contains the word password in the name.

```
SecRule ARGS_NAMES password nolog,pass,id:132,sanitiseMatched
```

Note : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.

## sanitiseMatchedBytes

**Description**: Prevents the matched string in a variable from being logged to audit log. Each or a range of bytes of the named parameter(s) is replaced with an asterisk.

**Supported on Coraza:** TBI

**Action Group:** Non-disruptive

**Example:** This action can be used to sanitise arbitrary transaction elements when they match a condition. For example, the example below will sanitise the credit card number.

* `sanitiseMatchedBytes` -- This would x out only the bytes that matched.
* `sanitiseMatchedBytes`:1/4 -- This would x out the bytes that matched, but keep the first byte and last 4 bytes

```
# Detect credit card numbers in parameters and
# prevent them from being logged to audit log
SecRule ARGS "@verifyCC \d{13,16}" "phase:2,id:133,nolog,capture,pass,msg:'Potential credit card number in request',sanitiseMatchedBytes"
SecRule RESPONSE_BODY "@verifyCC \d{13,16}" "phase:4,id:134,t:none,log,capture,block,msg:'Potential credit card number is response body',sanitiseMatchedBytes:0/4"
```

Note : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI. You must use capture action with sanitiseMatchedBytes, so the operator must support capture action. ie: @rx, @verifyCC.

## sanitiseRequestHeader

**Description**: Prevents a named request header from being logged to audit log. Each byte of the named request header is replaced with an asterisk.

**Supported on Coraza:** TBI

**Action Group:** Non-disruptive

**Example:** This will sanitise the data in the Authorization header.

```
SecAction "phase:1,nolog,pass,id:135,sanitiseRequestHeader:Authorization"
```

Note : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.

## sanitiseResponseHeader

**Description**: Prevents a named response header from being logged to audit log. Each byte of the named response header is replaced with an asterisk.

**Supported on Coraza:** TBI

**Action Group:** Non-disruptive

**Example:** This will sanitise the Set-Cookie data sent to the client.

```
SecAction "phase:3,nolog,pass,id:136,sanitiseResponseHeader:Set-Cookie"
```

Note : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.

## severity

**Description**: Assigns severity to the rule in which it is used.

**Action Group:** Meta-data

**Example:**

```
SecRule REQUEST_METHOD "^PUT$" "id:340002,rev:1,severity:CRITICAL,msg:'Restricted HTTP function'"
```

Severity values in Coraza follows the numeric scale of syslog (where 0 is the most severe). The data below is used by the OWASP Core Rule Set (CRS):

* **0 - EMERGENCY**: is generated from correlation of anomaly scoring data where there is an inbound attack and an outbound leakage.
* **1 - ALERT**: is generated from correlation where there is an inbound attack and an outbound application level error.
* **2 CRITICAL**: Anomaly Score of 5. Is the highest severity level possible without correlation. It is normally generated by the web attack rules (40 level files).
* **3 - ERROR**: Error - Anomaly Score of 4. Is generated mostly from outbound leakage rules (50 level files).
* **4 - WARNING**: Anomaly Score of 3. Is generated by malicious client rules (35 level files).
* **5 - NOTICE**: Anomaly Score of 2. Is generated by the Protocol policy and anomaly files.
* **6 - INFO**
* **7 - DEBUG**

It is possible to specify severity levels using either the numerical values or the text values, but you should always specify severity levels using the text values, because it is difficult to remember what a number stands for. The use of the numerical values is deprecated as of version 2.5.0 and may be removed in one of the subsequent major updates.

## setuid

**Description**: Special-purpose action that initializes the USER collection using the username provided as parameter.

**Action Group:** Non-disruptive

**Supported on Coraza:** TBI

**Example:**

```
SecRule ARGS:username ".*" "phase:2,id:137,t:none,pass,nolog,noauditlog,capture,setvar:session.username=%{TX.0},setuid:%{TX.0}"
```

After initialization takes place, the variable USERID will be available for use in the subsequent rules. This action understands application namespaces (configured using SecWebAppId), and will use one if it is configured.

## setrsc

**Description**: Special-purpose action that initializes the RESOURCE collection using a key provided as parameter.

**Action Group:** Non-disruptive

**Supported on Coraza:** TBI

**Example:**

```
SecAction "phase:1,pass,id:3,log,setrsc:'abcd1234'"
```

This action understands application namespaces (configured using SecWebAppId), and will use one if it is configured.

## setsid

**Description**: Special-purpose action that initializes the SESSION collection using the session token provided as parameter.

**Action Group:** Non-disruptive

**Supported on Coraza:** TBI

**Example:**

```
# Initialise session variables using the session cookie value
SecRule REQUEST_COOKIES:PHPSESSID !^$ "nolog,pass,id:138,setsid:%{REQUEST_COOKIES.PHPSESSID}"
```

**Note:** After the initialization takes place, the variable `SESSION` will be available for use in the subsequent rules. This action understands application namespaces (configured using `SecWebAppId`), and will use one if it is configured.

Setsid takes an individual variable, not a collection. Variables within an action, such as setsid, use the format [collection].[variable] .

## setenv

**Description**: Creates, removes, and updates environment variables that can be accessed by the implementation.

**Action Group:** Non-disruptive

Examples:

```
SecRule RESPONSE_HEADERS:/Set-Cookie2?/ "(?i:(j?sessionid|(php)?sessid|(asp|jserv|jw)?session[-_]?(id)?|cf(id|token)|sid))" "phase:3,t:none,pass,id:139,nolog,setvar:tx.sessionid=%{matched_var}"
SecRule TX:SESSIONID "!(?i:\;? ?httponly;?)" "phase:3,id:140,t:none,setenv:httponly_cookie=%{matched_var},pass,log,auditlog,msg:'AppDefect: Missing HttpOnly Cookie Flag.'"
```

```apache
Header set Set-Cookie "%{httponly_cookie}e; HTTPOnly" env=httponly_cookie
```

Note : When used in a chain this action will be execute when an individual rule matches and not the entire chain.

## setvar

**Description**: Creates, removes, or updates a variable. Variable names are case-insensitive.

**Action Group:** Non-disruptive

Examples: To create a variable and set its value to 1 (usually used for setting flags), use: `setvar:TX.score`

To create a variable and initialize it at the same time, use: `setvar:TX.score=10`

To remove a variable, prefix the name with an exclamation mark: `setvar:!TX.score`

To increase or decrease variable value, use + and - characters in front of a numerical value: `setvar:TX.score=+5`

Example from OWASP CRS:

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "\bsys\.user_catalog\b" \
  "phase:2,rev:'2.1.3',capture,t:none,t:urlDecodeUni,t:htmlEntityDecode,t:lowercase,t:replaceComments,t:compressWhiteSpace,ctl:auditLogParts=+E, \
block,msg:'Blind SQL Injection Attack',id:'959517',tag:'WEB_ATTACK/SQL_INJECTION',tag:'WASCTC/WASC-19',tag:'OWASP_TOP_10/A1',tag:'OWASP_AppSensor/CIE1', \
tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.sql_injection_score=+%{tx.critical_anomaly_score}, \
setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/SQL_INJECTION-%{matched_var_name}=%{tx.0}"
```

Note : When used in a chain this action will be executed when an individual rule matches and not the entire chain.This means that

```
SecRule REQUEST_FILENAME "@contains /test.php" "chain,id:7,phase:1,t:none,nolog,setvar:tx.auth_attempt=+1"
    SecRule ARGS_POST:action "@streq login" "t:none"
```

will increment every time that test.php is visited (regardless of the parameters submitted). If the desired goal is to set the variable only if the entire rule matches, it should be included in the last rule of the chain. For instance:

```
SecRule REQUEST_FILENAME "@streq test.php" "chain,id:7,phase:1,t:none,nolog"
    SecRule ARGS_POST:action "@streq login" "t:none,setvar:tx.auth_attempt=+1"

```

## skip

**Description**: Skips one or more rules (or chains) on successful match.

**Action Group:** Flow

**Example:**

```
# Require Accept header, but not from access from the localhost
SecRule REMOTE_ADDR "^127\.0\.0\.1$" "phase:1,skip:1,id:141"

# This rule will be skipped over when REMOTE_ADDR is 127.0.0.1
SecRule &REQUEST_HEADERS:Accept "@eq 0" "phase:1,id:142,deny,msg:'Request Missing an Accept Header'"
```

The `skip` action works only within the current processing phase and not necessarily in the order in which the rules appear in the configuration file. If you place a phase 2 rule after a phase 1 rule that uses skip, it will not skip over the phase 2 rule. It will skip over the next phase 1 rule that follows it in the phase.

## skipAfter

**Description**: Skips one or more rules (or chains) on a successful match, resuming rule execution with the first rule that follows the rule (or marker created by SecMarker) with the provided ID.

**Action Group:** Flow

**Example:** The following rules implement the same logic as the skip example, but using skipAfter:

```
# Require Accept header, but not from access from the localhost
SecRule REMOTE_ADDR "^127\.0\.0\.1$" "phase:1,id:143,skipAfter:IGNORE_LOCALHOST"

# This rule will be skipped over when REMOTE_ADDR is 127.0.0.1
SecRule &REQUEST_HEADERS:Accept "@eq 0" "phase:1,deny,id:144,msg:'Request Missing an Accept Header'"
SecMarker IGNORE_LOCALHOST
```

Example from the OWASP CRS:

```
SecMarker BEGIN_HOST_CHECK

 SecRule &REQUEST_HEADERS:Host "@eq 0" \
      "skipAfter:END_HOST_CHECK,phase:2,rev:'2.1.3',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21', \
tag:'OWASP_TOP_10/A7',tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score}, \
setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score},setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}"

 SecRule REQUEST_HEADERS:Host "^$" \
      "phase:2,rev:'2.1.3',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21',tag:'OWASP_TOP_10/A7', \
tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score},setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score}, \
setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}"

SecMarker END_HOST_CHECK
```

The `skipAfter` action works only within the current processing phase and not necessarily the order in which the rules appear in the configuration file. If you place a phase 2 rule after a phase 1 rule that uses skip, it will not skip over the phase 2 rule. It will skip over the next phase 1 rule that follows it in the phase.

## status

**Description**: Specifies the response status code to use with actions deny and redirect.

**Action Group:** Data

**Example:**

```
# Deny with status 403
SecDefaultAction "phase:1,log,deny,id:145,status:403"
```

## t

**Description**: This action is used to specify the transformation pipeline to use to transform the value of each variable used in the rule before matching.

**Action Group:** Non-disruptive

**Example:**

```
SecRule ARGS "(asfunction|javascript|vbscript|data|mocha|livescript):" "id:146,t:none,t:htmlEntityDecode,t:lowercase,t:removeNulls,t:removeWhitespace"
```

Any transformation functions that you specify in a SecRule will be added to the previous ones specified in `SecDefaultAction`. It is recommended that you always use t:none in your rules, which prevents them depending on the default configuration.

## tag

**Description**: Assigns a tag (category) to a rule or a chain.

**Action Group:** Meta-data

**Example:**

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "\bgetparentfolder\b" \
 "phase:2,rev:'2.1.3',capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}"
```

The tag information appears along with other rule metadata. The purpose of the tagging mechanism to allow easy automated categorization of events. Multiple tags can be specified on the same rule. Use forward slashes to create a hierarchy of categories (as in the example). (*) Tag _does not_ support Macro Expansions right now (see https://github.com/corazawaf/coraza/issues/1118)

## ver

**Description**: Specifies the rule set version.

**Action Group:** Meta-data

**Example:**

```
SecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* "\bgetparentfolder\b" \
 "phase:2,ver:'CRS/2.2.4,capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}"
```
