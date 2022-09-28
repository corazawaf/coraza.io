---
title: "Operators"
description: "..."
lead: "..."
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

This section documents the operators currently available in Coraza.

## beginsWith
**Description:** Returns true if the parameter string is found at the beginning of the input. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect request line that does not begin with "GET" 
SecRule REQUEST_LINE "!@beginsWith GET" "id:149"
```

## contains
**Description:** Returns true if the parameter string is found anywhere in the input. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect ".php" anywhere in the request line 
SecRule REQUEST_LINE "@contains .php" "id:150"
```

## containsWord
**Description:** Returns true if the parameter string (with word boundaries) is found anywhere in the input. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect "select" anywhere in ARGS 
SecRule ARGS "@containsWord select" "id:151"
```

Would match on -
-1 union select BENCHMARK(2142500,MD5(CHAR(115,113,108,109,97,112))) FROM wp_users WHERE ID=1 and (ascii(substr(user_login,1,1))&0x01=0) from wp_users where ID=1--

But not on -
Your site has a wide selection of computers.

## endsWith
**Description:** Returns true if the parameter string is found at the end of the input. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect request line that does not end with "HTTP/1.1" 
SecRule REQUEST_LINE "!@endsWith HTTP/1.1" "id:152"
```

## fuzzyHash
**Description:** The fuzzyHash operator uses the ssdeep, which is a program for computing context triggered piecewise hashes (CTPH). Also called fuzzy hashes, CTPH can match inputs that have homologies. Such inputs have sequences of identical bytes in the same order, although bytes in between these sequences may be different in both content and length.

For further information on ssdeep, visit its site: http://ssdeep.sourceforge.net/

**Supported:** TBI

**Example:**

```
SecRule REQUEST_BODY "\@fuzzyHash /path/to/ssdeep/hashes.txt 6" "id:192372,log,deny"
```

## eq
**Description:** Performs numerical comparison and returns true if the input value is equal to the provided parameter. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect exactly 15 request headers 
SecRule &REQUEST_HEADERS_NAMES "@eq 15" "id:153"
```

**Note:** If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.

## ge
**Description:** Performs numerical comparison and returns true if the input value is greater than or equal to the provided parameter. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect 15 or more request headers 
SecRule &REQUEST_HEADERS_NAMES "@ge 15" "id:154"
```

**Note:** If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.

## geoLookup
**Description:** Performs a geolocation lookup using the IP address in input against the geolocation database previously configured using SecGeoLookupDb. If the lookup is successful, the obtained information is captured in the GEO collection.

**Example:** The geoLookup operator matches on success and is thus best used in combination with nolog,pass. If you wish to block on a failed lookup (which may be over the top, depending on how accurate the geolocation database is), the following example demonstrates how best to do it:

```
# Configure geolocation database 
SecGeoLookupDb /path/to/GeoLiteCity.dat 
... 
# Lookup IP address 
SecRule REMOTE_ADDR "@geoLookup" "phase:1,id:155,nolog,pass"

# Block IP address for which geolocation failed
SecRule &GEO "@eq 0" "phase:1,id:156,deny,msg:'Failed to lookup IP'"
See the GEO variable for an example and more information on various fields available.
```

**Note:** This operator supports the "capture" action.

## gt
**Description:** Performs numerical comparison and returns true if the input value is greater than the operator parameter. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect more than 15 headers in a request 
SecRule &REQUEST_HEADERS_NAMES "@gt 15" "id:158"
```

**Note:** If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.

## inspectFile
**Description:** Executes an external program for every variable in the target list. The contents of the variable is provided to the script as the first parameter on the command line. The program must be specified as the first parameter to the operator. As of version 2.5.0, if the supplied program filename is not absolute, it is treated as relative to the directory in which the configuration file resides. Also as of version 2.5.0, if the filename is determined to be a Lua script (based on its .lua extension), the script will be processed by the internal Lua engine. Internally processed scripts will often run faster (there is no process creation overhead) and have full access to the transaction context of Coraza.

The @inspectFile operator was initially designed for file inspection (hence the name), but it can also be used in any situation that requires decision making using external logic.


```
#!/usr/bin/perl
#
# runav.pl
# Copyright (c) 2004-2011 Trustwave
#
# This script is an interface between Coraza and its
# ability to intercept files being uploaded through the
# web server, and ClamAV


$CLAMSCAN = "clamscan";

