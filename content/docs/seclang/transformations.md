---
title: "Transformations"
description: "Transformation functions are used to alter input data before it is used in matching."
lead: "Transformation functions are used to alter input data before it is used in matching (i.e., operator execution). The input data is never modified, actually—whenever you request a transformation function to be used, Coraza will create a copy of the data, transform it, and then run the operator against the result."
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

In the following example, the request parameter values are converted to lowercase before matching:

```
SecRule ARGS "xp_cmdshell" "t:lowercase,id:91"
```

Multiple transformation actions can be used in the same rule, forming a transformation pipeline. The transformations will be performed in the order in which they appear in the rule.

In most cases, the order in which transformations are performed is very important. In the following example, a series of transformation functions is performed to counter evasion. Performing the transformations in any other order would allow a skillful attacker to evade detection:

```
SecRule ARGS "(asfunction|javascript|vbscript|data|mocha|livescript):" "id:92,t:none,t:htmlEntityDecode,t:lowercase,t:removeNulls,t:removeWhitespace"
```

{{< alert icon="👉" text="Warning : It is currently possible to use SecDefaultAction to specify a default list of transformation functions, which will be applied to all rules that follow the SecDefaultAction directive. However, this practice is not recommended, because it means that mistakes are very easy to make. It is recommended that you always specify the transformation functions that are needed by a particular rule, starting the list with t:none (which clears the possibly inherited transformation functions)." />}}
The remainder of this section documents the transformation functions currently available in Coraza.

## base64Decode

Decodes a Base64-encoded string.

