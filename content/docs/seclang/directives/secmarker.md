---
title: "SecMarker"
description: "Adds a fixed rule marker that can be used as a target in a skipAfter action. A SecMarker directive essentially creates a rule that does nothing and whose only purpose is to carry the given ID."
syntax: "SecMarker [ID|TEXT]"
default: ""
date: ""
lastmod: "2023-01-26T13:50:31&#43;01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

The value can be either a number or a text string. The SecMarker directive is available to
allow you to choose the best way to implement a skip-over. Here is an example used from the
Core Rule Set:

```
SecMarker BEGIN_HOST_CHECK

	SecRule &amp;REQUEST_HEADERS:Host &#34;@eq 0&#34; \
		   &#34;id:&#39;960008&#39;,skipAfter:END_HOST_CHECK,phase:2,rev:&#39;2.1.1&#39;,\
		   t:none,block,msg:&#39;Request Missing a Host Header&#39;,\
		   tag:&#39;PROTOCOL_VIOLATION/MISSING_HEADER_HOST&#39;,tag:&#39;WASCTC/WASC-21&#39;,\
		   tag:&#39;OWASP_TOP_10/A7&#39;,tag:&#39;PCI/6.5.10&#39;,\
		   severity:&#39;5&#39;,setvar:&#39;tx.msg=%{rule.msg}&#39;,setvar:tx.anomaly_score=&#43;%{tx.notice_anomaly_score},\
		   setvar:tx.protocol_violation_score=&#43;%{tx.notice_anomaly_score},\
		   setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}&#34;

	SecRule REQUEST_HEADERS:Host &#34;^$&#34; \
		   &#34;id:&#39;960008&#39;,phase:2,rev:&#39;2.1.1&#39;,t:none,block,msg:&#39;Request Missing a Host Header&#39;,\
		   tag:&#39;PROTOCOL_VIOLATION/MISSING_HEADER_HOST&#39;,tag:&#39;WASCTC/WASC-21&#39;,\
		   tag:&#39;OWASP_TOP_10/A7&#39;,tag:&#39;PCI/6.5.10&#39;,severity:&#39;5&#39;,\
		   setvar:&#39;tx.msg=%{rule.msg}&#39;,setvar:tx.anomaly_score=&#43;%{tx.notice_anomaly_score},\
		   setvar:tx.protocol_violation_score=&#43;%{tx.notice_anomaly_score},\
		   setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}&#34;

SecMarker END_HOST_CHECK
```