if ($#ARGV != 0) {
    print "Usage: runav.pl <filename>\n";
    exit;
}

my ($FILE) = shift @ARGV;

$cmd = "$CLAMSCAN --stdout --no-summary $FILE";
$input = `$cmd`;
$input =~ m/^(.+)/;
$error_message = $1;

$output = "0 Unable to parse clamscan output [$1]";

if ($error_message =~ m/: Empty file\.?$/) {
    $output = "1 empty file";
}
elsif ($error_message =~ m/: (.+) ERROR$/) {
    $output = "0 clamscan: $1";
}
elsif ($error_message =~ m/: (.+) FOUND$/) {
    $output = "0 clamscan: $1";
}
elsif ($error_message =~ m/: OK$/) {
    $output = "1 clamscan: OK";
}

print "$output\n";
```

**Example:** Using the runav.pl script:

```
# Execute external program to validate uploaded files 
SecRule FILES_TMPNAMES "@inspectFile /path/to/util/runav.pl" "id:159"
```

**Note:** Coraza will not fill the FILES_TMPNAMES variable unless SecTmpSaveUploadedFiles directive is On, or the SecUploadKeepFiles directive is set to RelevantOnly.

**Note:** Use @inspectFile with caution. It may not be safe to use @inspectFile with variables other than FILES_TMPNAMES. Other variables such as "FULL_REQUEST" may contains content that force your platform to fork process out of your control, making possible to an attacker to execute code using the same permissions of your web server. For other variables you may want to look at the Lua script engine. This observation was brought to our attention by "Gryzli", on our users mailing list.

**Reference:** http://blog.spiderlabs.com/2010/10/advanced-topic-of-the-week-preventing-malicious-pdf-file-uploads.html

**Reference:** http://sourceforge.net/p/mod-security/mailman/mod-security-users/?viewmonth=201512

## ipMatch
**Description:** Performs a fast ipv4 or ipv6 match of REMOTE_ADDR variable data. Can handle the following formats:

- Full IPv4 Address - 192.168.1.100
- Network Block/CIDR Address - 192.168.1.0/24
- Full IPv6 Address - 2001:db8:85a3:8d3:1319:8a2e:370:7348
- Network Block/CIDR Address - 2001:db8:85a3:8d3:1319:8a2e:370:0/24

**Examples:**

**Individual Address:**

```
SecRule REMOTE_ADDR "@ipMatch 192.168.1.100" "id:161"
Multiple Addresses w/network block:
SecRule REMOTE_ADDR "@ipMatch 192.168.1.100,192.168.1.50,10.10.50.0/24" "id:162"
```

## ipMatchF
short alias for ipMatchFromFile

## ipMatchFromFile
**Description:** Performs a fast ipv4 or ipv6 match of REMOTE_ADDR variable, loading data from a file. Can handle the following formats:

- Full IPv4 Address - 192.168.1.100
- Network Block/CIDR Address - 192.168.1.0/24
- Full IPv6 Address - 2001:db8:85a3:8d3:1319:8a2e:370:7348
- Network Block/CIDR Address - 2001:db8:85a3:8d3:1319:8a2e:370:0/24

**Examples:**

```
SecRule REMOTE_ADDR "@ipMatchFromFile ips.txt" "id:163"
```

The file ips.txt may contain:

- 192.168.0.1
- 172.16.0.0/16
- 10.0.0.0/8

**Note:** This operator also supports to load content served by an HTTPS server.

**Note:** When used with content served by a HTTPS server, the directive SecRemoteRulesFailAction can be used to configure a warning instead of an abort, when the remote content could not be retrieved.

## le
**Description:** Performs numerical comparison and returns true if the input value is less than or equal to the operator parameter. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect 15 or fewer headers in a request 
SecRule &REQUEST_HEADERS_NAMES "@le 15" "id:164"
```
**Note:** If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.