```
SecRule REQUEST_HEADERS:Authorization "^Basic ([a-zA-Z0-9]+=*)$" "phase:1,id:93,capture,chain,logdata:%{TX.1}"
  SecRule TX:1 ^(\w+): t:base64Decode,capture,chain
    SecRule TX:1 ^(admin|root|backup)$ 
````

Note : Be careful when applying base64Decode with other transformations. The order of your transformation matters in this case as certain transformations may change or invalidate the base64 encoded string prior to being decoded (i.e t:lowercase, etc). This of course means that it is also very difficult to write a single rule that checks for a base64decoded value OR an unencoded value with transformations, it is best to write two rules in this situation.
sqlHexDecode
Decode sql hex data. Example (0x414243) will be decoded to (ABC).

## base64DecodeExt

Decodes a Base64-encoded string. Unlike base64Decode, this version uses a forgiving implementation, which ignores invalid characters.

See blog post on Base64Decoding evasion issues on PHP sites - http://blog.spiderlabs.com/2010/04/impedance-mismatch-and-base64.html

## base64Encode

Encodes input string using Base64 encoding.

## cmdLine

In Windows and Unix, commands may be escaped by different means, such as:

- c^ommand /c ...
- "command" /c ...
- command,/c ...
- backslash in the middle of a Unix command

The cmdLine transformation function avoids this problem by manipulating the variable contend in the following ways:

- deleting all backslashes [\]
- deleting all double quotes ["]
- deleting all single quotes [']
- deleting all carets [^]
- deleting spaces before a slash /
- deleting spaces before an open parentesis [(]
- replacing all commas [,] and semicolon [;] into a space
- replacing all multiple spaces (including tab, newline, etc.) into one space
- transform all characters to lowercase

**Example Usage:**

```
SecRule ARGS "(?:command(?:.com)?|cmd(?:.exe)?)(?:/.*)?/[ck]" "phase:2,id:94,t:none, t:cmdLine"
```

## compressWhitespace

Converts any of the whitespace characters (0x20, \f, \t, \n, \r, \v, 0xa0) to spaces (ASCII 0x20), compressing multiple consecutive space characters into one.

## cssDecode

Decodes characters encoded using the CSS 2.x escape rules syndata.html#characters. This function uses only up to two bytes in the decoding process, meaning that it is useful to uncover ASCII characters encoded using CSS encoding (that wouldn’t normally be encoded), or to counter evasion, which is a combination of a backslash and non-hexadecimal characters (e.g., ja\vascript is equivalent to javascript).

## escapeSeqDecode

Decodes ANSI C escape sequences: \a, \b, \f, \n, \r, \t, \v, \\, \?, \', \", \xHH (hexadecimal), \0OOO (octal). Invalid encodings are left in the output.

## hexDecode

Decodes a string that has been encoded using the same algorithm as the one used in hexEncode (see following entry).

## hexEncode

Encodes string (possibly containing binary characters) by replacing each input byte with two hexadecimal characters. For example, xyz is encoded as 78797a.

## htmlEntityDecode

Decodes the characters encoded as HTML entities. The following variants are supported:

- HH and HH; (where H is any hexadecimal number)
- DDD and DDD; (where D is any decimal number)
- &quotand"
- &nbspand
- &ltand<
- &gtand>

This function always converts one HTML entity into one byte, possibly resulting in a loss of information (if the entity refers to a character that cannot be represented with the single byte). It is thus useful to uncover bytes that would otherwise not need to be encoded, but it cannot do anything meaningful with the characters from the range above 0xff.

## jsDecode

Decodes JavaScript escape sequences. If a \uHHHH code is in the range of FF01-FF5E (the full width ASCII codes), then the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte will be used and the higher byte zeroed (leading to possible loss of information).

## length

Looks up the length of the input string in bytes, placing it (as string) in output. For example, if it gets ABCDE on input, this transformation function will return 5 on output.

## lowercase

Converts all characters to lowercase using the current C locale.

## md5

Calculates an MD5 hash from the data in input. The computed hash is in a raw binary form and may need encoded into text to be printed (or logged). Hash functions are commonly used in combination with hexEncode (for example: t:md5,t:hexEncode).

## none

Not an actual transformation function, but an instruction to Coraza to remove all transformation functions associated with the current rule.

## normalizePath

Removes multiple slashes, directory self-references, and directory back-references (except when at the beginning of the input) from input string.

## normalizePathWin

Same as normalizePath, but first converts backslash characters to forward slashes.

## parityEven7bit

Calculates even parity of 7-bit data replacing the 8th bit of each target byte with the calculated parity bit.

## parityOdd7bit

Calculates odd parity of 7-bit data replacing the 8th bit of each target byte with the calculated parity bit.

## parityZero7bit

Calculates zero parity of 7-bit data replacing the 8th bit of each target byte with a zero-parity bit, which allows inspection of even/odd parity 7-bit data as ASCII7 data.

## removeNulls

Removes all NUL bytes from input.

## removeWhitespace

Removes all whitespace characters from input.

## replaceComments

Replaces each occurrence of a C-style comment (/*...*/) with a single space (multiple consecutive occurrences of which will not be compressed). Unterminated comments will also be replaced with a space (ASCII 0x20). However, a standalone termination of a comment (*/) will not be acted upon.

## removeCommentsChar

Removes common comments chars (/*,*/, --, #).

## removeComments

Removes each occurrence of comment (/*...*/, --, #). Multiple consecutive occurrences of which will not be compressed.

Note : This transformation is known to be unreliable, might cause some unexpected behaviour and could be deprecated soon in a future release. Refer to issue #1207 for further information..

## replaceNulls

Replaces NUL bytes in input with space characters (ASCII 0x20).

## urlDecode

Decodes a URL-encoded input string. Invalid encodings (i.e., the ones that use non-hexadecimal characters, or the ones that are at the end of string and have one or two bytes missing) are not converted, but no error is raised. To detect invalid encodings, use the @validateUrlEncoding operator on the input data first. The transformation function should not be used against variables that have already been URL-decoded (such as request parameters) unless it is your intention to perform URL decoding twice!

## uppercase

Converts all characters to uppercase using the current C locale.

## urlDecodeUni

Like urlDecode, but with support for the Microsoft-specific %u encoding. If the code is in the range of FF01-FF5E (the full-width ASCII codes), then the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte will be used and the higher byte zeroed.

## urlEncode

Encodes input string using URL encoding.

## utf8toUnicode

Converts all UTF-8 characters sequences to Unicode. This help input normalization specially for non-english languages minimizing false-positives and false-negatives.

## sha1

Calculates a SHA1 hash from the input string. The computed hash is in a raw binary form and may need encoded into text to be printed (or logged). Hash functions are commonly used in combination with hexEncode (for example, t:sha1,t:hexEncode).

## trimLeft

Removes whitespace from the left side of the input string.

## trimRight

Removes whitespace from the right side of the input string.

## trim

Removes whitespace from both the left and right sides of the input string.