## lt
**Description:** Performs numerical comparison and returns true if the input value is less than to the operator parameter. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect fewer than 15 headers in a request 
SecRule &REQUEST_HEADERS_NAMES "@lt 15" "id:165"
```
**Note:** If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.

## noMatch
**Description:** Will force the rule to always return false.

## pm
**Description:** Performs a case-insensitive match of the provided phrases against the desired input value. The operator uses a set-based matching algorithm (Aho-Corasick), which means that it will match any number of keywords in parallel. When matching of a large number of keywords is needed, this operator performs much better than a regular expression.

**Example:**

```
# Detect suspicious client by looking at the user agent identification 
SecRule REQUEST_HEADERS:User-Agent "@pm WebZIP WebCopier Webster WebStripper ... SiteSnagger ProWebWalker CheeseBot" "id:166"
```

**Note:** This operator supports a snort/suricata content style. ie: "@pm A|42|C|44|F".

**Note:** This operator does not support macro expansion.

**Note:** This operator supports the "capture" action.

## pmf
Short alias for pmFromFile.

## pmFromFile
**Description:** Performs a case-insensitive match of the provided phrases against the desired input value. The operator uses a set-based matching algorithm (Aho-Corasick), which means that it will match any number of keywords in parallel. When matching of a large number of keywords is needed, this operator performs much better than a regular expression.

This operator is the same as @pm, except that it takes a list of files as arguments. It will match any one of the phrases listed in the file(s) anywhere in the target value.

**Example:**

```
# Detect suspicious user agents using the keywords in 
# the files /path/to/blacklist1 and blacklist2 (the latter 
# must be placed in the same folder as the configuration file) 
SecRule REQUEST_HEADERS:User-Agent "@pmFromFile /path/to/blacklist1 blacklist2" "id:167"
```

**Notes:**

Files must contain exactly one phrase per line. End of line markers (both LF and CRLF) will be stripped from each phrase and any whitespace trimmed from both the beginning and the end. Empty lines and comment lines (those beginning with the # character) will be ignored.
To allow easier inclusion of phrase files with rule sets, relative paths may be used to the phrase files. In this case, the path of the file containing the rule is prepended to the phrase file path.
The @pm operator phrases do not support metacharacters.
Because this operator does not check for boundaries when matching, false positives are possible in some cases. For example, if you want to use @pm for IP address matching, the phrase 1.2.3.4 will potentially match more than one IP address (e.g., it will also match 1.2.3.40 or 1.2.3.41). To avoid the false positives, you can use your own boundaries in phrases. For example, use /1.2.3.4/ instead of just 1.2.3.4. Then, in your rules, also add the boundaries where appropriate. You will find a complete example in the example.

```
# Prepare custom REMOTE_ADDR variable 
SecAction "phase:1,id:168,nolog,pass,setvar:tx.REMOTE_ADDR=/%{REMOTE_ADDR}/"

# Check if REMOTE_ADDR is blacklisted 
SecRule TX:REMOTE_ADDR "@pmFromFile blacklist.txt" "phase:1,id:169,deny,msg:'Blacklisted IP address'" 
```

The file blacklist.txt may contain:

```
# ip-blacklist.txt contents:
# Note: All IPs must be prefixed/suffixed with "/" as the rules
#   will add in this character as a boundary to ensure
#   the entire IP is matched.
# SecAction "phase:1,id:170,pass,nolog,setvar:tx.remote_addr='/%{REMOTE_ADDR}/'"
/1.2.3.4/ 
/5.6.7.8/
```

**Note:** This operator supports a snort/suricata content style. ie: "A|42|C|44|F".

**Note II:** This operator also supports to load content served by an HTTPS server. However, only one url can be used at a time.

## rbl

**Description:** Looks up the input value in the RBL (real-time block list) given as parameter. The parameter can be an IPv4 address or a hostname.

**Example:**

```
SecRule REMOTE_ADDR "@rbl sbl-xbl.spamhaus.org" "phase:1,id:171,t:none,pass,nolog,auditlog,msg:'RBL Match for SPAM Source',tag:'AUTOMATION/MALICIOUS',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.automation_score=+%{tx.warning_anomaly_score},setvar:tx.anomaly_score=+%{tx.warning_anomaly_score}, \
setvar:tx.%{rule.id}-AUTOMATION/MALICIOUS-%{matched_var_name}=%{matched_var},setvar:ip.spammer=1,expirevar:ip.spammer=86400,setvar:ip.previous_rbl_check=1,expirevar:ip.previous_rbl_check=86400,skipAfter:END_RBL_CHECK"
```

**Note:** If the RBL used is dnsbl.httpbl.org (Honeypot Project RBL) then the SecHttpBlKey directive must specify the user's registered API key.

**Note:** If the RBL used is either multi.uribl.com or zen.spamhaus.org combined RBLs, it is possible to also parse the return codes in the last octet of the DNS response to identify which specific RBL the IP was found in.

**Note:** This operator supports the "capture" action.

## rsub
**Description:** Performs regular expression data substitution when applied to either the STREAM_INPUT_BODY or STREAM_OUTPUT_BODY variables. This operator also supports macro expansion. Starting with Coraza 2.7.0 this operator supports the syntax |hex| allowing users to use special chars like \n \r

**Syntax:** @rsub s/regex/str/[id]

**Supported:** TBI

**Examples:** Removing HTML Comments from response bodies:

```
SecStreamOutBodyInspection On
SecRule STREAM_OUTPUT_BODY "@rsub s// /" "phase:4,id:172,t:none,nolog,pass"
```

**Note:** If you plan to manipulate live data by using @rsub with the STREAM_ variables, you must also enable SecContentInjection directive.
Regular expressions are handled by the PCRE library http://www.pcre.org. Coraza compiles its regular expressions with the following settings:

The entire input is treated as a single line, even when there are newline characters present.
All matches are case-sensitive. If you wish to perform case-insensitive matching, you can either use the lowercase transformation function or force case-insensitive matching by prefixing the regular expression pattern with the (?i) modifier (a PCRE feature; you will find many similar features in the PCRE documentation). Also a flag [d] should be used if you want to escape the regex string chars when use macro expansion.
The PCRE_DOTALL and PCRE_DOLLAR_ENDONLY flags are set during compilation, meaning that a single dot will match any character, including the newlines, and a $ end anchor will not match a trailing newline character.
Regular expressions are a very powerful tool. You are strongly advised to read the PCRE documentation to get acquainted with its features.

**Note:** This operator supports the "capture" action.

## rx
**Description:** Performs a regular expression match of the pattern provided as parameter. This is the default operator; the rules that do not explicitly specify an operator default to @rx.

**Examples:**

```
# Detect Nikto 
SecRule REQUEST_HEADERS:User-Agent "@rx nikto" phase:1,id:173,t:lowercase

SecRule REQUEST_HEADERS:User-Agent "@rx (?i)nikto" phase:1,id:174,t:none
# Detect Nikto with a case-insensitive pattern 

# Detect Nikto with a case-insensitive pattern 
SecRule REQUEST_HEADERS:User-Agent "(?i)nikto" "id:175"
```

Regular expressions are handled by the RE2. Coraza compiles its regular expressions with the following settings:

The entire input is treated as a single line, even when there are newline characters present.
All matches are case-sensitive. If you wish to perform case-insensitive matching, you can either use the lowercase transformation function or force case-insensitive matching by prefixing the regular expression pattern with the (?i) modifier (a PCRE feature; you will find many similar features in the PCRE documentation).
A single dot will match any character, including the newlines, and a $ end anchor will not match a trailing newline character.
Regular expressions are a very powerful tool. You are strongly advised to read the PCRE documentation to get acquainted with its features.

**Note:** This operator supports the "capture" action.

## streq
**Description:** Performs a string comparison and returns true if the parameter string is identical to the input string. Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect request parameters "foo" that do not # contain "bar", exactly. 
SecRule ARGS:foo "!@streq bar" "id:176"
```

## strmatch
**Description:** Performs a string match of the provided word against the desired input value. The operator uses the pattern matching Boyer-Moore-Horspool algorithm, which means that it is a single pattern matching operator. This operator performs much better than a regular expression.

**Example:**

```
# Detect suspicious client by looking at the user agent identification 
SecRule REQUEST_HEADERS:User-Agent "@strmatch WebZIP" "id:177"
```

**Note:** Starting on Coraza v2.6.0 this operator supports a snort/suricata content style. ie: "@strmatch A|42|C|44|F".
unconditionalMatch

**Description:** Will force the rule to always return true. This is similar to SecAction however all actions that occur as a result of a rule matching will fire such as the setting of MATCHED_VAR. This can also be part a chained rule.

**Example:**

```
SecRule REMOTE_ADDR "@unconditionalMatch" "id:1000,phase:1,pass,nolog,t:hexEncode,setvar:TX.ip_hash=%{MATCHED_VAR}"
```

## validateByteRange
**Description:** Validates that the byte values used in input fall into the range specified by the operator parameter. This operator matches on an input value that contains bytes that are not in the specified range.

**Example:**

```
# Enforce very strict byte range for request parameters (only 
# works for the applications that do not use the languages other 
# than English). 
SecRule ARGS "@validateByteRange 10, 13, 32-126" "id:178"
```

The validateByteRange is most useful when used to detect the presence of NUL bytes, which don’t have a legitimate use, but which are often used as an evasion technique.

```
# Do not allow NUL bytes 
SecRule ARGS "@validateByteRange 1-255" "id:179"
```

**Note:** You can force requests to consist only of bytes from a certain byte range. This can be useful to avoid stack overflow attacks (since they usually contain "random" binary content). Default range values are 0 and 255, i.e. all byte values are allowed. This directive does not check byte range in a POST payload when multipart/form-data encoding (file upload) is used. Doing so would prevent binary files from being uploaded. However, after the parameters are extracted from such request they are checked for a valid range.


## validateHash
**Description:** Validates REQUEST_URI that contains data protected by the hash engine.

**Supported:** TBI

**Example:**

```
# Validates requested URI that matches a regular expression.
SecRule REQUEST_URI "@validatehash "product_info|product_list" "phase:1,deny,id:123456"
```

## validateUrlEncoding
**Description:** Validates the URL-encoded characters in the provided input string.

**Example:**

```
# Validate URL-encoded characters in the request URI 
SecRule REQUEST_URI_RAW "@validateUrlEncoding" "id:192"
```
Coraza will automatically decode the URL-encoded characters in request parameters, which means that there is little sense in applying the @validateUrlEncoding operator to them —that is, unless you know that some of the request parameters were URL-encoded more than once. Use this operator against raw input, or against the input that you know is URL-encoded. For example, some applications will URL-encode cookies, although that’s not in the standard. Because it is not in the standard, Coraza will neither validate nor decode such encodings.

## validateUtf8Encoding

**Description:** Check whether the input is a valid UTF-8 string.

**Example:**

```
# Make sure all request parameters contain only valid UTF-8 
SecRule ARGS "@validateUtf8Encoding" "id:193"
```
The @validateUtf8Encoding operator detects the following problems:

- **Not enough bytes :** UTF-8 supports two-, three-, four-, five-, and six-byte encodings. Coraza will locate cases when one or more bytes is/are missing from a character.
- **Invalid characters :** The two most significant bits in most characters should be fixed to 0x80. Some attack techniques use different values as an evasion technique.
- **Overlong characters :** ASCII characters are mapped directly into UTF-8, which means that an ASCII character is one UTF-8 character at the same time. However, in UTF-8 many ASCII characters can also be encoded with two, three, four, five, and six bytes. This is no longer legal in the newer versions of Unicode, but many older implementations still support it. The use of overlong UTF-8 characters is common for evasion.

**Notes :**
- Most, but not all applications use UTF-8. If you are dealing with an application that does, validating that all request parameters are valid UTF-8 strings is a great way to prevent a number of evasion techniques that use the assorted UTF-8 weaknesses. False positives are likely if you use this operator in an application that does not use UTF-8.
- Many web servers will also allow UTF-8 in request URIs. If yours does, you can verify the request URI using @validateUtf8Encoding.

## verifyCC
**Description:** Detects credit card numbers in input. This operator will first use the supplied regular expression to perform an initial match, following up with the Luhn algorithm calculation to minimize false positives.

**Supported on Coraza:** TBI

**Example:**

```
# Detect credit card numbers in parameters and 
# prevent them from being logged to audit log 
SecRule ARGS "@verifyCC \d{13,16}" "phase:2,id:194,nolog,pass,msg:'Potential credit card number',sanitiseMatched"
```

**Note:** This operator supports the "capture" action.

## within
**Description:** Returns true if the input value (the needle) is found anywhere within the @within parameter (the haystack). Macro expansion is performed on the parameter string before comparison.

**Example:**

```
# Detect request methods other than GET, POST and HEAD 
SecRule REQUEST_METHOD "!@within GET,POST,HEAD"
```

**Note:** There are no delimiters for this operator, it is therefore often necessary to artificially impose some; this can be done using setvar. For instance in the example below, without the imposed delimiters (of '/') this rule would also match on the 'range' header (along with many other combinations), since 'range' is within the provided parameter. With the imposed delimiters, the rule would check for '/range/' when the range header is provided, and therefore would not match since '/range/ is not part of the @within parameter.

```
SecRule REQUEST_HEADERS_NAMES "@rx ^.*$" \
"chain,\
id:1,\
block,\
t:lowercase,\
setvar:'tx.header_name=/%{tx.0}/'"
   SecRule TX:header_name "@within /proxy/ /lock-token/ /content-range/ /translate/ /if/" "t:none"
```
