var suggestions=document.getElementById("suggestions"),userinput=document.getElementById("userinput");document.addEventListener("keydown",inputFocus);function inputFocus(e){e.keyCode===191&&(e.preventDefault(),userinput.focus()),e.keyCode===27&&(userinput.blur(),suggestions.classList.add("d-none"))}document.addEventListener("click",function(e){var t=suggestions.contains(e.target);t||suggestions.classList.add("d-none")}),document.addEventListener("keydown",suggestionFocus);function suggestionFocus(e){const s=suggestions.querySelectorAll("a"),o=[...s],t=o.indexOf(document.activeElement);let n=0;e.keyCode===38?(e.preventDefault(),n=t>0?t-1:0,s[n].focus()):e.keyCode===40&&(e.preventDefault(),n=t+1<o.length?t+1:t,s[n].focus())}(function(){var e=new FlexSearch.Document({tokenize:"forward",cache:100,document:{id:"id",store:["href","title","description"],index:["title","description","content"]}});e.add({id:0,href:"https://coraza.io/docs/seclang/directives/",title:"Directives",description:"The following section outlines all of the Coraza directives. ",content:`\u003cp\u003eIf you are looking to extend OWASP Core Ruleset, check this article.\u003c/p\u003e
\u003cp\u003eNote : It is highly encouraged that you do not edit the Core rules files themselves but rather place all changes (such as SecRuleRemoveByID, etc\u0026hellip;) in your custom rules file. This will allow for easier upgrading as newer Core rules are released.\u003c/p\u003e
\u003ch2 id="secaction"\u003eSecAction\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Unconditionally processes the action list it receives as the first and only parameter. The syntax of the parameter is identical to that of the third parameter of SecRule.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecAction \u0026ldquo;action1,action2,action3,\u0026hellip;“\u003c/p\u003e
\u003cp\u003eThis directive is commonly used to set variables and initialize persistent collections using the initcol action. For example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction nolog,phase:1,initcol:RESOURCE=%{REQUEST_FILENAME}
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="secargumentseparator"\u003eSecArgumentSeparator\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Specifies which character to use as the separator for application/x-www-form- urlencoded content.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecArgumentSeparator character\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e \u0026amp;\u003c/p\u003e
\u003cp\u003eThis directive is needed if a backend web application is using a nonstandard argument separator. Applications are sometimes (very rarely) written to use a semicolon separator. You should not change the default setting unless you establish that the application you are working with requires a different separator. If this directive is not set properly for each web application, then Coraza will not be able to parse the arguments appropriately and the effectiveness of the rule matching will be significantly decreased.\u003c/p\u003e
\u003ch2 id="secauditengine"\u003eSecAuditEngine\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the audit logging engine.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecAuditEngine RelevantOnly\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e Off\u003c/p\u003e
\u003cp\u003eThe SecAuditEngine directive is used to configure the audit engine, which logs complete transactions. Coraza is currently able to log most, but not all transactions. Transactions involving errors (e.g., 400 and 404 transactions) use a different execution path, which Coraza does not support.\u003c/p\u003e
\u003cp\u003eThe possible values for the audit log engine are as follows:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOn:\u003c/strong\u003e log all transactions\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOff:\u003c/strong\u003e do not log any transactions\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRelevantOnly:\u003c/strong\u003e only the log transactions that have triggered a warning or an error, or have a status code that is considered to be relevant (as determined by the SecAuditLogRelevantStatus directive)\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e If you need to change the audit log engine configuration on a per-transaction basis (e.g., in response to some transaction data), use the ctl action.
The following example demonstrates how SecAuditEngine is used:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAuditEngine RelevantOnly
SecAuditLog logs/audit/audit.log
SecAuditLogParts ABCFHZ 
SecAuditLogType concurrent 
SecAuditLogStorageDir logs/audit 
SecAuditLogRelevantStatus ^(?:5|4(?!04))
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="secauditlog"\u003eSecAuditLog\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Defines the path to the main audit log file (serial logging format) or the concurrent logging index file (concurrent logging format). When used in combination with mlogc (only possible with concurrent logging), this directive defines the mlogc location and command line.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecAuditLog /path/to/audit.log\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAuditLog \u0026quot;|/path/to/mlogc /path/to/mlogc.conf\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : This audit log file is opened on startup when the server typically still runs as root. You should not allow non-root users to have write privileges for this file or for the directory.\u003c/p\u003e
\u003ch2 id="secauditlogparts"\u003eSecAuditLogParts\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Defines which parts of each transaction are going to be recorded in the audit log. Each part is assigned a single letter; when a letter appears in the list then the equivalent part will be recorded. See below for the list of all parts.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecAuditLogParts PARTLETTERS\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecAuditLogParts ABCFHZ\u003c/p\u003e
\u003cp\u003eThe format of the audit log format is documented in detail in the Audit Log Data Format Documentation.\u003c/p\u003e
\u003cp\u003eAvailable audit log parts:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eA:\u003c/strong\u003e Audit log header (mandatory).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eB:\u003c/strong\u003e Request headers.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eC:\u003c/strong\u003e Request body (present only if the request body exists and Coraza is configured to intercept it. This would require SecRequestBodyAccess to be set to on).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eD:\u003c/strong\u003e Reserved for intermediary response headers; not implemented yet.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eE:\u003c/strong\u003e Intermediary response body (present only if Coraza is configured to intercept response bodies, and if the audit log engine is configured to record it. Intercepting response bodies requires SecResponseBodyAccess to be enabled). Intermediary response body is the same as the actual response body unless Coraza intercepts the intermediary response body, in which case the actual response body will contain the error message (either the Apache default error message, or the ErrorDocument page).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eF:\u003c/strong\u003e Final response headers (excluding the Date and Server headers, which are always added by Apache in the late stage of content delivery).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eG:\u003c/strong\u003e Reserved for the actual response body; not implemented yet.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eH:\u003c/strong\u003e Audit log trailer.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eI:\u003c/strong\u003e This part is a replacement for part C. It will log the same data as C in all cases except when multipart/form-data encoding in used. In this case, it will log a fake application/x-www-form-urlencoded body that contains the information about parameters but not about the files. This is handy if you don’t want to have (often large) files stored in your audit logs.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eJ:\u003c/strong\u003e This part contains information about the files uploaded using multipart/form-data encoding.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eK:\u003c/strong\u003e This part contains a full list of every rule that matched (one per line) in the order they were matched. The rules are fully qualified and will thus show inherited actions and default operators.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eZ:\u003c/strong\u003e Final boundary, signifies the end of the entry (mandatory).\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="secauditlogrelevantstatus"\u003eSecAuditLogRelevantStatus\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures which response status code is to be considered relevant for the purpose of audit logging.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecAuditLogRelevantStatus REGEX\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecAuditLogRelevantStatus \u0026ldquo;^(?:5|4(?!04))\u0026rdquo;\u003c/p\u003e
\u003cp\u003eDependencies/Notes: Must have SecAuditEngine set to RelevantOnly. Additionally, the auditlog action is present by default in rules, this will make the engine bypass the \u0026lsquo;SecAuditLogRelevantStatus\u0026rsquo; and send rule matches to the audit log regardless of status. You must specify noauditlog in the rules manually or set it in SecDefaultAction.\u003c/p\u003e
\u003cp\u003eThe main purpose of this directive is to allow you to configure audit logging for only the transactions that have the status code that matches the supplied regular expression. The example provided would log all 5xx and 4xx level status codes, except for 404s. Although you could achieve the same effect with a rule in phase 5, SecAuditLogRelevantStatus is sometimes better, because it continues to work even when SecRuleEngine is disabled.\u003c/p\u003e
\u003ch2 id="seccollectiontimeout"\u003eSecCollectionTimeout\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Specifies the collections timeout. Default is 3600 seconds.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecCollectionTimeout seconds\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e 3600\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e No\u003c/p\u003e
\u003ch2 id="seccomponentsignature"\u003eSecComponentSignature\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Appends component signature to the Coraza signature.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecComponentSignature \u0026ldquo;COMPONENT_NAME/X.Y.Z (COMMENT)\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecComponentSignature \u0026ldquo;core ruleset/2.1.3\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e No\u003c/p\u003e
\u003cp\u003eThis directive should be used to make the presence of significant rule sets known. The entire signature will be recorded in the transaction audit log.\u003c/p\u003e
\u003ch2 id="seccontentinjection"\u003eSecContentInjection\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Enables content injection using actions append and prepend.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecContentInjection On|Off\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecContentInjection On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eThis directive provides an easy way to control content injection, no matter what the rules want to do. It is not necessary to have response body buffering enabled in order to use content injection.\u003c/p\u003e
\u003cp\u003eNote : This directive must ben enabled if you want to use @rsub + the STREAM_ variables to manipulate live transactional data.\u003c/p\u003e
\u003ch2 id="secdatadir"\u003eSecDataDir\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Path where persistent data (e.g., IP address data, session data, and so on) is to be stored.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecDataDir /path/to/dir\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecDataDir /usr/local/apache/logs/data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e No\u003c/p\u003e
\u003cp\u003eThis directive must be provided before initcol, setsid, and setuid can be used. The directory to which the directive points must be writable by the web server user.\u003c/p\u003e
\u003cp\u003eNote : This directive is not allowed inside VirtualHosts. If enabled, it must be placed in a global server-wide configuration file such as your default Coraza.conf.
Note : SecDataDir is not currently supported. Collections are kept in memory (in_memory-per_process) for now.\u003c/p\u003e
\u003ch2 id="secdebuglog"\u003eSecDebugLog\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Path to the Coraza debug log file.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecDebugLog /path/to/coraza-debug.log\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecDebugLog /usr/local/apache/logs/coraza-debug.log\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003ch2 id="secdebugloglevel"\u003eSecDebugLogLevel\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the verboseness of the debug log data.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecDebugLogLevel 0|1|2|3|4|5\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecDebugLogLevel 4\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eMessages at levels 1–3 are always copied to the Apache error log. Therefore you can always use level 0 as the default logging level in production if you are very concerned with performance. Having said that, the best value to use is 3. Higher logging levels are not recommended in production, because the heavy logging affects performance adversely.\u003c/p\u003e
\u003cp\u003eThe possible values for the debug log level are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003e0:\u003c/strong\u003e Fatal\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e1:\u003c/strong\u003e Panic\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e2:\u003c/strong\u003e Error\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e3:\u003c/strong\u003e Warning\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e4:\u003c/strong\u003e details of how transactions are handled\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e5:\u003c/strong\u003e log everything, including very detailed debugging information\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="secdefaultaction"\u003eSecDefaultAction\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Defines the default list of actions, which will be inherited by the rules in the same configuration context.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecDefaultAction \u0026ldquo;action1,action2,action3“\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecDefaultAction \u0026ldquo;phase:2,log,auditlog,deny,status:403,tag:\u0026lsquo;SLA 24/7\u0026rsquo;“\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e phase:2,log,auditlog,pass\u003c/p\u003e
\u003cp\u003eEvery rule following a previous SecDefaultAction directive in the same configuration context will inherit its settings unless more specific actions are used. Every SecDefaultAction directive must specify a disruptive action and a processing phase and cannot contain metadata actions.\u003c/p\u003e
\u003ch2 id="secdisablebackendcompression"\u003eSecDisableBackendCompression\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Disables backend compression while leaving the frontend compression enabled.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecDisableBackendCompression On|Off\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e Off\u003c/p\u003e
\u003cp\u003eThis directive is necessary in reverse proxy mode when the backend servers support response compression, but you wish to inspect response bodies. Unless you disable backend compression, Coraza will only see compressed content, which is not very useful. This directive is not necessary in embedded mode, because Coraza performs inspection before response compression takes place.\u003c/p\u003e
\u003ch2 id="sechashengine"\u003eSecHashEngine\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the hash engine.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecHashEngine On|Off\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecHashEngine On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e Off\u003c/p\u003e
\u003cp\u003eThe possible values are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOn:\u003c/strong\u003e Hash engine can process the request/response data.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOff:\u003c/strong\u003e Hash engine will not process any data.\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eNote\u003c/strong\u003e: Users must enable stream output variables and content injection.\u003c/p\u003e
\u003ch2 id="sechashkey"\u003eSecHashKey\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Define the key that will be used by HMAC.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecHashKey rand|TEXT KeyOnly|SessionID|RemoteIP\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecHashKey \u0026ldquo;this_is_my_key\u0026rdquo; KeyOnly\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eCoraza hash engine will append, if specified, the user\u0026rsquo;s session id or remote ip to the key before the MAC operation. If the first parameter is \u0026ldquo;rand\u0026rdquo; then a random key will be generated and used by the engine.\u003c/p\u003e
\u003ch2 id="sechashparam"\u003eSecHashParam\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Define the parameter name that will receive the MAC hash.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecHashParam TEXT\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecHashParam \u0026ldquo;hmac\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eCoraza hash engine will add a new parameter to protected HTML elements containing the MAC hash.\u003c/p\u003e
\u003ch2 id="sechashmethodrx"\u003eSecHashMethodRx\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures what kind of HTML data the hash engine should sign based on regular expression.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecHashMethodRx TYPE REGEX\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecHashMethodRx HashHref \u0026ldquo;product_info|list_product\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eAs a initial support is possible to protect HREF, FRAME, IFRAME and FORM ACTION html elements as well response Location header when http redirect code are sent.\u003c/p\u003e
\u003cp\u003eThe possible values for TYPE are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eHashHref:\u003c/strong\u003e Used to sign href= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashFormAction:\u003c/strong\u003e Used to sign form action= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashIframeSrc:\u003c/strong\u003e Used to sign iframe src= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashframeSrc:\u003c/strong\u003e Used to sign frame src= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashLocation:\u003c/strong\u003e Used to sign Location response header\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eNote : This directive is used to sign the elements however user must use the @validateHash operator to enforce data integrity.\u003c/p\u003e
\u003ch2 id="sechashmethodpm"\u003eSecHashMethodPm\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures what kind of HTML data the hash engine should sign based on string search algoritm.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecHashMethodPm TYPE \u0026ldquo;string1 string2 string3\u0026hellip;\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecHashMethodPm HashHref \u0026ldquo;product_info list_product\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eAs a initial support is possible to protect HREF, FRAME, IFRAME and FORM ACTION html elements as well response Location header when http redirect code are sent.\u003c/p\u003e
\u003cp\u003eThe possible values for TYPE are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eHashHref:\u003c/strong\u003e Used to sign href= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashFormAction:\u003c/strong\u003e Used to sign form action= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashIframeSrc:\u003c/strong\u003e Used to sign iframe src= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashframeSrc:\u003c/strong\u003e Used to sign frame src= html elements\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eHashLocation:\u003c/strong\u003e Used to sign Location response header\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eNote : This directive is used to sign the elements however user must use the @validateHash operator to enforce data integrity.\u003c/p\u003e
\u003ch2 id="secgeolookupdb"\u003eSecGeoLookupDb\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Defines the path to the database that will be used for geolocation lookups.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecGeoLookupDb /path/to/db\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecGeoLookupDb /path/to/GeoLiteCity.mmdb\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eCoraza relies on the free geolocation databases (GeoLite City and GeoLite Country) that can be obtained from MaxMind http://www.maxmind.com. Only .mmdb format is supported.\u003c/p\u003e
\u003ch2 id="sechttpblkey"\u003eSecHttpBlKey\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the user\u0026rsquo;s registered Honeypot Project HTTP BL API Key to use with @rbl.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecHttpBlKey [12 char access key]\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecHttpBlKey whdkfieyhtnf\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eIf the @rbl operator uses the dnsbl.httpbl.org RBL (http://www.projecthoneypot.org/httpbl_api.php) you must provide an API key. This key is registered to individual users and is included within the RBL DNS requests.\u003c/p\u003e
\u003ch2 id="secinterceptonerror"\u003eSecInterceptOnError\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures how to respond when rule processing fails.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecInterceptOnError On|Off\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecInterceptOnError On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eWhen an operator execution fails, that is it returns greater than 0, this directive configures how to react. When set to \u0026ldquo;Off\u0026rdquo;, the rule is just ignored and the engine will continue executing the rules in phase. When set to \u0026ldquo;On\u0026rdquo;, the rule will be just dropped and no more rules will be executed in the same phase, also no interception is made.\u003c/p\u003e
\u003ch2 id="secmarker"\u003eSecMarker\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Adds a fixed rule marker that can be used as a target in a skipAfter action. A SecMarker directive essentially creates a rule that does nothing and whose only purpose is to carry the given ID.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecMarker ID|TEXT\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecMarker 9999\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThe value can be either a number or a text string. The SecMarker directive is available to allow you to choose the best way to implement a skip-over. Here is an example used from the Core Rule Set:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecMarker BEGIN_HOST_CHECK

SecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \\
        \u0026quot;skipAfter:END_HOST_CHECK,phase:2,rev:'2.1.1',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21',tag:'OWASP_TOP_10/A7',tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score},setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score},setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}\u0026quot;
SecRule REQUEST_HEADERS:Host \u0026quot;^\$\u0026quot; \\
        \u0026quot;phase:2,rev:'2.1.1',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21',tag:'OWASP_TOP_10/A7',tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score},setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score},setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}\u0026quot;
SecMarker END_HOST_CHECK
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="secsensorid"\u003eSecSensorId\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Define a sensor ID that will be present into log part H.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecSensorId TEXT\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecSensorId WAFSensor01\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="secremoterules"\u003eSecRemoteRules\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Load rules from a given file hosted on a HTTPS site.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRemoteRules [crypto] key https://url\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRemoteRules some-key https://www.yourserver.com/plain-text-rules.txt\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThis is an optional directive that allow the user to load rules from a remote server. Notice that besides the URL the user also needs to supply a key, which could be used by the target server to provide different content for different keys.\u003c/p\u003e
\u003cp\u003eAlong with the key, supplied by the users, Coraza will also send its Unique ID and the \`status call\u0026rsquo; in the format of headers to the target web server. The following headers are used:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eCoraza-status\u003c/li\u003e
\u003cli\u003eCoraza-unique-id\u003c/li\u003e
\u003cli\u003eCoraza-key\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eThe utilization of SecRemoteRules is only allowed over TLS.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e A valid and trusted digital certificate is expected on the end server. It is also expected that the server uses TLS, preferable TLS 1.2.\u003c/p\u003e
\u003ch2 id="secremoterulesfailaction"\u003eSecRemoteRulesFailAction\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Action that will be taken if SecRemoteRules specify an URL that Coraza was not able to download.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRemoteRulesFailAction Abort|Warn\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRemoteRulesFailAction Abort\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThe default action is to Abort whenever there is a problem downloading a given URL.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e This directive also influences the behaviour of @ipMatchFromFile when used with a HTTPS URI to retrieve the remote file.\u003c/p\u003e
\u003ch2 id="secrequestbodyaccess"\u003eSecRequestBodyAccess\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures whether request bodies will be buffered and processed by Coraza.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRequestBodyAccess On|Off\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRequestBodyAccess On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThis directive is required if you want to inspect the data transported request bodies (e.g., POST parameters). Request buffering is also required in order to make reliable blocking possible. The possible values are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOn:\u003c/strong\u003e buffer request bodies\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOff:\u003c/strong\u003e do not buffer request bodies\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="secrequestbodyinmemorylimit"\u003eSecRequestBodyInMemoryLimit\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the maximum request body size that Coraza will store in memory.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRequestBodyInMemoryLimit LIMIT_IN_BYTES\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRequestBodyInMemoryLimit 131072\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e No\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e 131072 (128 KB)\u003c/p\u003e
\u003cp\u003eWhen a multipart/form-data request is being processed, once the in-memory limit is reached, the request body will start to be streamed into a temporary file on disk.\u003c/p\u003e
\u003ch2 id="secrequestbodylimit"\u003eSecRequestBodyLimit\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the maximum request body size Coraza will accept for buffering.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRequestBodyLimit LIMIT_IN_BYTES\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRequestBodyLimit 134217728\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e 134217728 (131072 KB)\u003c/p\u003e
\u003cp\u003eAnything over the limit will be rejected with status code 413 (Request Entity Too Large). There is a hard limit of 1 GB.\u003c/p\u003e
\u003ch2 id="secrequestbodynofileslimit"\u003eSecRequestBodyNoFilesLimit\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the maximum request body size Coraza will accept for buffering, excluding the size of any files being transported in the request. This directive is useful to reduce susceptibility to DoS attacks when someone is sending request bodies of very large sizes. Web applications that require file uploads must configure SecRequestBodyLimit to a high value, but because large files are streamed to disk, file uploads will not increase memory consumption. However, it’s still possible for someone to take advantage of a large request body limit and send non-upload requests with large body sizes. This directive eliminates that loophole.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRequestBodyNoFilesLimit NUMBER_IN_BYTES\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRequestBodyNoFilesLimit 131072\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e No\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e 1048576 (1 MB)\u003c/p\u003e
\u003cp\u003eGenerally speaking, the default value is not small enough. For most applications, you should be able to reduce it down to 128 KB or lower. Anything over the limit will be rejected with status code 413 (Request Entity Too Large). There is a hard limit of 1 GB.\u003c/p\u003e
\u003ch2 id="secrequestbodylimitaction"\u003eSecRequestBodyLimitAction\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Controls what happens once a request body limit, configured with SecRequestBodyLimit, is encountered\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRequestBodyLimitAction Reject|ProcessPartial\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRequestBodyLimitAction ProcessPartial\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eBy default, Coraza will reject a request body that is longer than specified. This is problematic especially when Coraza is being run in DetectionOnly mode and the intent is to be totally passive and not take any disruptive actions against the transaction. With the ability to choose what happens once a limit is reached, site administrators can choose to inspect only the first part of the request, the part that can fit into the desired limit, and let the rest through. This is not ideal from a possible evasion issue perspective, however it may be acceptable under certain circumstances.\u003c/p\u003e
\u003cp\u003eNote : When the SecRuleEngine is set to DetectionOnly, SecRequestBodyLimitAction is automatically set to ProcessPartial in order to not cause any disruptions. If you want to know if/when a request body size is over your limit, you can create a rule to check for the existence of the INBOUND_ERROR_DATA variable.\u003c/p\u003e
\u003ch2 id="secresponsebodylimit"\u003eSecResponseBodyLimit\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the maximum response body size that will be accepted for buffering.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecResponseBodyLimit LIMIT_IN_BYTES\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecResponseBodyLimit 524228\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e 524288 (512 KB)\u003c/p\u003e
\u003cp\u003eAnything over this limit will be rejected with status code 500 (Internal Server Error). This setting will not affect the responses with MIME types that are not selected for buffering. There is a hard limit of 1 GB.\u003c/p\u003e
\u003ch2 id="secresponsebodylimitaction"\u003eSecResponseBodyLimitAction\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Controls what happens once a response body limit, configured with SecResponseBodyLimit, is encountered.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecResponseBodyLimitAction Reject|ProcessPartial\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecResponseBodyLimitAction ProcessPartial\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eBy default, Coraza will reject a response body that is longer than specified. Some web sites, however, will produce very long responses, making it difficult to come up with a reasonable limit. Such sites would have to raise the limit significantly to function properly, defying the purpose of having the limit in the first place (to control memory consumption). With the ability to choose what happens once a limit is reached, site administrators can choose to inspect only the first part of the response, the part that can fit into the desired limit, and let the rest through. Some could argue that allowing parts of responses to go uninspected is a weakness. This is true in theory, but applies only to cases in which the attacker controls the output (e.g., can make it arbitrary long). In such cases, however, it is not possible to prevent leakage anyway. The attacker could compress, obfuscate, or even encrypt data before it is sent back, and therefore bypass any monitoring device.\u003c/p\u003e
\u003ch2 id="secresponsebodymimetype"\u003eSecResponseBodyMimeType\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures which MIME types are to be considered for response body buffering.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecResponseBodyMimeType MIMETYPE MIMETYPE \u0026hellip;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecResponseBodyMimeType text/plain text/html text/xml\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e text/plain text/html\u003c/p\u003e
\u003cp\u003eMultiple SecResponseBodyMimeType directives can be used to add MIME types. Use SecResponseBodyMimeTypesClear to clear previously configured MIME types and start over.\u003c/p\u003e
\u003ch2 id="secresponsebodymimetypesclear"\u003eSecResponseBodyMimeTypesClear\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Clears the list of MIME types considered for response body buffering, allowing you to start populating the list from scratch.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecResponseBodyMimeTypesClear\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecResponseBodyMimeTypesClear\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003ch2 id="secresponsebodyaccess"\u003eSecResponseBodyAccess\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures whether response bodies are to be buffered.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecResponseBodyAccess On|Off\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecResponseBodyAccess On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e Off\u003c/p\u003e
\u003cp\u003eThis directive is required if you plan to inspect HTML responses and implement response blocking. Possible values are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOn:\u003c/strong\u003e buffer response bodies (but only if the response MIME type matches the list configured with SecResponseBodyMimeType).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOff:\u003c/strong\u003e do not buffer response bodies.\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="secrule"\u003eSecRule\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Creates a rule that will analyze the selected variables using the selected operator.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRule VARIABLES OPERATOR [ACTIONS]\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRule ARGS \u0026ldquo;@rx attack\u0026rdquo; \u0026ldquo;phase:1,log,deny,id:1\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eEvery rule must provide one or more variables along with the operator that should be used to inspect them. If no actions are provided, the default list will be used. (There is always a default list, even if one was not explicitly set with SecDefaultAction.) If there are actions specified in a rule, they will be merged with the default list to form the final actions that will be used. (The actions in the rule will overwrite those in the default list.) Refer to SecDefaultAction for more information.\u003c/p\u003e
\u003ch2 id="secruleengine"\u003eSecRuleEngine\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the rules engine.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleEngine On|Off|DetectionOnly\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleEngine On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e Off\u003c/p\u003e
\u003cp\u003eThe possible values are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOn:\u003c/strong\u003e process rules\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOff:\u003c/strong\u003e do not process rules\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eDetectionOnly:\u003c/strong\u003e process rules but never executes any disruptive actions (block, deny, drop, allow, proxy and redirect)\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="secruleperftime"\u003eSecRulePerfTime\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Set a performance threshold for rules. Rules that spend at least the time defined will be logged into audit log Part H as Rules-Performance-Info in the format id=usec, comma separated.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRulePerfTime USECS\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRulePerfTime 1000\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eThe rules hitting the threshold can be accessed via the collection PERF_RULES.\u003c/p\u003e
\u003ch2 id="secruleremovebyid"\u003eSecRuleRemoveById\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Removes the matching rules from the current configuration context.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleRemoveById ID ID RANGE \u0026hellip;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleRemoveByID 1 2 \u0026ldquo;9000-9010\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Partially, it supports one rule per directive.\u003c/p\u003e
\u003cp\u003eThis directive supports multiple parameters, each of which can be a rule ID or a range. Parameters that contain spaces must be delimited using double quotes.\u003c/p\u003e
\u003cp\u003eNote : This directive must be specified after the rule in which it is disabling. This should be used within local custom rule files that are processed after third party rule sets. Example file - Coraza_crs_60_customrules.conf.\u003c/p\u003e
\u003ch2 id="secruleremovebymsg"\u003eSecRuleRemoveByMsg\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Removes the matching rules from the current configuration context.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleRemoveByMsg REGEX\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleRemoveByMsg \u0026ldquo;FAIL\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eNormally, you would use SecRuleRemoveById to remove rules, but that requires the rules to have IDs defined. If they don’t, then you can remove them with SecRuleRemoveByMsg, which matches a regular expression against rule messages.\u003c/p\u003e
\u003cp\u003eNote : This directive must be specified after the rule in which it is disabling. This should be used within local custom rule files that are processed after third party rule sets.\u003c/p\u003e
\u003ch2 id="secruleremovebytag"\u003eSecRuleRemoveByTag\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Removes the matching rules from the current configuration context.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleRemoveByTag REGEX\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleRemoveByTag \u0026ldquo;WEB_ATTACK/XSS\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eNormally, you would use SecRuleRemoveById to remove rules, but that requires the rules to have IDs defined. If they don’t, then you can remove them with SecRuleRemoveByTag, which matches a regular expression against rule tag data. This is useful if you want to disable entire groups of rules based on tag data. Example tags used in the OWASP Coraza CRS include:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eAUTOMATION/MALICIOUS\u003c/li\u003e
\u003cli\u003eAUTOMATION/MISC\u003c/li\u003e
\u003cli\u003eAUTOMATION/SECURITY_SCANNER\u003c/li\u003e
\u003cli\u003eLEAKAGE/SOURCE_CODE_ASP_JSP\u003c/li\u003e
\u003cli\u003eLEAKAGE/SOURCE_CODE_CF\u003c/li\u003e
\u003cli\u003eLEAKAGE/SOURCE_CODE_PHP\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/CF_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/COMMAND_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/FILE_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/HTTP_RESPONSE_SPLITTING\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/LDAP_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/PHP_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/REQUEST_SMUGGLING\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/SESSION_FIXATION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/SQL_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/SSI_INJECTION\u003c/li\u003e
\u003cli\u003eWEB_ATTACK/XSS\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eNote : This directive must be specified after the rule in which it is disabling. This should be used within local custom rule files that are processed after third party rule sets. Example file - Coraza_crs_60_customrules.conf.\u003c/p\u003e
\u003ch2 id="secruleupdateactionbyid"\u003eSecRuleUpdateActionById\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Updates the action list of the specified rule.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleUpdateActionById RULEID[:offset] ACTIONLIST\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleUpdateActionById 12345 \u0026ldquo;deny,status:403\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI but it\u0026rsquo;s supported by CTL\u003c/p\u003e
\u003cp\u003eThis directive will overwrite the action list of the specified rule with the actions provided in the second parameter. It has two limitations: it cannot be used to change the ID or phase of a rule. Only the actions that can appear only once are overwritten. The actions that are allowed to appear multiple times in a list, will be appended to the end of the list.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS attack \u0026quot;phase:2,id:12345,t:lowercase,log,pass,msg:'Message text'\u0026quot;
SecRuleUpdateActionById 12345 \u0026quot;t:none,t:compressWhitespace,deny,status:403,msg:'New message text'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe effective resulting rule in the previous example will be as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS attack \u0026quot;phase:2,id:12345,t:lowercase,t:none,t:compressWhitespace,deny,status:403,msg:'New Message text'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe addition of t:none will neutralize any previous transformation functions specified (t:lowercase, in the example).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e If the target rule is a chained rule, you must currently specify chain in the SecRuleUpdateActionById action list as well. This will be fixed in a future version.\u003c/p\u003e
\u003ch2 id="secruleupdatetargetbyid"\u003eSecRuleUpdateTargetById\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Updates the target (variable) list of the specified rule.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleUpdateTargetById RULEID TARGET1[,TARGET2,TARGET3] REPLACED_TARGET\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleUpdateTargetById 12345 \u0026ldquo;!ARGS:foo\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI but it\u0026rsquo;s supported by CTL\u003c/p\u003e
\u003cp\u003eThis directive will append (or replace) variables to the current target list of the specified rule with the targets provided in the second parameter.\u003c/p\u003e
\u003cp\u003eExplicitly Appending Targets\u003c/p\u003e
\u003cp\u003eThis is useful for implementing exceptions where you want to externally update a target list to exclude inspection of specific variable(s).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eSecRuleUpdateTargetById 958895 !ARGS:email
The effective resulting rule in the previous example will append the target to the end of the variable list as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/*|!ARGS:email \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote that is is also possible to use regular expressions in the target specification:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRuleUpdateTargetById 981172 \u0026quot;!REQUEST_COOKIES:/^appl1_.*/\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eExplicitly Replacing Targets\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eYou can also entirely replace the target list to something more appropriate for your environment. For example, lets say you want to inspect REQUEST_URI instead of REQUEST_FILENAME, you could do this:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;

SecRuleUpdateTargetById 958895 REQUEST_URI REQUEST_FILENAME
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe effective resulting rule in the previous example replaces the target in the begin of the variable list as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_URI|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : You could also do the same by using the ctl action with the ruleRemoveById directive. That would be useful if you want to only update the targets for a particular URL, thus conditionally appending targets.\u003c/p\u003e
\u003ch2 id="secruleupdatetargetbymsg"\u003eSecRuleUpdateTargetByMsg\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Updates the target (variable) list of the specified rule by rule message.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleUpdateTargetByMsg TEXT TARGET1[,TARGET2,TARGET3] REPLACED_TARGET\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleUpdateTargetByMsg \u0026ldquo;Cross-site Scripting (XSS) Attack\u0026rdquo; \u0026ldquo;!ARGS:foo\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eThis directive will append (or replace) variables to the current target list of the specified rule with the targets provided in the second parameter.\u003c/p\u003e
\u003cp\u003eExplicitly Appending Targets\u003c/p\u003e
\u003cp\u003eThis is useful for implementing exceptions where you want to externally update a target list to exclude inspection of specific variable(s).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;

SecRuleUpdateTargetByMsg \u0026quot;System Command Injection\u0026quot; !ARGS:email
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe effective resulting rule in the previous example will append the target to the end of the variable list as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/*|!ARGS:email \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eExplicitly Replacing Targets
You can also entirely replace the target list to something more appropriate for your environment. For example, lets say you want to inspect REQUEST_URI instead of REQUEST_FILENAME, you could do this:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;

SecRuleUpdateTargetByMsg \u0026quot;System Command Injection\u0026quot; REQUEST_URI REQUEST_FILENAME
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe effective resulting rule in the previous example will append the target to the end of the variable list as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_URI|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="secruleupdatetargetbytag"\u003eSecRuleUpdateTargetByTag\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Updates the target (variable) list of the specified rule by rule tag.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecRuleUpdateTargetByTag TEXT TARGET1[,TARGET2,TARGET3] REPLACED_TARGET\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecRuleUpdateTargetByTag \u0026ldquo;WEB_ATTACK/XSS\u0026rdquo; \u0026ldquo;!ARGS:foo\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eThis directive will append (or replace) variables to the current target list of the specified rule with the targets provided in the second parameter.\u003c/p\u003e
\u003cp\u003eExplicitly Appending Targets\u003c/p\u003e
\u003cp\u003eThis is useful for implementing exceptions where you want to externally update a target list to exclude inspection of specific variable(s).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;

SecRuleUpdateTargetByTag \u0026quot;WASCTC/WASC-31\u0026quot; !ARGS:email
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe effective resulting rule in the previous example will append the target to the end of the variable list as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/*|!ARGS:email \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eExplicitly Replacing Targets\u003c/p\u003e
\u003cp\u003eYou can also entirely replace the target list to something more appropriate for your environment. For example, lets say you want to inspect REQUEST_URI instead of REQUEST_FILENAME, you could do this:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;

SecRuleUpdateTargetByTag \u0026quot;WASCTC/WASC-31\u0026quot; REQUEST_URI REQUEST_FILENAME
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe effective resulting rule in the previous example will append the target to the end of the variable list as follows:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_URI|ARGS_NAMES|ARGS|XML:/* \u0026quot;[\\;\\|\\\`]\\W*?\\bmail\\b\u0026quot; \\
     \u0026quot;phase:2,rev:'2.1.1',capture,t:none,t:htmlEntityDecode,t:compressWhitespace,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'958895',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%
{tx.0}\u0026quot;\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="secunicodemap"\u003eSecUnicodeMap\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Defines which Unicode code point will be used by the urlDecodeUni transformation function during normalization.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecUnicodeMap CODEPOINT\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecUnicodeMapFile 20127\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003ch2 id="secuploaddir"\u003eSecUploadDir\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the directory where intercepted files will be stored.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecUploadDir /path/to/dir\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecUploadDir /tmp\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThis directory must be on the same filesystem as the temporary directory defined with SecTmpDir. This directive is used with SecUploadKeepFiles.\u003c/p\u003e
\u003ch2 id="secuploadfilelimit"\u003eSecUploadFileLimit\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the maximum number of file uploads processed in a multipart POST.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecUploadFileLimit number\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecUploadFileLimit 10\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThe default is set to 100 files, but you are encouraged to reduce this value. Any file over the limit will not be extracted and the MULTIPART_FILE_LIMIT_EXCEEDED and MULTIPART_STRICT_ERROR flags will be set. To prevent bypassing any file checks, you must check for one of these flags.\u003c/p\u003e
\u003cp\u003eNote : If the limit is exceeded, the part name and file name will still be recorded in FILES_NAME and FILES, the file size will be recorded in FILES_SIZES, but there will be no record in FILES_TMPNAMES as a temporary file was not created.\u003c/p\u003e
\u003ch2 id="secuploadfilemode"\u003eSecUploadFileMode\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures the mode (permissions) of any uploaded files using an octal mode (as used in chmod).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecUploadFileMode octal_mode|\u0026ldquo;default\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecUploadFileMode 0640\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003eThis feature is not available on operating systems not supporting octal file modes. The default mode (0600) only grants read/write access to the account writing the file. If access from another account is needed (using clamd is a good example), then this directive may be required. However, use this directive with caution to avoid exposing potentially sensitive data to unauthorized users. Using the value \u0026ldquo;default\u0026rdquo; will revert back to the default setting.\u003c/p\u003e
\u003cp\u003eNote : The process umask may still limit the mode if it is being more restrictive than the mode set using this directive.\u003c/p\u003e
\u003ch2 id="secuploadkeepfiles"\u003eSecUploadKeepFiles\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Configures whether or not the intercepted files will be kept after transaction is processed.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecUploadKeepFiles On|Off|RelevantOnly\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecUploadKeepFiles On\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eThis directive requires the storage directory to be defined (using SecUploadDir).\u003c/p\u003e
\u003cp\u003ePossible values are:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOn\u003c/strong\u003e - Keep uploaded files.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOff\u003c/strong\u003e - Do not keep uploaded files.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRelevantOnly\u003c/strong\u003e - This will keep only those files that belong to requests that are deemed relevant. \u003cstrong\u003e(Not implemented)\u003c/strong\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="secwebappid"\u003eSecWebAppId\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Creates an application namespace, allowing for separate persistent session and user storage.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e SecWebAppId \u0026ldquo;NAME\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e SecWebAppId \u0026ldquo;WebApp1\u0026rdquo;\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e Yes\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDefault:\u003c/strong\u003e default\u003c/p\u003e
\u003cp\u003eApplication namespaces are used to avoid collisions between session IDs and user IDs when multiple applications are deployed on the same server. If it isn’t used, a collision between session IDs might occur.\u003c/p\u003e
`}).add({id:1,href:"https://coraza.io/docs/seclang/actions/",title:"Actions",description:"...",content:`\u003cp\u003eEach action belongs to one of five groups:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eDisruptive actions - Cause Coraza to do something. In many cases something means block transaction, but not in all. For example, the allow action is classified as a disruptive action, but it does the opposite of blocking. There can only be one disruptive action per rule (if there are multiple disruptive actions present, or inherited, only the last one will take effect), or rule chain (in a chain, a disruptive action can only appear in the first rule).\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eNote : Disruptive actions will NOT be executed if the SecRuleEngine is set to DetectionOnly. If you are creating exception/whitelisting rules that use the allow action, you should also add the ctl:ruleEngine=On action to execute the action.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eNon-disruptive actions - Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.\u003c/li\u003e
\u003cli\u003eFlow actions - These actions affect the rule flow (for example skip or skipAfter).\u003c/li\u003e
\u003cli\u003eMeta-data actions - Meta-data actions are used to provide more information about rules. Examples include id, rev, severity and msg.\u003c/li\u003e
\u003cli\u003eData actions - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="accuracy"\u003eaccuracy\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Specifies the relative accuracy level of the rule related to false positives/negatives. The value is a string based on a numeric scale (1-9 where 9 is very strong and 1 has many false positives).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;\\bgetparentfolder\\b\u0026quot; \\
	\u0026quot;phase:2,ver:'CRS/2.2.4,accuracy:'9',maturity:'9',capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \\
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="allow"\u003eallow\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Stops rule processing on a successful match and allows the transaction to proceed.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Allow unrestricted access from 192.168.1.100 
SecRule REMOTE_ADDR \u0026quot;^192\\.168\\.1\\.100\$\u0026quot; phase:1,id:95,nolog,allow
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003ePrior to Coraza 2.5 the allow action would only affect the current phase. An allow in phase 1 would skip processing the remaining rules in phase 1 but the rules from phase 2 would execute. Starting with v2.5.0 allow was enhanced to allow for fine-grained control of what is done. The following rules now apply:\u003c/p\u003e
\u003cp\u003eIf used one its own, like in the example above, allow will affect the entire transaction, stopping processing of the current phase but also skipping over all other phases apart from the logging phase. (The logging phase is special; it is designed to always execute.)
If used with parameter \u0026ldquo;phase\u0026rdquo;, allow will cause the engine to stop processing the current phase. Other phases will continue as normal.
If used with parameter \u0026ldquo;request\u0026rdquo;, allow will cause the engine to stop processing the current phase. The next phase to be processed will be phase RESPONSE_HEADERS.
Examples:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Do not process request but process response.
SecAction phase:1,allow:request,id:96

# Do not process transaction (request and response).
SecAction phase:1,allow,id:97
If you want to allow a response through, put a rule in phase RESPONSE_HEADERS and simply use allow on its own:

# Allow response through.
SecAction phase:3,allow,id:98
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="append"\u003eappend\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Appends text given as parameter to the end of response body. Content injection must be en- abled (using the SecContentInjection directive). No content type checks are made, which means that before using any of the content injection actions, you must check whether the content type of the response is adequate for injection.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eProcessing Phases:\u003c/strong\u003e 3 and 4.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_CONTENT_TYPE \u0026quot;^text/html\u0026quot; \u0026quot;nolog,id:99,pass,append:'\u0026lt;hr\u0026gt;Footer'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eWarning : Although macro expansion is allowed in the additional content, you are strongly cau- tioned against inserting user-defined data fields into output. Doing so would create a cross-site scripting vulnerability.\u003c/p\u003e
\u003ch2 id="auditlog"\u003eauditlog\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Marks the transaction for logging in the audit log.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eSecRule REMOTE_ADDR \u0026ldquo;^192.168.1.100\$\u0026rdquo; auditlog,phase:1,id:100,allow\u003c/p\u003e
\u003cp\u003eNote : The auditlog action is now explicit if log is already specified.\u003c/p\u003e
\u003ch2 id="block"\u003eblock\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Performs the disruptive action defined by the previous SecDefaultAction.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003eThis action is essentially a placeholder that is intended to be used by rule writers to request a blocking action, but without specifying how the blocking is to be done. The idea is that such decisions are best left to rule users, as well as to allow users, to override blocking if they so desire. In future versions of Coraza, more control and functionality will be added to define \u0026ldquo;how\u0026rdquo; to block.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExamples:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Specify how blocking is to be done 
SecDefaultAction phase:2,deny,id:101,status:403,log,auditlog

# Detect attacks where we want to block 
SecRule ARGS attack1 phase:2,block,id:102

# Detect attacks where we want only to warn 
SecRule ARGS attack2 phase:2,pass,id:103
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIt is possible to use the SecRuleUpdateActionById directive to override how a rule handles blocking. This is useful in three cases:\u003c/p\u003e
\u003col\u003e
\u003cli\u003eIf a rule has blocking hard-coded, and you want it to use the policy you determine\u003c/li\u003e
\u003cli\u003eIf a rule was written to block, but you want it to only warn\u003c/li\u003e
\u003cli\u003eIf a rule was written to only warn, but you want it to block\u003c/li\u003e
\u003c/ol\u003e
\u003cp\u003eThe following example demonstrates the first case, in which the hard-coded block is removed in favor of the user-controllable block:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Specify how blocking is to be done 
SecDefaultAction phase:2,deny,status:403,log,auditlog,id:104

# Detect attacks and block 
SecRule ARGS attack1 phase:2,id:1,deny

# Change how rule ID 1 blocks 
SecRuleUpdateActionById 1 block
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="capture"\u003ecapture\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: When used together with the regular expression operator (@rx), the capture action will create copies of the regular expression captures and place them into the transaction variable collection.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_BODY \u0026quot;^username=(\\w{25,})\u0026quot; phase:2,capture,t:none,chain,id:105
  SecRule TX:1 \u0026quot;(?:(?:a(dmin|nonymous)))\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eUp to 10 captures will be copied on a successful pattern match, each with a name consisting of a digit from 0 to 9. The TX.0 variable always contains the entire area that the regular expression matched. All the other variables contain the captured values, in the order in which the capturing parentheses appear in the regular expression.\u003c/p\u003e
\u003cp\u003e**This action is being forced by now, it might be reused in the future)\u003c/p\u003e
\u003ch2 id="chain"\u003echain\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Chains the current rule with the rule that immediately follows it, creating a rule chain. Chained rules allow for more complex processing logic.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Flow\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Refuse to accept POST requests that do not contain Content-Length header. 
# (Do note that this rule should be preceded by a rule 
# that verifies only valid request methods are used.) 
SecRule REQUEST_METHOD \u0026quot;^POST\$\u0026quot; phase:1,chain,t:none,id:105
  SecRule \u0026amp;REQUEST_HEADERS:Content-Length \u0026quot;@eq 0\u0026quot; t:none
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : Rule chains allow you to simulate logical AND. The disruptive actions specified in the first portion of the chained rule will be triggered only if all of the variable checks return positive hits. If any one aspect of a chained rule comes back negative, then the entire rule chain will fail to match. Also note that disruptive actions, execution phases, metadata actions (id, rev, msg, tag, severity, logdata), skip, and skipAfter actions can be specified only by the chain starter rule.
The following directives can be used in rule chains:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eSecAction\u003c/li\u003e
\u003cli\u003eSecRule\u003c/li\u003e
\u003cli\u003eSecRuleScript\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eSpecial rules control the usage of actions in chained rules:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eAny actions that affect the rule flow (i.e., the disruptive actions, skip and skipAfter) can be used only in the chain starter. They will be executed only if the entire chain matches.\u003c/li\u003e
\u003cli\u003eNon-disruptive rules can be used in any rule; they will be executed if the rule that contains them matches and not only when the entire chain matches.\u003c/li\u003e
\u003cli\u003eThe metadata actions (e.g., id, rev, msg) can be used only in the chain starter.
ctl\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Changes Coraza configuration on transient, per-transaction basis. Any changes made using this action will affect only the transaction in which the action is executed. The default configuration, as well as the other transactions running in parallel, will be unaffected.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Parse requests with Content-Type \u0026quot;text/xml\u0026quot; as XML 
SecRule REQUEST_CONTENT_TYPE ^text/xml \u0026quot;nolog,pass,id:106,ctl:requestBodyProcessor=XML\u0026quot;

# white-list the user parameter for rule #981260 when the REQUEST_URI is /index.php
SecRule REQUEST_URI \u0026quot;@beginsWith /index.php\u0026quot; \u0026quot;phase:1,t:none,pass, \\
  nolog,ctl:ruleRemoveTargetById=981260;ARGS:user
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe following configuration options are supported:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eauditEngine\u003c/li\u003e
\u003cli\u003eauditLogParts\u003c/li\u003e
\u003cli\u003edebugLogLevel\u003c/li\u003e
\u003cli\u003eforceRequestBodyVariable\u003c/li\u003e
\u003cli\u003erequestBodyAccess\u003c/li\u003e
\u003cli\u003erequestBodyLimit\u003c/li\u003e
\u003cli\u003erequestBodyProcessor\u003c/li\u003e
\u003cli\u003eresponseBodyAccess\u003c/li\u003e
\u003cli\u003eresponseBodyLimit\u003c/li\u003e
\u003cli\u003eruleEngine\u003c/li\u003e
\u003cli\u003eruleRemoveById - since this action us triggered at run time, it should be specified before the rule in which it is disabling.\u003c/li\u003e
\u003cli\u003eruleRemoveByMsg\u003c/li\u003e
\u003cli\u003eruleRemoveByTag\u003c/li\u003e
\u003cli\u003eruleRemoveTargetById - since this action is used to just remove targets, users don\u0026rsquo;t need to use the char ! before the target list.
ruleRemoveTargetByMsg - since this action is used to just remove targets, users don\u0026rsquo;t need to use the char ! before the target list.\u003c/li\u003e
\u003cli\u003eruleRemoveTargetByTag - since this action is used to just remove targets, users don\u0026rsquo;t need to use the char ! before the target list.\u003c/li\u003e
\u003cli\u003ehashEngine (\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI)\u003c/li\u003e
\u003cli\u003ehashEnforcement (\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI)\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eWith the exception of the requestBodyProcessor and forceRequestBodyVariable settings, each configuration option corresponds to one configuration directive and the usage is identical.\u003c/p\u003e
\u003cp\u003eThe requestBodyProcessor option allows you to configure the request body processor. By default, Coraza will use the URLENCODED and MULTIPART processors to process an application/x-www-form-urlencoded and a multipart/form-data body, respectively. Other two processors are also supported: JSON and XML, but they are never used implicitly. Instead, you must tell Coraza to use it by placing a few rules in the REQUEST_HEADERS processing phase. After the request body is processed as XML, you will be able to use the XML-related features to inspect it.\u003c/p\u003e
\u003cp\u003eRequest body processors will not interrupt a transaction if an error occurs during parsing. Instead, they will set the variables REQBODY_PROCESSOR_ERROR and REQBODY_PROCESSOR_ERROR_MSG. These variables should be inspected in the REQUEST_BODY phase and an appropriate action taken. The forceRequestBodyVariable option allows you to configure the REQUEST_BODY variable to be set when there is no request body processor configured. This allows for inspection of request bodies of unknown types.\u003c/p\u003e
\u003ch2 id="deny"\u003edeny\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Stops rule processing and intercepts transaction.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e \u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;nikto\u0026quot; \u0026quot;log,deny,id:107,msg:'Nikto Scanners Identified'\u0026quot;\u003c/code\u003e\u003c/p\u003e
\u003ch2 id="drop"\u003edrop\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Initiates an immediate close of the TCP connection by sending a FIN packet.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e The following example initiates an IP collection for tracking Basic Authentication attempts. If the client goes over the threshold of more than 25 attempts in 2 minutes, it will DROP subsequent connections.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction phase:1,id:109,initcol:ip=%{REMOTE_ADDR},nolog
SecRule ARGS:login \u0026quot;!^\$\u0026quot; \u0026quot;nolog,phase:1,id:110,setvar:ip.auth_attempt=+1,deprecatevar:ip.auth_attempt=25/120\u0026quot;
SecRule IP:AUTH_ATTEMPT \u0026quot;@gt 25\u0026quot; \u0026quot;log,drop,phase:1,id:111,msg:'Possible Brute Force Attack'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e This action depends on each implementation, the server is instructed to drop the connection.\u003c/p\u003e
\u003cp\u003eThis action is extremely useful when responding to both Brute Force and Denial of Service attacks in that, in both cases, you want to minimize both the network bandwidth and the data returned to the client. This action causes error message to appear in the log \u0026ldquo;(9)Bad file descriptor: core_output_filter: writing data to the network\u0026rdquo;\u003c/p\u003e
\u003ch2 id="exec"\u003eexec\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Executes an external script/binary supplied as parameter.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Run external program on rule match 
SecRule REQUEST_URI \u0026quot;^/cgi-bin/script\\.pl\u0026quot; \u0026quot;phase:2,id:112,t:none,t:lowercase,t:normalizePath,block,\\ exec:/usr/local/apache/bin/test.sh\u0026quot;

# Run Lua script on rule match 
SecRule ARGS:p attack \u0026quot;phase:2,id:113,block,exec:/usr/local/apache/conf/exec.lua\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe exec action is executed independently from any disruptive actions specified. External scripts will always be called with no parameters. Some transaction information will be placed in environment variables. All the usual CGI environment variables will be there. You should be aware that forking a threaded process results in all threads being replicated in the new process. Forking can therefore incur larger overhead in a multithreaded deployment. The script you execute must write something (anything) to stdout; if it doesn’t, Coraza will assume that the script failed, and will record the failure.\u003c/p\u003e
\u003ch2 id="expirevar"\u003eexpirevar\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Configures a collection variable to expire after the given time period (in seconds).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_COOKIES:JSESSIONID \u0026quot;!^\$\u0026quot; \u0026quot;nolog,phase:1,id:114,pass,setsid:%{REQUEST_COOKIES:JSESSIONID}\u0026quot;
SecRule REQUEST_URI \u0026quot;^/cgi-bin/script\\.pl\u0026quot; \u0026quot;phase:2,id:115,t:none,t:lowercase,t:normalizePath,log,allow,setvar:session.suspicious=1,expirevar:session.suspicious=3600,phase:1\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eYou should use the expirevar actions at the same time that you use setvar actions in order to keep the intended expiration time. If they are used on their own (perhaps in a SecAction directive), the expire time will be reset.\u003c/p\u003e
\u003ch2 id="id"\u003eid\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Assigns a unique ID to the rule or chain in which it appears. This action is mandatory and must be numeric.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \u0026quot;log,id:60008,severity:2,msg:'Request Missing a Host Header'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The id action is required for all SecRule/SecAction.\u003c/p\u003e
\u003ch2 id="initcol"\u003einitcol\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Initializes a named persistent collection, either by loading data from storage or by creating a new collection in memory.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e The following example initiates IP address tracking, which is best done in phase 1:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction phase:1,id:116,nolog,pass,initcol:ip=%{REMOTE_ADDR}
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eCollections are loaded into memory on-demand, when the initcol action is executed. A collection will be persisted only if a change was made to it in the course of transaction processing.\u003c/p\u003e
\u003cp\u003eSee the \u0026ldquo;Persistent Storage\u0026rdquo; section for further details.\u003c/p\u003e
\u003ch2 id="log"\u003elog\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Indicates that a successful match of the rule needs to be logged.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction phase:1,id:117,pass,initcol:ip=%{REMOTE_ADDR},log
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis action will log matches to the Apache error log file and the Coraza audit log.\u003c/p\u003e
\u003ch2 id="logdata"\u003elogdata\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Logs a data fragment as part of the alert message.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS:p \u0026quot;@rx \u0026lt;script\u0026gt;\u0026quot; \u0026quot;phase:2,id:118,log,pass,logdata:%{MATCHED_VAR}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe logdata information appears in the error and/or audit log files. Macro expansion is performed, so you may use variable names such as %{TX.0} or %{MATCHED_VAR}. The information is properly escaped for use with logging of binary data.\u003c/p\u003e
\u003ch2 id="maturity"\u003ematurity\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Specifies the relative maturity level of the rule related to the length of time a rule has been public and the amount of testing it has received. The value is a string based on a numeric scale (1-9 where 9 is extensively tested and 1 is a brand new experimental rule).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;\\bgetparentfolder\\b\u0026quot; \\
	\u0026quot;phase:2,ver:'CRS/2.2.4,accuracy:'9',maturity:'9',capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \\
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="msg"\u003emsg\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Assigns a custom message to the rule or chain in which it appears. The message will be logged along with every alert.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \u0026quot;log,id:60008,severity:2,msg:'Request Missing a Host Header'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The msg information appears in the error and/or audit log files and is not sent back to the client in response headers.\u003c/p\u003e
\u003ch2 id="multimatch"\u003emultiMatch\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: If enabled, Coraza will perform multiple operator invocations for every target, before and after every anti-evasion transformation is performed.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS \u0026quot;attack\u0026quot; \u0026quot;phase1,log,deny,id:119,t:removeNulls,t:lowercase,multiMatch\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNormally, variables are inspected only once per rule, and only after all transformation functions have been completed. With multiMatch, variables are checked against the operator before and after every transformation function that changes the input.\u003c/p\u003e
\u003ch2 id="noauditlog"\u003enoauditlog\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Indicates that a successful match of the rule should not be used as criteria to determine whether the transaction should be logged to the audit log.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; allow,noauditlog,id:120
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIf the SecAuditEngine is set to On, all of the transactions will be logged. If it is set to RelevantOnly, then you can control the logging with the noauditlog action.\u003c/p\u003e
\u003cp\u003eThe noauditlog action affects only the current rule. If you prevent audit logging in one rule only, a match in another rule will still cause audit logging to take place. If you want to prevent audit logging from taking place, regardless of whether any rule matches, use ctl:auditEngine=Off.\u003c/p\u003e
\u003ch2 id="nolog"\u003enolog\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prevents rule matches from appearing in both the error and audit logs.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; allow,nolog,id:121
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eAlthough nolog implies noauditlog, you can override the former by using nolog,auditlog.\u003c/p\u003e
\u003ch2 id="pass"\u003epass\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Continues processing with the next rule in spite of a successful match.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; \u0026quot;log,pass,id:122\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eWhen using pass with a SecRule with multiple targets, all variables will be inspected and all non-disruptive actions trigger for every match. In the following example, the TX.test variable will be incremented once for every request parameter:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Set TX.test to zero 
SecAction \u0026quot;phase:2,nolog,pass,setvar:TX.test=0,id:123\u0026quot;

# Increment TX.test for every request parameter 
SecRule ARGS \u0026quot;test\u0026quot; \u0026quot;phase:2,log,pass,setvar:TX.test=+1,id:124\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="pause"\u003epause\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Pauses transaction processing for the specified number of milliseconds. This feature also supports macro expansion.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; \u0026quot;log,pause:5000,id:125\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eWarning : This feature can be of limited benefit for slowing down brute force authentication attacks, but use with care. If you are under a denial of service attack, the pause feature may make matters worse, as it will cause an entire Apache worker (process or thread, depending on the deployment mode) to sit idle until the pause is completed.\u003c/p\u003e
\u003ch2 id="phase"\u003ephase\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Places the rule or chain into one of five available processing phases. It can also be used in SecDefaultAction to establish the rule defaults.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Initialize IP address tracking in phase 1
SecAction phase:1,nolog,pass,id:126,initcol:IP=%{REMOTE_ADDR}
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThere are aliases for some phase numbers:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e2 - request\u003c/li\u003e
\u003cli\u003e4 - response\u003c/li\u003e
\u003cli\u003e5 - logging\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; \u0026quot;phase:request,log,deny,id:127\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eWarning : Keep in mind that if you specify the incorrect phase, the variable used in the rule may not yet be available. This could lead to a false negative situation where your variable and operator may be correct, but it misses malicious data because you specified the wrong phase.\u003c/p\u003e
\u003ch2 id="prepend"\u003eprepend\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prepends the text given as parameter to response body. Content injection must be enabled (using the SecContentInjection directive). No content type checks are made, which means that before using any of the content injection actions, you must check whether the content type of the response is adequate for injection.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eProcessing Phases:\u003c/strong\u003e 3 and 4.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_CONTENT_TYPE ^text/html \\ \u0026quot;phase:3,nolog,pass,id:128,prepend:'Header\u0026lt;br\u0026gt;'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eWarning : Although macro expansion is allowed in the injected content, you are strongly cautioned against inserting user defined data fields int output. Doing so would create a cross-site scripting vulnerability.\u003c/p\u003e
\u003ch2 id="proxy"\u003eproxy\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Intercepts the current transaction by forwarding the request to another web server using the proxy backend. The forwarding is carried out transparently to the HTTP client (i.e., there’s no external redirection taking place).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; log,id:129,proxy:http://honeypothost/
SecRule REQUEST_URI \u0026quot;@streq /test.txt\u0026quot; \u0026quot;phase:1,proxy:'http://\$ENV{SERVER_NAME}:\$ENV{SERVER_PORT}/test.txt',id:500005\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eFor this action to work, the implementation must handle the proxy connection after the interruption notification.\u003c/p\u003e
\u003ch2 id="redirect"\u003eredirect\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Intercepts transaction by issuing an external (client-visible) redirection to the given location..\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:User-Agent \u0026quot;Test\u0026quot; \u0026quot;phase:1,id:130,log,redirect:http://www.example.com/failed.html\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIf the status action is present on the same rule, and its value can be used for a redirection (i.e., is one of the following: 301, 302, 303, or 307), the value will be used for the redirection status code. Otherwise, status code 302 will be used.\u003c/p\u003e
\u003ch2 id="rev"\u003erev\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Specifies rule revision. It is useful in combination with the id action to provide an indication that a rule has been changed.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;(?:(?:[\\;\\|\\\`]\\W*?\\bcc|\\b(wget|curl))\\b|\\/cc(?:[\\'\\\u0026quot;\\|\\;\\\`\\-\\s]|\$))\u0026quot; \\
	                \u0026quot;phase:2,rev:'2.1.3',capture,t:none,t:normalizePath,t:lowercase,ctl:auditLogParts=+E,block,msg:'System Command Injection',id:'950907',tag:'WEB_ATTACK/COMMAND_INJECTION',tag:'WASCTC/WASC-31',tag:'OWASP_TOP_10/A1',tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.command_injection_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/COMMAND_INJECTION-%{matched_var_name}=%{tx.0},skipAfter:END_COMMAND_INJECTION1\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : This action is used in combination with the id action to allow the same rule ID to be used after changes take place but to still provide some indication the rule changed.\u003c/p\u003e
\u003ch2 id="sanitisearg"\u003esanitiseArg\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prevents sensitive request parameter data from being logged to audit log. Each byte of the named parameter(s) is replaced with an asterisk.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Never log passwords 
SecAction \u0026quot;nolog,phase:2,id:131,sanitiseArg:password,sanitiseArg:newPassword,sanitiseArg:oldPassword\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.\u003c/p\u003e
\u003ch2 id="sanitisematched"\u003esanitiseMatched\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prevents the matched variable (request argument, request header, or response header) from being logged to audit log. Each byte of the named parameter(s) is replaced with an asterisk.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e This action can be used to sanitise arbitrary transaction elements when they match a condition. For example, the example below will sanitise any argument that contains the word password in the name.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS_NAMES password nolog,pass,id:132,sanitiseMatched
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.\u003c/p\u003e
\u003ch2 id="sanitisematchedbytes"\u003esanitiseMatchedBytes\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prevents the matched string in a variable from being logged to audit log. Each or a range of bytes of the named parameter(s) is replaced with an asterisk.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e This action can be used to sanitise arbitrary transaction elements when they match a condition. For example, the example below will sanitise the credit card number.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003esanitiseMatchedBytes \u0026ndash; This would x out only the bytes that matched.\u003c/li\u003e
\u003cli\u003esanitiseMatchedBytes:1/4 \u0026ndash; This would x out the bytes that matched, but keep the first byte and last 4 bytes\u003c/li\u003e
\u003c/ul\u003e
\u003cpre\u003e\u003ccode\u003e# Detect credit card numbers in parameters and 
# prevent them from being logged to audit log 
SecRule ARGS \u0026quot;@verifyCC \\d{13,16}\u0026quot; \u0026quot;phase:2,id:133,nolog,capture,pass,msg:'Potential credit card number in request',sanitiseMatchedBytes\u0026quot;
SecRule RESPONSE_BODY \u0026quot;@verifyCC \\d{13,16}\u0026quot; \u0026quot;phase:4,id:134,t:none,log,capture,block,msg:'Potential credit card number is response body',sanitiseMatchedBytes:0/4\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI. You must use capture action with sanitiseMatchedBytes, so the operator must support capture action. ie: @rx, @verifyCC.\u003c/p\u003e
\u003ch2 id="sanitiserequestheader"\u003esanitiseRequestHeader\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prevents a named request header from being logged to audit log. Each byte of the named request header is replaced with an asterisk..\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e This will sanitise the data in the Authorization header.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;phase:1,nolog,pass,id:135,sanitiseRequestHeader:Authorization\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.\u003c/p\u003e
\u003ch2 id="sanitiseresponseheader"\u003esanitiseResponseHeader\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Prevents a named response header from being logged to audit log. Each byte of the named response header is replaced with an asterisk.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e This will sanitise the Set-Cookie data sent to the client.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;phase:3,nolog,pass,id:136,sanitiseResponseHeader:Set-Cookie\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : The sanitize actions affect only the data as it is logged to audit log. High-level debug logs may contain sensitive data. Apache access log may contain sensitive data placed in the request URI.\u003c/p\u003e
\u003ch2 id="severity"\u003eseverity\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Assigns severity to the rule in which it is used.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_METHOD \u0026quot;^PUT\$\u0026quot; \u0026quot;id:340002,rev:1,severity:CRITICAL,msg:'Restricted HTTP function'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eSeverity values in Coraza follows the numeric scale of syslog (where 0 is the most severe). The data below is used by the OWASP Core Rule Set (CRS):\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003e0 - EMERGENCY\u003c/strong\u003e: is generated from correlation of anomaly scoring data where there is an inbound attack and an outbound leakage.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e1 - ALERT\u003c/strong\u003e: is generated from correlation where there is an inbound attack and an outbound application level error.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e2 CRITICAL\u003c/strong\u003e: Anomaly Score of 5. Is the highest severity level possible without correlation. It is normally generated by the web attack rules (40 level files).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e3 - ERROR\u003c/strong\u003e: Error - Anomaly Score of 4. Is generated mostly from outbound leakage rules (50 level files).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e4 - WARNING\u003c/strong\u003e: Anomaly Score of 3. Is generated by malicious client rules (35 level files).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e5 - NOTICE\u003c/strong\u003e: Anomaly Score of 2. Is generated by the Protocol policy and anomaly files.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e6 - INFO\u003c/strong\u003e\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003e7 - DEBUG\u003c/strong\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eIt is possible to specify severity levels using either the numerical values or the text values, but you should always specify severity levels using the text values, because it is difficult to remember what a number stands for. The use of the numerical values is deprecated as of version 2.5.0 and may be removed in one of the subsequent major updates.\u003c/p\u003e
\u003ch2 id="setuid"\u003esetuid\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Special-purpose action that initializes the USER collection using the username provided as parameter.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS:username \u0026quot;.*\u0026quot; \u0026quot;phase:2,id:137,t:none,pass,nolog,noauditlog,capture,setvar:session.username=%{TX.0},setuid:%{TX.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eAfter initialization takes place, the variable USERID will be available for use in the subsequent rules. This action understands application namespaces (configured using SecWebAppId), and will use one if it is configured.\u003c/p\u003e
\u003ch2 id="setrsc"\u003esetrsc\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Special-purpose action that initializes the RESOURCE collection using a key provided as parameter.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;phase:1,pass,id:3,log,setrsc:'abcd1234'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis action understands application namespaces (configured using SecWebAppId), and will use one if it is configured.\u003c/p\u003e
\u003ch2 id="setsid"\u003esetsid\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Special-purpose action that initializes the SESSION collection using the session token provided as parameter.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Initialise session variables using the session cookie value 
SecRule REQUEST_COOKIES:PHPSESSID !^\$ \u0026quot;nolog,pass,id:138,setsid:%{REQUEST_COOKIES.PHPSESSID}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e After the initialization takes place, the variable SESSION will be available for use in the subsequent rules. This action understands application namespaces (configured using SecWebAppId), and will use one if it is configured.\u003c/p\u003e
\u003cp\u003eSetsid takes an individual variable, not a collection. Variables within an action, such as setsid, use the format [collection].[variable] .\u003c/p\u003e
\u003ch2 id="setenv"\u003esetenv\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Creates, removes, and updates environment variables that can be accessed by the implementation.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003eExamples:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_HEADERS:/Set-Cookie2?/ \u0026quot;(?i:(j?sessionid|(php)?sessid|(asp|jserv|jw)?session[-_]?(id)?|cf(id|token)|sid))\u0026quot; \u0026quot;phase:3,t:none,pass,id:139,nolog,setvar:tx.sessionid=%{matched_var}\u0026quot;
SecRule TX:SESSIONID \u0026quot;!(?i:\\;? ?httponly;?)\u0026quot; \u0026quot;phase:3,id:140,t:none,setenv:httponly_cookie=%{matched_var},pass,log,auditlog,msg:'AppDefect: Missing HttpOnly Cookie Flag.'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cpre\u003e\u003ccode class="language-apache"\u003eHeader set Set-Cookie \u0026quot;%{httponly_cookie}e; HTTPOnly\u0026quot; env=httponly_cookie
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : When used in a chain this action will be execute when an individual rule matches and not the entire chain.\u003c/p\u003e
\u003ch2 id="setvar"\u003esetvar\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Creates, removes, or updates a variable. Variable names are case-insensitive.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003eExamples: To create a variable and set its value to 1 (usually used for setting flags), use: setvar:TX.score\u003c/p\u003e
\u003cp\u003eTo create a variable and initialize it at the same time, use: setvar:TX.score=10\u003c/p\u003e
\u003cp\u003eTo remove a variable, prefix the name with an exclamation mark: setvar:!TX.score\u003c/p\u003e
\u003cp\u003eTo increase or decrease variable value, use + and - characters in front of a numerical value: setvar:TX.score=+5\u003c/p\u003e
\u003cp\u003eExample from OWASP CRS:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;\\bsys\\.user_catalog\\b\u0026quot; \\
		\u0026quot;phase:2,rev:'2.1.3',capture,t:none,t:urlDecodeUni,t:htmlEntityDecode,t:lowercase,t:replaceComments,t:compressWhiteSpace,ctl:auditLogParts=+E, \\
block,msg:'Blind SQL Injection Attack',id:'959517',tag:'WEB_ATTACK/SQL_INJECTION',tag:'WASCTC/WASC-19',tag:'OWASP_TOP_10/A1',tag:'OWASP_AppSensor/CIE1', \\
tag:'PCI/6.5.2',logdata:'%{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.sql_injection_score=+%{tx.critical_anomaly_score}, \\
setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/SQL_INJECTION-%{matched_var_name}=%{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : When used in a chain this action will be executed when an individual rule matches and not the entire chain.This means that\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME \u0026quot;@contains /test.php\u0026quot; \u0026quot;chain,id:7,phase:1,t:none,nolog,setvar:tx.auth_attempt=+1\u0026quot; 
    SecRule ARGS_POST:action \u0026quot;@streq login\u0026quot; \u0026quot;t:none\u0026quot;

\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003ewill increment every time that test.php is visited (regardless of the parameters submitted). If the desired goal is to set the variable only if the entire rule matches, it should be included in the last rule of the chain . For instance:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME \u0026quot;@streq test.php\u0026quot; \u0026quot;chain,id:7,phase:1,t:none,nolog\u0026quot;
    SecRule ARGS_POST:action \u0026quot;@streq login\u0026quot; \u0026quot;t:none,setvar:tx.auth_attempt=+1\u0026quot;

\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="skip"\u003eskip\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Skips one or more rules (or chains) on successful match.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Flow\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Require Accept header, but not from access from the localhost 
SecRule REMOTE_ADDR \u0026quot;^127\\.0\\.0\\.1\$\u0026quot; \u0026quot;phase:1,skip:1,id:141\u0026quot; 

# This rule will be skipped over when REMOTE_ADDR is 127.0.0.1 
SecRule \u0026amp;REQUEST_HEADERS:Accept \u0026quot;@eq 0\u0026quot; \u0026quot;phase:1,id:142,deny,msg:'Request Missing an Accept Header'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe skip action works only within the current processing phase and not necessarily in the order in which the rules appear in the configuration file. If you place a phase 2 rule after a phase 1 rule that uses skip, it will not skip over the phase 2 rule. It will skip over the next phase 1 rule that follows it in the phase.\u003c/p\u003e
\u003ch2 id="skipafter"\u003eskipAfter\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Skips one or more rules (or chains) on a successful match, resuming rule execution with the first rule that follows the rule (or marker created by SecMarker) with the provided ID.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Flow\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e The following rules implement the same logic as the skip example, but using skipAfter:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Require Accept header, but not from access from the localhost 
SecRule REMOTE_ADDR \u0026quot;^127\\.0\\.0\\.1\$\u0026quot; \u0026quot;phase:1,id:143,skipAfter:IGNORE_LOCALHOST\u0026quot; 

# This rule will be skipped over when REMOTE_ADDR is 127.0.0.1 
SecRule \u0026amp;REQUEST_HEADERS:Accept \u0026quot;@eq 0\u0026quot; \u0026quot;phase:1,deny,id:144,msg:'Request Missing an Accept Header'\u0026quot; 
SecMarker IGNORE_LOCALHOST
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eExample from the OWASP CRS:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecMarker BEGIN_HOST_CHECK

	SecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \\
    		\u0026quot;skipAfter:END_HOST_CHECK,phase:2,rev:'2.1.3',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21', \\
tag:'OWASP_TOP_10/A7',tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score}, \\
setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score},setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}\u0026quot;

	SecRule REQUEST_HEADERS:Host \u0026quot;^\$\u0026quot; \\
    		\u0026quot;phase:2,rev:'2.1.3',t:none,block,msg:'Request Missing a Host Header',id:'960008',tag:'PROTOCOL_VIOLATION/MISSING_HEADER_HOST',tag:'WASCTC/WASC-21',tag:'OWASP_TOP_10/A7', \\
tag:'PCI/6.5.10',severity:'5',setvar:'tx.msg=%{rule.msg}',setvar:tx.anomaly_score=+%{tx.notice_anomaly_score},setvar:tx.protocol_violation_score=+%{tx.notice_anomaly_score}, \\
setvar:tx.%{rule.id}-PROTOCOL_VIOLATION/MISSING_HEADER-%{matched_var_name}=%{matched_var}\u0026quot;

SecMarker END_HOST_CHECK
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe skipAfter action works only within the current processing phase and not necessarily the order in which the rules appear in the configuration file. If you place a phase 2 rule after a phase 1 rule that uses skip, it will not skip over the phase 2 rule. It will skip over the next phase 1 rule that follows it in the phase.\u003c/p\u003e
\u003ch2 id="status"\u003estatus\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Specifies the response status code to use with actions deny and redirect.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Deny with status 403
SecDefaultAction \u0026quot;phase:1,log,deny,id:145,status:403\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="t"\u003et\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: This action is used to specify the transformation pipeline to use to transform the value of each variable used in the rule before matching.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Non-disruptive\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS \u0026quot;(asfunction|javascript|vbscript|data|mocha|livescript):\u0026quot; \u0026quot;id:146,t:none,t:htmlEntityDecode,t:lowercase,t:removeNulls,t:removeWhitespace\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eAny transformation functions that you specify in a SecRule will be added to the previous ones specified in SecDefaultAction. It is recommended that you always use t:none in your rules, which prevents them depending on the default configuration.\u003c/p\u003e
\u003ch2 id="tag"\u003etag\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Assigns a tag (category) to a rule or a chain.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;\\bgetparentfolder\\b\u0026quot; \\
	\u0026quot;phase:2,rev:'2.1.3',capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \\
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe tag information appears along with other rule metadata. The purpose of the tagging mechanism to allow easy automated categorization of events. Multiple tags can be specified on the same rule. Use forward slashes to create a hierarchy of categories (as in the example). Tag support Macro Expansions\u003c/p\u003e
\u003ch2 id="ver"\u003ever\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription\u003c/strong\u003e: Specifies the rule set version.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction Group:\u003c/strong\u003e Meta-data\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME|ARGS_NAMES|ARGS|XML:/* \u0026quot;\\bgetparentfolder\\b\u0026quot; \\
	\u0026quot;phase:2,ver:'CRS/2.2.4,capture,t:none,t:htmlEntityDecode,t:compressWhiteSpace,t:lowercase,ctl:auditLogParts=+E,block,msg:'Cross-site Scripting (XSS) Attack',id:'958016',tag:'WEB_ATTACK/XSS',tag:'WASCTC/WASC-8',tag:'WASCTC/WASC-22',tag:'OWASP_TOP_10/A2',tag:'OWASP_AppSensor/IE1',tag:'PCI/6.5.1',logdata:'% \\
{TX.0}',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.xss_score=+%{tx.critical_anomaly_score},setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},setvar:tx.%{rule.id}-WEB_ATTACK/XSS-%{matched_var_name}=%{tx.0}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:2,href:"https://coraza.io/docs/seclang/execution-flow/",title:"Execution flow",description:"Learn how to control Coraza rules execution flow using special directives and actions.",content:`\u003ch2 id="phases"\u003ePhases\u003c/h2\u003e
\u003cp\u003ePhases are an abstract concept designed to fit most web servers execution flows and give it more oportunities to stop a request.\u003c/p\u003e
\u003cfigure\u003e
\u003cimg src="/images/execution_flow.png" style="border-1 img-fluid" data-sizes="auto" width="100%"\u003e
\u003c/figure\u003e
\u003ch3 id="phase-1-request-headers"\u003ePhase 1: Request Headers\u003c/h3\u003e
\u003cp\u003eThis phase will process rules with the following variables:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eHTTP connection data, like IPs, ports and protocol version\u003c/li\u003e
\u003cli\u003eURI and GET arguments\u003c/li\u003e
\u003cli\u003eRequest Headers: cookies, content-type and content-length\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="phase-2-request-body"\u003ePhase 2: Request Body\u003c/h3\u003e
\u003cp\u003eThis phase will process rules with the following variables:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003ePOST arguments\u003c/li\u003e
\u003cli\u003eMultipart arguments and files\u003c/li\u003e
\u003cli\u003eJSON and XML data\u003c/li\u003e
\u003cli\u003eRaw Request Body\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="phase-3-response-headers"\u003ePhase 3: Response Headers\u003c/h3\u003e
\u003cp\u003eThis phase will process rules with the following variables:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eResponse status code\u003c/li\u003e
\u003cli\u003eResponse headers: content-length and content-type\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="phase-4-response-body"\u003ePhase 4: Response Body\u003c/h3\u003e
\u003cp\u003eThis phase will process rules with the following variables:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eRaw Response body\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="phase-5-logging"\u003ePhase 5: Logging\u003c/h3\u003e
\u003cp\u003eThis phase will evaluate phase 5 rules, save persistent collections and write the log entry. This phase is not disruptive and it may run after the response was sent to the client.\u003c/p\u003e
\u003ch2 id="how-rules-are-sorted"\u003eHow rules are sorted\u003c/h2\u003e
\u003cp\u003eRules \u003cstrong\u003eare not\u003c/strong\u003e sorted by id, they are sorted by phase and compilation order. For example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;id:1, phase:3, logdata:'first rule', log\u0026quot;
SecAction \u0026quot;id:150, phase:2, logdata:'second rule', log\u0026quot;
SecAction \u0026quot;id:300, phase: 1, logdata:'third rule', log\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis will evaluate the rules based on it\u0026rsquo;s phase, not it\u0026rsquo;s id, and show the following logdata:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003ethird rule
second rule
third rule
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="secmarkers"\u003eSecmarkers\u003c/h2\u003e
\u003cp\u003e\u003ca href="#"\u003eSecMarker\u003c/a\u003e is a directive that  creates an abstract rule, without rules, operators and actions, that will only work as a placeholder to tell the transaction under which SecMarker we are.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecMarker BEGIN_HOST_CHECK

SecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \u0026quot;phase:1,id:1, pass\u0026quot;
SecRule REQUEST_HEADERS:Host \u0026quot;^\$\u0026quot; \u0026quot;phase:1,id:2, pass\u0026quot;

SecMarker END_HOST_CHECK
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis will \u0026ldquo;mark\u0026rdquo; rules 1 and 2 as BEGIN_HOST_CHECK, which will be used by \u003ca href="#"\u003eskipAfter\u003c/a\u003e action to skip the following rules after the \u0026ldquo;SecMark\u0026rdquo; was reached, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;id:1, phase:1, skipAfter:END_HOST_CHECK\u0026quot;
SecMarker BEGIN_HOST_CHECK

SecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \u0026quot;phase:1,id:2, pass\u0026quot;
SecRule REQUEST_HEADERS:Host \u0026quot;^\$\u0026quot; \u0026quot;phase:1,id:3, pass\u0026quot;

SecMarker END_HOST_CHECK
SecAction \u0026quot;id:4, phase:1, pass\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIn the example above, rules 2 and 3 will be skipped because they are marked as \u003ccode\u003eBEGIN_HOST_CHECK\u003c/code\u003e and not \u003ccode\u003eEND_HOST_CHECK\u003c/code\u003e as expected by \u003ccode\u003eskipAfter\u003c/code\u003e.\u003c/p\u003e
\u003ch2 id="other-flow-controllers"\u003eOther flow controllers\u003c/h2\u003e
\u003cp\u003e\u003ca href="#"\u003eSkip\u003c/a\u003e action can also be used to skip the N following rules, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;id:1,phase:1, skip:1\u0026quot;

# The following rule won't be evaluated
SecAction \u0026quot;id:2\u0026quot;

# This rule will be evaluated
SecAction \u0026quot;id:3\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:3,href:"https://coraza.io/docs/tutorials/introduction/",title:"Introduction",description:"Introduction to Coraza Web Application Firewall. Start protecting your web applications in few steps.",content:`\u003ch1 id="coraza-web-application-firewall-v2"\u003eCoraza Web Application Firewall v2\u003c/h1\u003e
\u003cp\u003e\u003cimg src="https://github.com/jptosso/coraza-waf/actions/workflows/regression.yml/badge.svg" alt="Build Status"\u003e
\u003cimg src="https://github.com/jptosso/coraza-waf/workflows/CodeQL/badge.svg" alt="CodeQL"\u003e
\u003ca href="https://sonarcloud.io/dashboard?id=jptosso_coraza-waf"\u003e\u003cimg src="https://sonarcloud.io/api/project_badges/measure?project=jptosso_coraza-waf\u0026amp;metric=sqale_rating" alt="Maintainability Rating"\u003e\u003c/a\u003e
\u003ca href="https://sonarcloud.io/dashboard?id=jptosso_coraza-waf"\u003e\u003cimg src="https://sonarcloud.io/api/project_badges/measure?project=jptosso_coraza-waf\u0026amp;metric=coverage" alt="Coverage"\u003e\u003c/a\u003e
\u003ca href="https://godoc.org/github.com/jptosso/coraza-waf"\u003e\u003cimg src="https://godoc.org/github.com/jptosso/coraza-waf?status.svg" alt="GoDoc"\u003e\u003c/a\u003e
\u003ca href="https://www.repostatus.org/#active"\u003e\u003cimg src="https://www.repostatus.org/badges/latest/active.svg" alt="Project Status: Active – The project has reached a stable, usable state and is being actively developed."\u003e\u003c/a\u003e\u003c/p\u003e
\u003cdiv align="center"\u003e
	\u003cimg src="https://coraza.io/images/logo.png" width="50%"\u003e
\u003c/div\u003e
Welcome to Coraza Web Application Firewall, this project is an enterprise grade, Golang port of ModSecurity, flexible and powerful enough to serve as the baseline for many projects.
\u003ch2 id="prerequisites"\u003ePrerequisites\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003eLinux distribution (Debian and Centos are recommended, Windows is not supported yet)\u003c/li\u003e
\u003cli\u003eGolang compiler v1.16+\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="migrate-from-v1"\u003eMigrate from v1\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003eRollback SecAuditLog to the legacy syntax (serial/concurrent)\u003c/li\u003e
\u003cli\u003eAttach an error log handler using \u003ccode\u003ewaf.SetErrorLogCb(cb)\u003c/code\u003e (optional)\u003c/li\u003e
\u003cli\u003eIf you are using @detectXSS and @detectSQLi (CRS) install the plugin \u003ca href="https://github.com/jptosso/coraza-libinjection"\u003egithub.com/jptosso/coraza-libinjection\u003c/a\u003e\u003c/li\u003e
\u003cli\u003eIf you are using @rx with libpcre (CRS) install the plugin \u003ca href="https://github.com/jptosso/coraza-pcre"\u003egithub.com/jptosso/coraza-pcre\u003c/a\u003e\u003c/li\u003e
\u003cli\u003eIf you are using low level APIs check the complete changelog as most of them were removed\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="running-the-tests"\u003eRunning the tests\u003c/h2\u003e
\u003cp\u003eRun the go tests:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-sh"\u003ego test ./...
go test -race ./...
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="coraza-v2-differences-with-v1"\u003eCoraza v2 differences with v1\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003eFull internal API refactor, public API has not changed\u003c/li\u003e
\u003cli\u003eFull audit engine refactor with plugins support\u003c/li\u003e
\u003cli\u003eNew enhanced plugins interface for transformations, actions, body processors and operators\u003c/li\u003e
\u003cli\u003eNow we are fully compliant with Seclang from modsecurity v2\u003c/li\u003e
\u003cli\u003eMany features removed and transformed into plugins: XML processing, PCRE regex, Libinjection (@detectXSS and @detectSQLi)\u003c/li\u003e
\u003cli\u003eBetter debug logging\u003c/li\u003e
\u003cli\u003eNew error logging (like modsecurity)\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="your-first-coraza-waf-project"\u003eYour first Coraza WAF project\u003c/h2\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003epackage main
import(
	\u0026quot;fmt\u0026quot;
	\u0026quot;github.com/jptosso/coraza-waf/v2\u0026quot;
	\u0026quot;github.com/jptosso/coraza-waf/v2/seclang\u0026quot;
)

func main() {
	// First we initialize our waf and our seclang parser
	waf := coraza.NewWaf()
	parser, _ := seclang.NewParser(waf)

	// Now we parse our rules
	if err := parser.FromString(\`SecRule REMOTE_ADDR \u0026quot;@rx .*\u0026quot; \u0026quot;id:1,phase:1,deny,status:403\u0026quot;\`); err != nil {
		fmt.Println(err)
	}

	// Then we create a transaction and assign some variables
	tx := waf.NewTransaction()
	tx.ProcessConnection(\u0026quot;127.0.0.1\u0026quot;, 8080, \u0026quot;127.0.0.1\u0026quot;, 12345)

	// Finally we process the request headers phase, which may return an interruption
	if it := tx.ProcessRequestHeaders(); it != nil {
		fmt.Printf(\u0026quot;Transaction was interrupted with status %d\\n\u0026quot;, it.Status)
	}
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="why-coraza-waf"\u003eWhy Coraza WAF?\u003c/h2\u003e
\u003ch3 id="philosophy"\u003ePhilosophy\u003c/h3\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eSimplicity:\u003c/strong\u003e Anyone should be able to understand and modify Coraza WAF\u0026rsquo;s source code\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eExtensibility:\u003c/strong\u003e It should be easy to extend Coraza WAF with new functionalities\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eInnovation:\u003c/strong\u003e Coraza WAF isn\u0026rsquo;t just a ModSecurity port, it must include awesome new functions (in the meantime it\u0026rsquo;s just a port 😅)\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eCommunity:\u003c/strong\u003e Coraza WAF is a community project and everyone\u0026rsquo;s idea will be heard\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="plugins-roadmap"\u003ePlugins roadmap\u003c/h3\u003e
\u003cul\u003e
\u003cli\u003eWASM scripts support\u003c/li\u003e
\u003cli\u003eLua script support\u003c/li\u003e
\u003cli\u003eIntegrated DDOS protection and directives with iptables(Or others) integration\u003c/li\u003e
\u003cli\u003eIntegrated bot detection with captcha\u003c/li\u003e
\u003cli\u003eOpen Policy Agent package (OPA)\u003c/li\u003e
\u003cli\u003eEnhanced data signing features (cookies, forms, etc)\u003c/li\u003e
\u003cli\u003eOpenAPI enforcement\u003c/li\u003e
\u003cli\u003eJWT enforcement\u003c/li\u003e
\u003cli\u003eXML request body processor\u003c/li\u003e
\u003cli\u003eLibinjection integration (done)\u003c/li\u003e
\u003cli\u003eLib PCRE integration (done)\u003c/li\u003e
\u003cli\u003eBluemonday policies (maybe)\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="coraza-waf-implementations"\u003eCoraza WAF implementations\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-caddy"\u003eCaddy Plugin (Reverse Proxy and Web Server)\u003c/a\u003e (Stable)\u003c/li\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-traefik"\u003eTraefik Plugin (Reverse Proxy and Web Server)\u003c/a\u003e (preview)\u003c/li\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-gin"\u003eGin Middleware (Web Framework)\u003c/a\u003e (Preview)\u003c/li\u003e
\u003cli\u003e\u003ca href="#"\u003eBuffalo Plugin (Web Framework)\u003c/a\u003e (soon)\u003c/li\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-server"\u003eCoraza Server (HAPROXY, REST and GRPC)\u003c/a\u003e (experimental)\u003c/li\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-server"\u003eApache httpd\u003c/a\u003e (experimental)\u003c/li\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-server"\u003eNginx\u003c/a\u003e (soon)\u003c/li\u003e
\u003cli\u003e\u003ca href="https://github.com/jptosso/coraza-cexport"\u003eCoraza C Exports\u003c/a\u003e (experimental)\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="some-useful-tools"\u003eSome useful tools\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003e\u003ca href="https://github.com/fzipi/go-ftw"\u003eGo FTW\u003c/a\u003e: rule testing engine\u003c/li\u003e
\u003cli\u003e\u003ca href="https://playground.coraza.io/"\u003eCoraza Playground\u003c/a\u003e: rule testing sandbox with web interface\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="troubleshooting"\u003eTroubleshooting\u003c/h2\u003e
\u003ch2 id="how-to-contribute"\u003eHow to contribute\u003c/h2\u003e
\u003cp\u003eContributions are welcome, there are so many TODOs, also functionalities, fixes, bug reports and any help you can provide. Just send your PR.\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-sh"\u003ecd /path/to/coraza
egrep -Rin \u0026quot;TODO|FIXME\u0026quot; -R --exclude-dir=vendor *
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="useful-links"\u003eUseful links\u003c/h2\u003e
\u003ch2 id="special-thanks"\u003eSpecial thanks\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003eModsecurity team for creating ModSecurity\u003c/li\u003e
\u003cli\u003eOWASP Coreruleset team for the CRS and their help\u003c/li\u003e
\u003cli\u003e@fzipi for his support and help\u003c/li\u003e
\u003cli\u003e@dune73 for the Modsecurity Handbook (The bible for this project) and all of his support\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="companies-using-coraza"\u003eCompanies using Coraza\u003c/h3\u003e
\u003cul\u003e
\u003cli\u003e\u003ca href="https://babiel.com"\u003eBabiel\u003c/a\u003e (supporter)\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="about"\u003eAbout\u003c/h2\u003e
\u003cp\u003eThe name \u003cstrong\u003eCoraza\u003c/strong\u003e is trademarked, \u003cstrong\u003eCoraza\u003c/strong\u003e is a registered trademark of Juan Pablo Tosso.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eAuthor on Twitter \u003ca href="https://twitter.com/jptosso"\u003e@jptosso\u003c/a\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="donations"\u003eDonations\u003c/h2\u003e
\u003cp\u003eFor donations, see \u003ca href="https://www.tosso.io/donate"\u003eDonations site\u003c/a\u003e\u003c/p\u003e
`}).add({id:4,href:"https://coraza.io/docs/reference/logging/",title:"Logging",description:"...",content:`\u003ch2 id="logging-formats"\u003eLogging Formats\u003c/h2\u003e
\u003ch3 id="json"\u003eJSON\u003c/h3\u003e
\u003cp\u003eThis is the core structure data structure used to build any other format:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-json"\u003e{
  \u0026quot;transaction\u0026quot;: {
    \u0026quot;timestamp\u0026quot;: \u0026quot;02/Jan/2006:15:04:20 -0700\u0026quot;,
    \u0026quot;unix_timestamp\u0026quot;: 1629575755,
    \u0026quot;id\u0026quot;: \u0026quot;ABCDEFGHIJKMNLAB\u0026quot;,
    \u0026quot;client_ip\u0026quot;: \u0026quot;127.0.0.1\u0026quot;,
    \u0026quot;client_port\u0026quot;: 54481,
    \u0026quot;host_ip\u0026quot;: \u0026quot;127.0.0.1\u0026quot;,
    \u0026quot;host_port\u0026quot;: 80,
    \u0026quot;server_id\u0026quot;: \u0026quot;something\u0026quot;,
    \u0026quot;request\u0026quot;: {
      \u0026quot;method\u0026quot;: \u0026quot;POST\u0026quot;,
      \u0026quot;uri\u0026quot;: \u0026quot;/something.php\u0026quot;,
      \u0026quot;http_version\u0026quot;: \u0026quot;1.1\u0026quot;,
      \u0026quot;body\u0026quot;: \u0026quot;some-body=with-values\u0026quot;,
      \u0026quot;headers\u0026quot;: {
        \u0026quot;Content-Type\u0026quot;: [\u0026quot;application/x-www-form-urlencoded\u0026quot;],
        \u0026quot;Accept\u0026quot;: [\u0026quot;text/html\u0026quot;]
      },
      \u0026quot;files\u0026quot;: [{
        \u0026quot;name\u0026quot;: \u0026quot;filename.pdf\u0026quot;,
        \u0026quot;size\u0026quot;: 1024,
        \u0026quot;mime\u0026quot;: \u0026quot;application/pdf\u0026quot;
      }]
    },
    \u0026quot;response\u0026quot;: {
      \u0026quot;status\u0026quot;: 200,
      \u0026quot;headers\u0026quot;: {
        \u0026quot;Set-Cookie\u0026quot;: [\u0026quot;somecookie=forever; Secure\u0026quot;, \u0026quot;someothercookie=wow\u0026quot;],
        \u0026quot;Content-Type\u0026quot;: [\u0026quot;text/html\u0026quot;]
      }
    },
    \u0026quot;producer\u0026quot;: {
      \u0026quot;connector\u0026quot;: \u0026quot;github.com/jptosso/coraza-caddy\u0026quot;,
      \u0026quot;version\u0026quot;: \u0026quot;1.0\u0026quot;,
      \u0026quot;server\u0026quot;: \u0026quot;Caddy 2\u0026quot;,
      \u0026quot;rule_engine\u0026quot;: \u0026quot;CORERULESET/3.3\u0026quot;,
      \u0026quot;stopwatch\u0026quot;: \u0026quot;1417762077443733 384389; combined=20536, p1=354, p2=2901, p3=11, p4=16692, p5=578, sr=72, sw=0, l=0, gc=0\u0026quot;
    }
  },
  \u0026quot;messages\u0026quot;: [{
    \u0026quot;actionset\u0026quot;: \u0026quot;Warning\u0026quot;,
    \u0026quot;message\u0026quot;: \u0026quot;Pattern match \\\u0026quot;\\\\\\\\\u0026lt; ?script\\\\\\\\b\\\u0026quot; at ARGS_NAMES:\u0026lt;script.\u0026quot;,
    \u0026quot;data\u0026quot;: {
	    \u0026quot;file\u0026quot;: \u0026quot;/etc/coraza/crs/rules.conf\u0026quot;,
	    \u0026quot;line\u0026quot;: 4485,
	    \u0026quot;id\u0026quot;: 100521,
	    \u0026quot;rev\u0026quot;: \u0026quot;1\u0026quot;,
	    \u0026quot;msg\u0026quot;: \u0026quot;some message\u0026quot;,
	    \u0026quot;data\u0026quot;: \u0026quot;some logdata\u0026quot;,
	    \u0026quot;severity\u0026quot;: 5,
	    \u0026quot;ver\u0026quot;: \u0026quot;OWASP_CRS\\/3\u0026quot;,
	    \u0026quot;maturity\u0026quot;: 10,
	    \u0026quot;accuracy\u0026quot;: 10,
	    \u0026quot;tags\u0026quot;: [\u0026quot;some-tag\u0026quot;, \u0026quot;more-tags\u0026quot;]
    }
  }]
}
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:5,href:"https://coraza.io/docs/seclang/operators/",title:"Operators",description:"...",content:`\u003cp\u003eThis section documents the operators currently available in Coraza.\u003c/p\u003e
\u003ch2 id="beginswith"\u003ebeginsWith\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Returns true if the parameter string is found at the beginning of the input. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect request line that does not begin with \u0026quot;GET\u0026quot; 
SecRule REQUEST_LINE \u0026quot;!@beginsWith GET\u0026quot; \u0026quot;id:149\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="contains"\u003econtains\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Returns true if the parameter string is found anywhere in the input. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect \u0026quot;.php\u0026quot; anywhere in the request line 
SecRule REQUEST_LINE \u0026quot;@contains .php\u0026quot; \u0026quot;id:150\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="containsword"\u003econtainsWord\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Returns true if the parameter string (with word boundaries) is found anywhere in the input. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect \u0026quot;select\u0026quot; anywhere in ARGS 
SecRule ARGS \u0026quot;@containsWord select\u0026quot; \u0026quot;id:151\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eWould match on -
-1 union select BENCHMARK(2142500,MD5(CHAR(115,113,108,109,97,112))) FROM wp_users WHERE ID=1 and (ascii(substr(user_login,1,1))\u0026amp;0x01=0) from wp_users where ID=1\u0026ndash;\u003c/p\u003e
\u003cp\u003eBut not on -
Your site has a wide selection of computers.\u003c/p\u003e
\u003ch2 id="endswith"\u003eendsWith\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Returns true if the parameter string is found at the end of the input. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect request line that does not end with \u0026quot;HTTP/1.1\u0026quot; 
SecRule REQUEST_LINE \u0026quot;!@endsWith HTTP/1.1\u0026quot; \u0026quot;id:152\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="fuzzyhash"\u003efuzzyHash\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e The fuzzyHash operator uses the ssdeep, which is a program for computing context triggered piecewise hashes (CTPH). Also called fuzzy hashes, CTPH can match inputs that have homologies. Such inputs have sequences of identical bytes in the same order, although bytes in between these sequences may be different in both content and length.\u003c/p\u003e
\u003cp\u003eFor further information on ssdeep, visit its site: http://ssdeep.sourceforge.net/\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_BODY \u0026quot;\\@fuzzyHash /path/to/ssdeep/hashes.txt 6\u0026quot; \u0026quot;id:192372,log,deny\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="eq"\u003eeq\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs numerical comparison and returns true if the input value is equal to the provided parameter. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect exactly 15 request headers 
SecRule \u0026amp;REQUEST_HEADERS_NAMES \u0026quot;@eq 15\u0026quot; \u0026quot;id:153\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.\u003c/p\u003e
\u003ch2 id="ge"\u003ege\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs numerical comparison and returns true if the input value is greater than or equal to the provided parameter. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect 15 or more request headers 
SecRule \u0026amp;REQUEST_HEADERS_NAMES \u0026quot;@ge 15\u0026quot; \u0026quot;id:154\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.\u003c/p\u003e
\u003ch2 id="geolookup"\u003egeoLookup\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a geolocation lookup using the IP address in input against the geolocation database previously configured using SecGeoLookupDb. If the lookup is successful, the obtained information is captured in the GEO collection.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e The geoLookup operator matches on success and is thus best used in combination with nolog,pass. If you wish to block on a failed lookup (which may be over the top, depending on how accurate the geolocation database is), the following example demonstrates how best to do it:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Configure geolocation database 
SecGeoLookupDb /path/to/GeoLiteCity.dat 
... 
# Lookup IP address 
SecRule REMOTE_ADDR \u0026quot;@geoLookup\u0026quot; \u0026quot;phase:1,id:155,nolog,pass\u0026quot;

# Block IP address for which geolocation failed
SecRule \u0026amp;GEO \u0026quot;@eq 0\u0026quot; \u0026quot;phase:1,id:156,deny,msg:'Failed to lookup IP'\u0026quot;
See the GEO variable for an example and more information on various fields available.
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports the \u0026ldquo;capture\u0026rdquo; action.\u003c/p\u003e
\u003ch2 id="gt"\u003egt\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs numerical comparison and returns true if the input value is greater than the operator parameter. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect more than 15 headers in a request 
SecRule \u0026amp;REQUEST_HEADERS_NAMES \u0026quot;@gt 15\u0026quot; \u0026quot;id:158\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.
inspectFile\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Executes an external program for every variable in the target list. The contents of the variable is provided to the script as the first parameter on the command line. The program must be specified as the first parameter to the operator. As of version 2.5.0, if the supplied program filename is not absolute, it is treated as relative to the directory in which the configuration file resides. Also as of version 2.5.0, if the filename is determined to be a Lua script (based on its .lua extension), the script will be processed by the internal Lua engine. Internally processed scripts will often run faster (there is no process creation overhead) and have full access to the transaction context of Coraza.\u003c/p\u003e
\u003cp\u003eThe @inspectFile operator was initially designed for file inspection (hence the name), but it can also be used in any situation that requires decision making using external logic.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e#!/usr/bin/perl
#
# runav.pl
# Copyright (c) 2004-2011 Trustwave
#
# This script is an interface between Coraza and its
# ability to intercept files being uploaded through the
# web server, and ClamAV


\$CLAMSCAN = \u0026quot;clamscan\u0026quot;;

if (\$#ARGV != 0) {
    print \u0026quot;Usage: runav.pl \u0026lt;filename\u0026gt;\\n\u0026quot;;
    exit;
}

my (\$FILE) = shift @ARGV;

\$cmd = \u0026quot;\$CLAMSCAN --stdout --no-summary \$FILE\u0026quot;;
\$input = \`\$cmd\`;
\$input =~ m/^(.+)/;
\$error_message = \$1;

\$output = \u0026quot;0 Unable to parse clamscan output [\$1]\u0026quot;;

if (\$error_message =~ m/: Empty file\\.?\$/) {
    \$output = \u0026quot;1 empty file\u0026quot;;
}
elsif (\$error_message =~ m/: (.+) ERROR\$/) {
    \$output = \u0026quot;0 clamscan: \$1\u0026quot;;
}
elsif (\$error_message =~ m/: (.+) FOUND\$/) {
    \$output = \u0026quot;0 clamscan: \$1\u0026quot;;
}
elsif (\$error_message =~ m/: OK\$/) {
    \$output = \u0026quot;1 clamscan: OK\u0026quot;;
}

print \u0026quot;\$output\\n\u0026quot;;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e Using the runav.pl script:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Execute external program to validate uploaded files 
SecRule FILES_TMPNAMES \u0026quot;@inspectFile /path/to/util/runav.pl\u0026quot; \u0026quot;id:159\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Coraza will not fill the FILES_TMPNAMES variable unless SecTmpSaveUploadedFiles directive is On, or the SecUploadKeepFiles directive is set to RelevantOnly.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Use @inspectFile with caution. It may not be safe to use @inspectFile with variables other than FILES_TMPNAMES. Other variables such as \u0026ldquo;FULL_REQUEST\u0026rdquo; may contains content that force your platform to fork process out of your control, making possible to an attacker to execute code using the same permissions of your web server. For other variables you may want to look at the Lua script engine. This observation was brought to our attention by \u0026ldquo;Gryzli\u0026rdquo;, on our users mailing list.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eReference:\u003c/strong\u003e http://blog.spiderlabs.com/2010/10/advanced-topic-of-the-week-preventing-malicious-pdf-file-uploads.html\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eReference:\u003c/strong\u003e http://sourceforge.net/p/mod-security/mailman/mod-security-users/?viewmonth=201512\u003c/p\u003e
\u003ch2 id="ipmatch"\u003eipMatch\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a fast ipv4 or ipv6 match of REMOTE_ADDR variable data. Can handle the following formats:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eFull IPv4 Address - 192.168.1.100\u003c/li\u003e
\u003cli\u003eNetwork Block/CIDR Address - 192.168.1.0/24\u003c/li\u003e
\u003cli\u003eFull IPv6 Address - 2001:db8:85a3:8d3:1319:8a2e:370:7348\u003c/li\u003e
\u003cli\u003eNetwork Block/CIDR Address - 2001:db8:85a3:8d3:1319:8a2e:370:0/24\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eExamples:\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eIndividual Address:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_ADDR \u0026quot;@ipMatch 192.168.1.100\u0026quot; \u0026quot;id:161\u0026quot;
Multiple Addresses w/network block:
SecRule REMOTE_ADDR \u0026quot;@ipMatch 192.168.1.100,192.168.1.50,10.10.50.0/24\u0026quot; \u0026quot;id:162\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="ipmatchf"\u003eipMatchF\u003c/h2\u003e
\u003cp\u003eshort alias for ipMatchFromFile\u003c/p\u003e
\u003ch2 id="ipmatchfromfile"\u003eipMatchFromFile\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a fast ipv4 or ipv6 match of REMOTE_ADDR variable, loading data from a file. Can handle the following formats:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eFull IPv4 Address - 192.168.1.100\u003c/li\u003e
\u003cli\u003eNetwork Block/CIDR Address - 192.168.1.0/24\u003c/li\u003e
\u003cli\u003eFull IPv6 Address - 2001:db8:85a3:8d3:1319:8a2e:370:7348\u003c/li\u003e
\u003cli\u003eNetwork Block/CIDR Address - 2001:db8:85a3:8d3:1319:8a2e:370:0/24\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eExamples:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_ADDR \u0026quot;@ipMatchFromFile ips.txt\u0026quot; \u0026quot;id:163\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe file ips.txt may contain:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e192.168.0.1\u003c/li\u003e
\u003cli\u003e172.16.0.0/16\u003c/li\u003e
\u003cli\u003e10.0.0.0/8\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator also supports to load content served by an HTTPS server.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e When used with content served by a HTTPS server, the directive SecRemoteRulesFailAction can be used to configure a warning instead of an abort, when the remote content could not be retrieved.\u003c/p\u003e
\u003ch2 id="le"\u003ele\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs numerical comparison and returns true if the input value is less than or equal to the operator parameter. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect 15 or fewer headers in a request 
SecRule \u0026amp;REQUEST_HEADERS_NAMES \u0026quot;@le 15\u0026quot; \u0026quot;id:164\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.\u003c/p\u003e
\u003ch2 id="lt"\u003elt\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs numerical comparison and returns true if the input value is less than to the operator parameter. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect fewer than 15 headers in a request 
SecRule \u0026amp;REQUEST_HEADERS_NAMES \u0026quot;@lt 15\u0026quot; \u0026quot;id:165\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If a value is provided that cannot be converted to an integer (i.e a string) this operator will treat that value as 0.\u003c/p\u003e
\u003ch2 id="nomatch"\u003enoMatch\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Will force the rule to always return false.\u003c/p\u003e
\u003ch2 id="pm"\u003epm\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a case-insensitive match of the provided phrases against the desired input value. The operator uses a set-based matching algorithm (Aho-Corasick), which means that it will match any number of keywords in parallel. When matching of a large number of keywords is needed, this operator performs much better than a regular expression.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect suspicious client by looking at the user agent identification 
SecRule REQUEST_HEADERS:User-Agent \u0026quot;@pm WebZIP WebCopier Webster WebStripper ... SiteSnagger ProWebWalker CheeseBot\u0026quot; \u0026quot;id:166\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports a snort/suricata content style. ie: \u0026ldquo;@pm A|42|C|44|F\u0026rdquo;.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator does not support macro expansion.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports the \u0026ldquo;capture\u0026rdquo; action.\u003c/p\u003e
\u003ch2 id="pmf"\u003epmf\u003c/h2\u003e
\u003cp\u003eShort alias for pmFromFile.\u003c/p\u003e
\u003ch2 id="pmfromfile"\u003epmFromFile\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a case-insensitive match of the provided phrases against the desired input value. The operator uses a set-based matching algorithm (Aho-Corasick), which means that it will match any number of keywords in parallel. When matching of a large number of keywords is needed, this operator performs much better than a regular expression.\u003c/p\u003e
\u003cp\u003eThis operator is the same as @pm, except that it takes a list of files as arguments. It will match any one of the phrases listed in the file(s) anywhere in the target value.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect suspicious user agents using the keywords in 
# the files /path/to/blacklist1 and blacklist2 (the latter 
# must be placed in the same folder as the configuration file) 
SecRule REQUEST_HEADERS:User-Agent \u0026quot;@pmFromFile /path/to/blacklist1 blacklist2\u0026quot; \u0026quot;id:167\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNotes:\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eFiles must contain exactly one phrase per line. End of line markers (both LF and CRLF) will be stripped from each phrase and any whitespace trimmed from both the beginning and the end. Empty lines and comment lines (those beginning with the # character) will be ignored.
To allow easier inclusion of phrase files with rule sets, relative paths may be used to the phrase files. In this case, the path of the file containing the rule is prepended to the phrase file path.
The @pm operator phrases do not support metacharacters.
Because this operator does not check for boundaries when matching, false positives are possible in some cases. For example, if you want to use @pm for IP address matching, the phrase 1.2.3.4 will potentially match more than one IP address (e.g., it will also match 1.2.3.40 or 1.2.3.41). To avoid the false positives, you can use your own boundaries in phrases. For example, use /1.2.3.4/ instead of just 1.2.3.4. Then, in your rules, also add the boundaries where appropriate. You will find a complete example in the example.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Prepare custom REMOTE_ADDR variable 
SecAction \u0026quot;phase:1,id:168,nolog,pass,setvar:tx.REMOTE_ADDR=/%{REMOTE_ADDR}/\u0026quot;

# Check if REMOTE_ADDR is blacklisted 
SecRule TX:REMOTE_ADDR \u0026quot;@pmFromFile blacklist.txt\u0026quot; \u0026quot;phase:1,id:169,deny,msg:'Blacklisted IP address'\u0026quot; 
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe file blacklist.txt may contain:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# ip-blacklist.txt contents:
# Note: All IPs must be prefixed/suffixed with \u0026quot;/\u0026quot; as the rules
#   will add in this character as a boundary to ensure
#   the entire IP is matched.
# SecAction \u0026quot;phase:1,id:170,pass,nolog,setvar:tx.remote_addr='/%{REMOTE_ADDR}/'\u0026quot;
/1.2.3.4/ 
/5.6.7.8/
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports a snort/suricata content style. ie: \u0026ldquo;A|42|C|44|F\u0026rdquo;.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote II:\u003c/strong\u003e This operator also supports to load content served by an HTTPS server. However, only one url can be used at a time.\u003c/p\u003e
\u003ch2 id="rbl"\u003erbl\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Looks up the input value in the RBL (real-time block list) given as parameter. The parameter can be an IPv4 address or a hostname.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_ADDR \u0026quot;@rbl sbl-xbl.spamhaus.org\u0026quot; \u0026quot;phase:1,id:171,t:none,pass,nolog,auditlog,msg:'RBL Match for SPAM Source',tag:'AUTOMATION/MALICIOUS',severity:'2',setvar:'tx.msg=%{rule.msg}',setvar:tx.automation_score=+%{tx.warning_anomaly_score},setvar:tx.anomaly_score=+%{tx.warning_anomaly_score}, \\
setvar:tx.%{rule.id}-AUTOMATION/MALICIOUS-%{matched_var_name}=%{matched_var},setvar:ip.spammer=1,expirevar:ip.spammer=86400,setvar:ip.previous_rbl_check=1,expirevar:ip.previous_rbl_check=86400,skipAfter:END_RBL_CHECK\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If the RBL used is dnsbl.httpbl.org (Honeypot Project RBL) then the SecHttpBlKey directive must specify the user\u0026rsquo;s registered API key.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If the RBL used is either multi.uribl.com or zen.spamhaus.org combined RBLs, it is possible to also parse the return codes in the last octet of the DNS response to identify which specific RBL the IP was found in.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports the \u0026ldquo;capture\u0026rdquo; action.\u003c/p\u003e
\u003ch2 id="rsub"\u003ersub\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs regular expression data substitution when applied to either the STREAM_INPUT_BODY or STREAM_OUTPUT_BODY variables. This operator also supports macro expansion. Starting with Coraza 2.7.0 this operator supports the syntax |hex| allowing users to use special chars like \\n \\r\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSyntax:\u003c/strong\u003e @rsub s/regex/str/[id]\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExamples:\u003c/strong\u003e Removing HTML Comments from response bodies:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecStreamOutBodyInspection On
SecRule STREAM_OUTPUT_BODY \u0026quot;@rsub s// /\u0026quot; \u0026quot;phase:4,id:172,t:none,nolog,pass\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If you plan to manipulate live data by using @rsub with the STREAM_ variables, you must also enable SecContentInjection directive.
Regular expressions are handled by the PCRE library http://www.pcre.org. Coraza compiles its regular expressions with the following settings:\u003c/p\u003e
\u003cp\u003eThe entire input is treated as a single line, even when there are newline characters present.
All matches are case-sensitive. If you wish to perform case-insensitive matching, you can either use the lowercase transformation function or force case-insensitive matching by prefixing the regular expression pattern with the (?i) modifier (a PCRE feature; you will find many similar features in the PCRE documentation). Also a flag [d] should be used if you want to escape the regex string chars when use macro expansion.
The PCRE_DOTALL and PCRE_DOLLAR_ENDONLY flags are set during compilation, meaning that a single dot will match any character, including the newlines, and a \$ end anchor will not match a trailing newline character.
Regular expressions are a very powerful tool. You are strongly advised to read the PCRE documentation to get acquainted with its features.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports the \u0026ldquo;capture\u0026rdquo; action.\u003c/p\u003e
\u003ch2 id="rx"\u003erx\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a regular expression match of the pattern provided as parameter. This is the default operator; the rules that do not explicitly specify an operator default to @rx.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExamples:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect Nikto 
SecRule REQUEST_HEADERS:User-Agent \u0026quot;@rx nikto\u0026quot; phase:1,id:173,t:lowercase

SecRule REQUEST_HEADERS:User-Agent \u0026quot;@rx (?i)nikto\u0026quot; phase:1,id:174,t:none
# Detect Nikto with a case-insensitive pattern 

# Detect Nikto with a case-insensitive pattern 
SecRule REQUEST_HEADERS:User-Agent \u0026quot;(?i)nikto\u0026quot; \u0026quot;id:175\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eRegular expressions are handled by the RE2. Coraza compiles its regular expressions with the following settings:\u003c/p\u003e
\u003cp\u003eThe entire input is treated as a single line, even when there are newline characters present.
All matches are case-sensitive. If you wish to perform case-insensitive matching, you can either use the lowercase transformation function or force case-insensitive matching by prefixing the regular expression pattern with the (?i) modifier (a PCRE feature; you will find many similar features in the PCRE documentation).
A single dot will match any character, including the newlines, and a \$ end anchor will not match a trailing newline character.
Regular expressions are a very powerful tool. You are strongly advised to read the PCRE documentation to get acquainted with its features.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports the \u0026ldquo;capture\u0026rdquo; action.\u003c/p\u003e
\u003ch2 id="streq"\u003estreq\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a string comparison and returns true if the parameter string is identical to the input string. Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect request parameters \u0026quot;foo\u0026quot; that do not # contain \u0026quot;bar\u0026quot;, exactly. 
SecRule ARGS:foo \u0026quot;!@streq bar\u0026quot; \u0026quot;id:176\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="strmatch"\u003estrmatch\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Performs a string match of the provided word against the desired input value. The operator uses the pattern matching Boyer-Moore-Horspool algorithm, which means that it is a single pattern matching operator. This operator performs much better than a regular expression.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect suspicious client by looking at the user agent identification 
SecRule REQUEST_HEADERS:User-Agent \u0026quot;@strmatch WebZIP\u0026quot; \u0026quot;id:177\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Starting on Coraza v2.6.0 this operator supports a snort/suricata content style. ie: \u0026ldquo;@strmatch A|42|C|44|F\u0026rdquo;.
unconditionalMatch\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Will force the rule to always return true. This is similar to SecAction however all actions that occur as a result of a rule matching will fire such as the setting of MATCHED_VAR. This can also be part a chained rule.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_ADDR \u0026quot;@unconditionalMatch\u0026quot; \u0026quot;id:1000,phase:1,pass,nolog,t:hexEncode,setvar:TX.ip_hash=%{MATCHED_VAR}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="validatebyterange"\u003evalidateByteRange\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Validates that the byte values used in input fall into the range specified by the operator parameter. This operator matches on an input value that contains bytes that are not in the specified range.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Enforce very strict byte range for request parameters (only 
# works for the applications that do not use the languages other 
# than English). 
SecRule ARGS \u0026quot;@validateByteRange 10, 13, 32-126\u0026quot; \u0026quot;id:178\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe validateByteRange is most useful when used to detect the presence of NUL bytes, which don’t have a legitimate use, but which are often used as an evasion technique.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Do not allow NUL bytes 
SecRule ARGS \u0026quot;@validateByteRange 1-255\u0026quot; \u0026quot;id:179\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e You can force requests to consist only of bytes from a certain byte range. This can be useful to avoid stack overflow attacks (since they usually contain \u0026ldquo;random\u0026rdquo; binary content). Default range values are 0 and 255, i.e. all byte values are allowed. This directive does not check byte range in a POST payload when multipart/form-data encoding (file upload) is used. Doing so would prevent binary files from being uploaded. However, after the parameters are extracted from such request they are checked for a valid range.\u003c/p\u003e
\u003ch2 id="validatehash"\u003evalidateHash\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Validates REQUEST_URI that contains data protected by the hash engine.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Validates requested URI that matches a regular expression.
SecRule REQUEST_URI \u0026quot;@validatehash \u0026quot;product_info|product_list\u0026quot; \u0026quot;phase:1,deny,id:123456\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="validateurlencoding"\u003evalidateUrlEncoding\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Validates the URL-encoded characters in the provided input string.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Validate URL-encoded characters in the request URI 
SecRule REQUEST_URI_RAW \u0026quot;@validateUrlEncoding\u0026quot; \u0026quot;id:192\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eCoraza will automatically decode the URL-encoded characters in request parameters, which means that there is little sense in applying the @validateUrlEncoding operator to them —that is, unless you know that some of the request parameters were URL-encoded more than once. Use this operator against raw input, or against the input that you know is URL-encoded. For example, some applications will URL-encode cookies, although that’s not in the standard. Because it is not in the standard, Coraza will neither validate nor decode such encodings.\u003c/p\u003e
\u003ch2 id="validateutf8encoding"\u003evalidateUtf8Encoding\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Check whether the input is a valid UTF-8 string.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Make sure all request parameters contain only valid UTF-8 
SecRule ARGS \u0026quot;@validateUtf8Encoding\u0026quot; \u0026quot;id:193\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe @validateUtf8Encoding operator detects the following problems:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eNot enough bytes :\u003c/strong\u003e UTF-8 supports two-, three-, four-, five-, and six-byte encodings. Coraza will locate cases when one or more bytes is/are missing from a character.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eInvalid characters :\u003c/strong\u003e The two most significant bits in most characters should be fixed to 0x80. Some attack techniques use different values as an evasion technique.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eOverlong characters :\u003c/strong\u003e ASCII characters are mapped directly into UTF-8, which means that an ASCII character is one UTF-8 character at the same time. However, in UTF-8 many ASCII characters can also be encoded with two, three, four, five, and six bytes. This is no longer legal in the newer versions of Unicode, but many older implementations still support it. The use of overlong UTF-8 characters is common for evasion.\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eNotes :\u003c/strong\u003e\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eMost, but not all applications use UTF-8. If you are dealing with an application that does, validating that all request parameters are valid UTF-8 strings is a great way to prevent a number of evasion techniques that use the assorted UTF-8 weaknesses. False positives are likely if you use this operator in an application that does not use UTF-8.\u003c/li\u003e
\u003cli\u003eMany web servers will also allow UTF-8 in request URIs. If yours does, you can verify the request URI using @validateUtf8Encoding.\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="verifycc"\u003everifyCC\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Detects credit card numbers in input. This operator will first use the supplied regular expression to perform an initial match, following up with the Luhn algorithm calculation to minimize false positives.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect credit card numbers in parameters and 
# prevent them from being logged to audit log 
SecRule ARGS \u0026quot;@verifyCC \\d{13,16}\u0026quot; \u0026quot;phase:2,id:194,nolog,pass,msg:'Potential credit card number',sanitiseMatched\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e This operator supports the \u0026ldquo;capture\u0026rdquo; action.\u003c/p\u003e
\u003ch2 id="within"\u003ewithin\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eDescription:\u003c/strong\u003e Returns true if the input value (the needle) is found anywhere within the @within parameter (the haystack). Macro expansion is performed on the parameter string before comparison.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Detect request methods other than GET, POST and HEAD 
SecRule REQUEST_METHOD \u0026quot;!@within GET,POST,HEAD\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e There are no delimiters for this operator, it is therefore often necessary to artificially impose some; this can be done using setvar. For instance in the example below, without the imposed delimiters (of \u0026lsquo;/\u0026rsquo;) this rule would also match on the \u0026lsquo;range\u0026rsquo; header (along with many other combinations), since \u0026lsquo;range\u0026rsquo; is within the provided parameter. With the imposed delimiters, the rule would check for \u0026lsquo;/range/\u0026rsquo; when the range header is provided, and therefore would not match since \u0026lsquo;/range/ is not part of the @within parameter.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS_NAMES \u0026quot;@rx ^.*\$\u0026quot; \\
\u0026quot;chain,\\
id:1,\\
block,\\
t:lowercase,\\
setvar:'tx.header_name=/%{tx.0}/'\u0026quot;
   SecRule TX:header_name \u0026quot;@within /proxy/ /lock-token/ /content-range/ /translate/ /if/\u0026quot; \u0026quot;t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:6,href:"https://coraza.io/docs/seclang/syntax/",title:"Syntax",description:"",content:`\u003cp\u003eSeclang is a language created by Modsecurity to define a list of sequential directives\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-modsecurity"\u003eSecDirective1 some options
SecDirective2 \u0026quot;some option between brackets \\\u0026quot; and escaped\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cpre\u003e\u003ccode\u003eSecSampleDirective this \\
    directive \\
    is splitted \\
    in lines

\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="rule-syntax"\u003eRule syntax\u003c/h2\u003e
\u003cp\u003eRules are a special directive that must contain variables, operator and actions: \u003ccode\u003eSecRule VARIABLES \u0026quot;@OPERATOR OPERATOR_ARGUMENTS\u0026quot; \u0026quot;ACTIONS\u0026quot;\u003c/code\u003e.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eAll rules \u003cstrong\u003emust\u003c/strong\u003e have a unique ID action, for example \u003ccode\u003e\u0026quot;id:1\u0026quot;\u003c/code\u003e.\u003c/li\u003e
\u003cli\u003eIf there is no \u003cstrong\u003ephase\u003c/strong\u003e action, the phase will default to 2 (request headers).\u003c/li\u003e
\u003cli\u003eRules can contain only one disruptive action\u003c/li\u003e
\u003cli\u003eMore default actions can be set with \u003ca href="#"\u003eSecDefaultAction\u003c/a\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_ADDR \u0026quot;127.0.0.1\u0026quot; \u0026quot;id:1, phase:1, pass, log, logdata:'Request from localhost'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="variables"\u003eVariables\u003c/h3\u003e
\u003cp\u003eVariables are a structure of KEY:VALUE(S), some variables are mapped objects that contains \u003ccode\u003eKEY:[VALUE1,VALUE2,VALUE3]\u003c/code\u003e, while other are just \u003ccode\u003eKEY:VALUE\u003c/code\u003e. If you request a variable without any parameter, it will return all of values for each key, if it is a \u003ccode\u003eKEY:VALUE\u003c/code\u003e variable it will just return a single value. Variable parameters use the syntax \u003ccode\u003eVARIABLE:PARAMETER\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eVariable key\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eVariables can be queried for a specific case insesitive key, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:user-agent \u0026quot;@contains firefox\u0026quot; \u0026quot;id:1, pass, log, logdata:'someone used firefox to access'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eVariable with regex\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003ePCRE compatible regex can be used to query a mapped VARIABLE like ARGS, the following example will match all parameters (get and post) where the key begins with \u003ccode\u003eparam\u003c/code\u003e and the value of this argument is \u003ccode\u003esomeval\u003c/code\u003e.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS:/^param.*\$/ \u0026quot;someval\u0026quot; \u0026quot;id:1\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote: In the future we are migrating to RE2, so don\u0026rsquo;t create rules with RE2 unsupported features.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eVariable exceptions\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eYou can remove specific taget keys from the variables list using the \u003cstrong\u003e!\u003c/strong\u003e prefix, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# We want to apply some Sql Injection validations against the REQUEST_HEADERS
SecRule REQUEST_HEADERS \u0026quot;@detectSQLi\u0026quot; \u0026quot;id:1, deny, status:403\u0026quot;

# There is a false positive for some User-Agents so we want to ignore the 
# User-Agent header:
SecRule REQUEST_HEADERS|!REQUEST_HEADERS:User-Agent \u0026quot;@detectSQLi\u0026quot; \u0026quot;id:2, deny, status:403\u0026quot;

## The second rule will be evaluated for each request header except User-Agent.
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eXPATH variables\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eIf the body processor is set to process JSON or XML, you may use the special variables \u003cstrong\u003eXML\u003c/strong\u003e and \u003cstrong\u003eJSON\u003c/strong\u003e, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;id:1, phase:1,ctl:setRequestBodyProcessor=XML,pass,nolog\u0026quot;
# We are denying a book because we don't like it
SecRule XML:/bookstore/book[last()] \u0026quot;name of the book\u0026quot; \u0026quot;id:2,phase:2,log,logdata:'We don´t like this book!',deny,status:403\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eSee \u003ca href="https://github.com/antchfx/xpath"\u003ehttps://github.com/antchfx/xpath\u003c/a\u003e for more information about XPATH support.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eVariable count\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eYou can count the number of keys available for a collection using the \u003cstrong\u003e\u0026amp;\u003c/strong\u003e prefix, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# You want to block requests without host header
SecRule \u0026amp;REQUEST_HEADERS:text \u0026quot;@eq 0\u0026quot; \u0026quot;id:1, deny, status:403\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eMultiple Variables\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eYou may evaluate multiple variables by separating them win pipe (|), for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule VARIABLE1|VARIABLE2|VARIABLE3:/some-regex/|\u0026amp;VARIABLE4|!VARIABLE3:id \u0026quot;!@rx \\w+\u0026quot; \u0026quot;id:1,pass\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="operators"\u003eOperators\u003c/h3\u003e
\u003cp\u003eOperators are functions that returns true or false. Only one operator can be used per rule, unless you use chains. The syntax for an operator is: \u003ccode\u003e\u0026quot;@OPERATOR ARGUMENTS\u0026quot;\u003c/code\u003e, you can negate the result using \u003ccode\u003e\u0026quot;!@OPERATOR ARGUMENTS\u0026quot;\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e If you don\u0026rsquo;t indicate any operator, the default used operator will be \u003ccode\u003e@rx\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Operators must begin with \u003cstrong\u003e@\u003c/strong\u003e.\u003c/p\u003e
\u003ch3 id="actions"\u003eActions\u003c/h3\u003e
\u003cp\u003eActions are key-value instructions for the rule that will be triggered per compilation, interruption or transaction depending on the action type.\u003c/p\u003e
\u003cp\u003eActions values are optional, the key-value syntax is \u003ccode\u003ekey:value\u003c/code\u003e and some actions can be reused as much as you want, like \u003cstrong\u003et\u003c/strong\u003e.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eAction types:\u003c/strong\u003e\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eNon-disruptive actions\u003c/strong\u003e - Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eFlow actions\u003c/strong\u003e - These actions affect the rule flow (for example skip or skipAfter).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eMeta-data actions\u003c/strong\u003e - Meta-data actions are used to provide more information about rules. Examples include id, rev, severity and msg.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eData actions\u003c/strong\u003e - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="default-actions"\u003eDefault Actions\u003c/h3\u003e
\u003cp\u003eSecDefaultActions is used to define a default list of actions per phase. The default phases will be added to each rule and can be overwritten by using the specified action again.\u003c/p\u003e
\u003cp\u003eIf you define default actions, you are forced to indicate a \u003cstrong\u003ephase\u003c/strong\u003e and a \u003cstrong\u003edisruptive action\u003c/strong\u003e.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecDefaultAction \u0026quot;phase:1, deny, status:403\u0026quot;

# This rule will deny the request with status 403 because of the default actions
SecAction \u0026quot;id:2, phase:1\u0026quot;

# This rule will be triggered but it will pas instead of deny
SecAction \u0026quot;id:3, phase:1, pass\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="secaction"\u003eSecAction\u003c/h3\u003e
\u003cp\u003eSecActions are used to create rules that will always match, they don´t contain operator nor variables.\u003c/p\u003e
\u003ch2 id="macro-expansion"\u003eMacro Expansion\u003c/h2\u003e
\u003cp\u003eMacro expansions are special messages that can be transformed into it\u0026rsquo;s evaluated value, the syntax is: \u003ccode\u003e%{VARIABLE.KEY}\u003c/code\u003e, for example \u003ccode\u003e%{REQUEST_HEADERS:host}\u003c/code\u003e will return the content of the request header \u0026ldquo;Host\u0026rdquo;.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;id:1, log, logdata:'Transaction %{unique_id}'\u0026quot;

# we assign a variable to tx.argcount
SecRule \u0026amp;ARGS \u0026quot;!@eq 0\u0026quot; \u0026quot;id:2, setvar:'tx.argcount=%{MATCHED_VAR}', pass\u0026quot;
# we print the args count to the log
SecAction \u0026quot;id:3, log, logdata:'%{tx.argcount} arguments found.'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:7,href:"https://coraza.io/docs/seclang/transformations/",title:"Transformations",description:"Transformation functions are used to alter input data before it is used in matching.",content:`\u003cp\u003eIn the following example, the request parameter values are converted to lowercase before matching:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS \u0026quot;xp_cmdshell\u0026quot; \u0026quot;t:lowercase,id:91\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eMultiple transformation actions can be used in the same rule, forming a transformation pipeline. The transformations will be performed in the order in which they appear in the rule.\u003c/p\u003e
\u003cp\u003eIn most cases, the order in which transformations are performed is very important. In the following example, a series of transformation functions is performed to counter evasion. Performing the transformations in any other order would allow a skillful attacker to evade detection:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS \u0026quot;(asfunction|javascript|vbscript|data|mocha|livescript):\u0026quot; \u0026quot;id:92,t:none,t:htmlEntityDecode,t:lowercase,t:removeNulls,t:removeWhitespace\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cdiv class="alert alert-warning d-flex" role="alert"\u003e
  \u003cdiv class="flex-shrink-1 alert-icon"\u003e👉 \u003c/div\u003e
  
    \u003cdiv class="w-100"\u003eWarning : It is currently possible to use SecDefaultAction to specify a default list of transformation functions, which will be applied to all rules that follow the SecDefaultAction directive. However, this practice is not recommended, because it means that mistakes are very easy to make. It is recommended that you always specify the transformation functions that are needed by a particular rule, starting the list with t:none (which clears the possibly inherited transformation functions). \u003c/div\u003e
  
\u003c/div\u003e

The remainder of this section documents the transformation functions currently available in Coraza.\u003c/p\u003e
\u003ch2 id="base64decode"\u003ebase64Decode\u003c/h2\u003e
\u003cp\u003eDecodes a Base64-encoded string.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:Authorization \u0026quot;^Basic ([a-zA-Z0-9]+=*)\$\u0026quot; \u0026quot;phase:1,id:93,capture,chain,logdata:%{TX.1}\u0026quot;
  SecRule TX:1 ^(\\w+): t:base64Decode,capture,chain
    SecRule TX:1 ^(admin|root|backup)\$ 
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eNote : Be careful when applying base64Decode with other transformations. The order of your transformation matters in this case as certain transformations may change or invalidate the base64 encoded string prior to being decoded (i.e t:lowercase, etc). This of course means that it is also very difficult to write a single rule that checks for a base64decoded value OR an unencoded value with transformations, it is best to write two rules in this situation.
sqlHexDecode
Decode sql hex data. Example (0x414243) will be decoded to (ABC).\u003c/p\u003e
\u003ch2 id="base64decodeext"\u003ebase64DecodeExt\u003c/h2\u003e
\u003cp\u003eDecodes a Base64-encoded string. Unlike base64Decode, this version uses a forgiving implementation, which ignores invalid characters.\u003c/p\u003e
\u003cp\u003eSee blog post on Base64Decoding evasion issues on PHP sites - http://blog.spiderlabs.com/2010/04/impedance-mismatch-and-base64.html\u003c/p\u003e
\u003ch2 id="base64encode"\u003ebase64Encode\u003c/h2\u003e
\u003cp\u003eEncodes input string using Base64 encoding.\u003c/p\u003e
\u003ch2 id="cmdline"\u003ecmdLine\u003c/h2\u003e
\u003cp\u003eIn Windows and Unix, commands may be escaped by different means, such as:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003ec^ommand /c \u0026hellip;\u003c/li\u003e
\u003cli\u003e\u0026ldquo;command\u0026rdquo; /c \u0026hellip;\u003c/li\u003e
\u003cli\u003ecommand,/c \u0026hellip;\u003c/li\u003e
\u003cli\u003ebackslash in the middle of a Unix command\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eThe cmdLine transformation function avoids this problem by manipulating the variable contend in the following ways:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003edeleting all backslashes []\u003c/li\u003e
\u003cli\u003edeleting all double quotes [\u0026quot;]\u003c/li\u003e
\u003cli\u003edeleting all single quotes [']\u003c/li\u003e
\u003cli\u003edeleting all carets [^]\u003c/li\u003e
\u003cli\u003edeleting spaces before a slash /\u003c/li\u003e
\u003cli\u003edeleting spaces before an open parentesis [(]\u003c/li\u003e
\u003cli\u003ereplacing all commas [,] and semicolon [;] into a space\u003c/li\u003e
\u003cli\u003ereplacing all multiple spaces (including tab, newline, etc.) into one space\u003c/li\u003e
\u003cli\u003etransform all characters to lowercase\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eExample Usage:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS \u0026quot;(?:command(?:.com)?|cmd(?:.exe)?)(?:/.*)?/[ck]\u0026quot; \u0026quot;phase:2,id:94,t:none, t:cmdLine\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="compresswhitespace"\u003ecompressWhitespace\u003c/h2\u003e
\u003cp\u003eConverts any of the whitespace characters (0x20, \\f, \\t, \\n, \\r, \\v, 0xa0) to spaces (ASCII 0x20), compressing multiple consecutive space characters into one.\u003c/p\u003e
\u003ch2 id="cssdecode"\u003ecssDecode\u003c/h2\u003e
\u003cp\u003eDecodes characters encoded using the CSS 2.x escape rules syndata.html#characters. This function uses only up to two bytes in the decoding process, meaning that it is useful to uncover ASCII characters encoded using CSS encoding (that wouldn’t normally be encoded), or to counter evasion, which is a combination of a backslash and non-hexadecimal characters (e.g., ja\\vascript is equivalent to javascript).\u003c/p\u003e
\u003ch2 id="escapeseqdecode"\u003eescapeSeqDecode\u003c/h2\u003e
\u003cp\u003eDecodes ANSI C escape sequences: \\a, \\b, \\f, \\n, \\r, \\t, \\v, \\, ?, ', \u0026quot;, \\xHH (hexadecimal), \\0OOO (octal). Invalid encodings are left in the output.\u003c/p\u003e
\u003ch2 id="hexdecode"\u003ehexDecode\u003c/h2\u003e
\u003cp\u003eDecodes a string that has been encoded using the same algorithm as the one used in hexEncode (see following entry).\u003c/p\u003e
\u003ch2 id="hexencode"\u003ehexEncode\u003c/h2\u003e
\u003cp\u003eEncodes string (possibly containing binary characters) by replacing each input byte with two hexadecimal characters. For example, xyz is encoded as 78797a.\u003c/p\u003e
\u003ch2 id="htmlentitydecode"\u003ehtmlEntityDecode\u003c/h2\u003e
\u003cp\u003eDecodes the characters encoded as HTML entities. The following variants are supported:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eHH and HH; (where H is any hexadecimal number)\u003c/li\u003e
\u003cli\u003eDDD and DDD; (where D is any decimal number)\u003c/li\u003e
\u003cli\u003e\u0026amp;quotand\u0026quot;\u003c/li\u003e
\u003cli\u003e\u0026amp;nbspand\u003c/li\u003e
\u003cli\u003e\u0026amp;ltand\u0026lt;\u003c/li\u003e
\u003cli\u003e\u0026amp;gtand\u0026gt;\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eThis function always converts one HTML entity into one byte, possibly resulting in a loss of information (if the entity refers to a character that cannot be represented with the single byte). It is thus useful to uncover bytes that would otherwise not need to be encoded, but it cannot do anything meaningful with the characters from the range above 0xff.\u003c/p\u003e
\u003ch2 id="jsdecode"\u003ejsDecode\u003c/h2\u003e
\u003cp\u003eDecodes JavaScript escape sequences. If a \\uHHHH code is in the range of FF01-FF5E (the full width ASCII codes), then the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte will be used and the higher byte zeroed (leading to possible loss of information).\u003c/p\u003e
\u003ch2 id="length"\u003elength\u003c/h2\u003e
\u003cp\u003eLooks up the length of the input string in bytes, placing it (as string) in output. For example, if it gets ABCDE on input, this transformation function will return 5 on output.\u003c/p\u003e
\u003ch2 id="lowercase"\u003elowercase\u003c/h2\u003e
\u003cp\u003eConverts all characters to lowercase using the current C locale.\u003c/p\u003e
\u003ch2 id="md5"\u003emd5\u003c/h2\u003e
\u003cp\u003eCalculates an MD5 hash from the data in input. The computed hash is in a raw binary form and may need encoded into text to be printed (or logged). Hash functions are commonly used in combination with hexEncode (for example: t:md5,t:hexEncode).\u003c/p\u003e
\u003ch2 id="none"\u003enone\u003c/h2\u003e
\u003cp\u003eNot an actual transformation function, but an instruction to Coraza to remove all transformation functions associated with the current rule.\u003c/p\u003e
\u003ch2 id="normalizepath"\u003enormalizePath\u003c/h2\u003e
\u003cp\u003eRemoves multiple slashes, directory self-references, and directory back-references (except when at the beginning of the input) from input string.\u003c/p\u003e
\u003ch2 id="normalizepathwin"\u003enormalizePathWin\u003c/h2\u003e
\u003cp\u003eSame as normalizePath, but first converts backslash characters to forward slashes.\u003c/p\u003e
\u003ch2 id="parityeven7bit"\u003eparityEven7bit\u003c/h2\u003e
\u003cp\u003eCalculates even parity of 7-bit data replacing the 8th bit of each target byte with the calculated parity bit.\u003c/p\u003e
\u003ch2 id="parityodd7bit"\u003eparityOdd7bit\u003c/h2\u003e
\u003cp\u003eCalculates odd parity of 7-bit data replacing the 8th bit of each target byte with the calculated parity bit.\u003c/p\u003e
\u003ch2 id="parityzero7bit"\u003eparityZero7bit\u003c/h2\u003e
\u003cp\u003eCalculates zero parity of 7-bit data replacing the 8th bit of each target byte with a zero-parity bit, which allows inspection of even/odd parity 7-bit data as ASCII7 data.\u003c/p\u003e
\u003ch2 id="removenulls"\u003eremoveNulls\u003c/h2\u003e
\u003cp\u003eRemoves all NUL bytes from input.\u003c/p\u003e
\u003ch2 id="removewhitespace"\u003eremoveWhitespace\u003c/h2\u003e
\u003cp\u003eRemoves all whitespace characters from input.\u003c/p\u003e
\u003ch2 id="replacecomments"\u003ereplaceComments\u003c/h2\u003e
\u003cp\u003eReplaces each occurrence of a C-style comment (/* \u0026hellip; \u003cem\u003e/) with a single space (multiple consecutive occurrences of which will not be compressed). Unterminated comments will also be replaced with a space (ASCII 0x20). However, a standalone termination of a comment (\u003c/em\u003e/) will not be acted upon.\u003c/p\u003e
\u003ch2 id="removecommentschar"\u003eremoveCommentsChar\u003c/h2\u003e
\u003cp\u003eRemoves common comments chars (/*, */, \u0026ndash;, #).\u003c/p\u003e
\u003ch2 id="removecomments"\u003eremoveComments\u003c/h2\u003e
\u003cp\u003eRemoves each occurrence of comment (/* \u0026hellip; */, \u0026ndash;, #). Multiple consecutive occurrences of which will not be compressed.\u003c/p\u003e
\u003cp\u003eNote : This transformation is known to be unreliable, might cause some unexpected behaviour and could be deprecated soon in a future release. Refer to issue #1207 for further information..\u003c/p\u003e
\u003ch2 id="replacenulls"\u003ereplaceNulls\u003c/h2\u003e
\u003cp\u003eReplaces NUL bytes in input with space characters (ASCII 0x20).\u003c/p\u003e
\u003ch2 id="urldecode"\u003eurlDecode\u003c/h2\u003e
\u003cp\u003eDecodes a URL-encoded input string. Invalid encodings (i.e., the ones that use non-hexadecimal characters, or the ones that are at the end of string and have one or two bytes missing) are not converted, but no error is raised. To detect invalid encodings, use the @validateUrlEncoding operator on the input data first. The transformation function should not be used against variables that have already been URL-decoded (such as request parameters) unless it is your intention to perform URL decoding twice!\u003c/p\u003e
\u003ch2 id="uppercase"\u003euppercase\u003c/h2\u003e
\u003cp\u003eConverts all characters to uppercase using the current C locale.\u003c/p\u003e
\u003ch2 id="urldecodeuni"\u003eurlDecodeUni\u003c/h2\u003e
\u003cp\u003eLike urlDecode, but with support for the Microsoft-specific %u encoding. If the code is in the range of FF01-FF5E (the full-width ASCII codes), then the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte will be used and the higher byte zeroed.\u003c/p\u003e
\u003ch2 id="urlencode"\u003eurlEncode\u003c/h2\u003e
\u003cp\u003eEncodes input string using URL encoding.\u003c/p\u003e
\u003ch2 id="utf8tounicode"\u003eutf8toUnicode\u003c/h2\u003e
\u003cp\u003eConverts all UTF-8 characters sequences to Unicode. This help input normalization specially for non-english languages minimizing false-positives and false-negatives.\u003c/p\u003e
\u003ch2 id="sha1"\u003esha1\u003c/h2\u003e
\u003cp\u003eCalculates a SHA1 hash from the input string. The computed hash is in a raw binary form and may need encoded into text to be printed (or logged). Hash functions are commonly used in combination with hexEncode (for example, t:sha1,t:hexEncode).\u003c/p\u003e
\u003ch2 id="trimleft"\u003etrimLeft\u003c/h2\u003e
\u003cp\u003eRemoves whitespace from the left side of the input string.\u003c/p\u003e
\u003ch2 id="trimright"\u003etrimRight\u003c/h2\u003e
\u003cp\u003eRemoves whitespace from the right side of the input string.\u003c/p\u003e
\u003ch2 id="trim"\u003etrim\u003c/h2\u003e
\u003cp\u003eRemoves whitespace from both the left and right sides of the input string.\u003c/p\u003e
`}).add({id:8,href:"https://coraza.io/docs/seclang/variables/",title:"Variables",description:"...",content:`\u003ch2 id="args"\u003eARGS\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eARGS\u003c/strong\u003e is a collection and can be used on its own (means all arguments including the POST Payload), with a static parameter (matches arguments with that name), or with a regular expression (matches all arguments with name that matches the regular expression). To look at only the query string or body arguments, see the ARGS_GET and ARGS_POST collections.\u003c/p\u003e
\u003cp\u003eSome variables are actually collections, which are expanded into more variables at runtime. The following example will examine all request arguments:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS dirty \u0026quot;id:7\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eSometimes, however, you will want to look only at parts of a collection. This can be achieved with the help of the selection operator(colon). The following example will only look at the arguments named p (do note that, in general, requests can contain multiple arguments with the same name):\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS:p dirty \u0026quot;id:8\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIt is also possible to specify exclusions. The following will examine all request arguments for the word dirty, except the ones named z (again, there can be zero or more arguments named z):\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS|!ARGS:z dirty \u0026quot;id:9\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThere is a special operator that allows you to count how many variables there are in a collection. The following rule will trigger if there is more than zero arguments in the request (ignore the second parameter for the time being):\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule \u0026amp;ARGS !^0\$ \u0026quot;id:10\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eAnd sometimes you need to look at an array of parameters, each with a slightly different name. In this case you can specify a regular expression in the selection operator itself. The following rule will look into all arguments whose names begin with id_:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS:/^id_/ dirty \u0026quot;id:11\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Using \u003ccode\u003eARGS:p\u003c/code\u003e will not result in any invocations against the operator if argument p does not exist.\u003c/p\u003e
\u003ch2 id="args_combined_size"\u003eARGS_COMBINED_SIZE\u003c/h2\u003e
\u003cp\u003eContains the combined size of all request parameters. Files are excluded from the calculation. This variable can be useful, for example, to create a rule to ensure that the total size of the argument data is below a certain threshold. The following rule detects a request whose parameters are more than 2500 bytes long:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS_COMBINED_SIZE \u0026quot;@gt 2500\u0026quot; \u0026quot;id:12\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="args_get"\u003eARGS_GET\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eARGS_GET\u003c/strong\u003e is similar to ARGS, but contains only query string parameters.\u003c/p\u003e
\u003ch2 id="args_get_names"\u003eARGS_GET_NAMES\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eARGS_GET_NAMES\u003c/strong\u003e is similar to \u003cstrong\u003eARGS_NAMES\u003c/strong\u003e, but contains only the names of query string parameters.\u003c/p\u003e
\u003ch2 id="args_names"\u003eARGS_NAMES\u003c/h2\u003e
\u003cp\u003eContains all request parameter names. You can search for specific parameter names that you want to inspect. In a positive policy scenario, you can also whitelist (using an inverted rule with the exclamation mark) only the authorized argument names. This example rule allows only two argument names: p and a:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS_NAMES \u0026quot;!^(p|a)\$\u0026quot; \u0026quot;id:13\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="args_post"\u003eARGS_POST\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eARGS_POST\u003c/strong\u003e is similar to \u003cstrong\u003eARGS\u003c/strong\u003e, but only contains arguments from the POST body.\u003c/p\u003e
\u003ch2 id="args_post_names"\u003eARGS_POST_NAMES\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eARGS_POST_NAMES\u003c/strong\u003e is similar to \u003cstrong\u003eARGS_NAMES\u003c/strong\u003e, but contains only the names of request body parameters.\u003c/p\u003e
\u003ch2 id="auth_type"\u003eAUTH_TYPE\u003c/h2\u003e
\u003cp\u003eThis variable holds the authentication method used to validate a user, if any of the methods built into HTTP are used. In a reverse-proxy deployment, this information will not be available if the authentication is handled in the backend web server.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule AUTH_TYPE \u0026quot;Basic\u0026quot; \u0026quot;id:14\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="duration"\u003eDURATION\u003c/h2\u003e
\u003cp\u003eContains the number of microseconds elapsed since the beginning of the current transaction.\u003c/p\u003e
\u003ch2 id="env"\u003eENV\u003c/h2\u003e
\u003cp\u003eCollection that provides access to environment variables set by Coraza or other server modules. Requires a single parameter to specify the name of the desired variable.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Set environment variable 
SecRule REQUEST_FILENAME \u0026quot;printenv\u0026quot; \\
\u0026quot;phase:2,id:15,pass,setenv:tag=suspicious\u0026quot; 

# Inspect environment variable
SecRule ENV:tag \u0026quot;suspicious\u0026quot; \u0026quot;id:16\u0026quot;

# Reading an environment variable from other Apache module (mod_ssl)
SecRule TX:ANOMALY_SCORE \u0026quot;@gt 0\u0026quot; \u0026quot;phase:5,id:16,msg:'%{env.ssl_cipher}'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Use setenv to set environment variables to be accessed by Apache.\u003c/p\u003e
\u003ch2 id="files"\u003eFILES\u003c/h2\u003e
\u003cp\u003eContains a collection of original file names (as they were called on the remote user’s filesys- tem). Available only on inspected multipart/form-data requests.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FILES \u0026quot;@rx \\.conf\$\u0026quot; \u0026quot;id:17\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Only available if files were extracted from the request body.\u003c/p\u003e
\u003ch2 id="files_combined_size"\u003eFILES_COMBINED_SIZE\u003c/h2\u003e
\u003cp\u003eContains the total size of the files transported in request body. Available only on inspected multipart/form-data requests.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FILES_COMBINED_SIZE \u0026quot;@gt 100000\u0026quot; \u0026quot;id:18\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="files_names"\u003eFILES_NAMES\u003c/h2\u003e
\u003cp\u003eContains a list of form fields that were used for file upload. Available only on inspected multipart/form-data requests.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FILES_NAMES \u0026quot;^upfile\$\u0026quot; \u0026quot;id:19\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="full_request"\u003eFULL_REQUEST\u003c/h2\u003e
\u003cp\u003eContains the complete request: Request line, Request headers and Request body (if any). The last available only if SecRequestBodyAccess was set to On. Note that all properties of SecRequestBodyAccess will be respected here, such as: SecRequestBodyLimit.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FULL_REQUEST \u0026quot;User-Agent: Coraza Regression Tests\u0026quot; \u0026quot;id:21\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e This option is not implemented by default, it must be forced by the server with \u003ccode\u003etx.SetFullRequest()\u003c/code\u003e\u003c/p\u003e
\u003ch2 id="full_request_length"\u003eFULL_REQUEST_LENGTH\u003c/h2\u003e
\u003cp\u003eRepresents the amount of bytes that FULL_REQUEST may use.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FULL_REQUEST_LENGTH \u0026quot;@eq 205\u0026quot; \u0026quot;id:21\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="files_sizes"\u003eFILES_SIZES\u003c/h2\u003e
\u003cp\u003eContains a list of individual file sizes. Useful for implementing a size limitation on individual uploaded files. Available only on inspected multipart/form-data requests.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FILES_SIZES \u0026quot;@gt 100\u0026quot; \u0026quot;id:20\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="files_tmpnames"\u003eFILES_TMPNAMES\u003c/h2\u003e
\u003cp\u003eContains a list of temporary files’ names on the disk. Useful when used together with @inspectFile. Available only on inspected multipart/form-data requests.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FILES_TMPNAMES \u0026quot;@inspectFile /path/to/inspect_script.pl\u0026quot; \u0026quot;id:21\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="files_tmp_content"\u003eFILES_TMP_CONTENT\u003c/h2\u003e
\u003cp\u003eContains a key-value set where value is the content of the file which was uploaded. Useful when used together with @fuzzyHash.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule FILES_TMP_CONTENT \u0026quot;@fuzzyHash \$ENV{CONF_DIR}/ssdeep.txt 1\u0026quot; \u0026quot;id:192372,log,deny\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e SecUploadKeepFiles should be set to \u0026lsquo;On\u0026rsquo; in order to have this collection filled.\u003c/p\u003e
\u003ch2 id="geo"\u003eGEO\u003c/h2\u003e
\u003cp\u003eGEO is a collection populated by the results of the last @geoLookup operator. The collection can be used to match geographical fields looked from an IP address or hostname.\u003c/p\u003e
\u003cp\u003eFields:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eCOUNTRY_CODE:\u003c/strong\u003e Two character country code. EX: US, CL, GB, etc.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eCOUNTRY_CODE3:\u003c/strong\u003e Up to three character country code.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eCOUNTRY_NAME:\u003c/strong\u003e The full country name.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eCOUNTRY_CONTINENT:\u003c/strong\u003e The two character continent that the country is located. EX: EU\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eREGION:\u003c/strong\u003e The two character region. For US, this is state. For Chile, region, etc.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eCITY:\u003c/strong\u003e The city name if supported by the database.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003ePOSTAL_CODE:\u003c/strong\u003e The postal code if supported by the database.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eLATITUDE:\u003c/strong\u003e The latitude if supported by the database.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eLONGITUDE:\u003c/strong\u003e The longitude if supported by the database.\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eExample:\u003c/strong\u003e\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecGeoLookupDb maxminddb file=/usr/local/geo/data/GeoLiteCity.dat
...
SecRule REMOTE_ADDR \u0026quot;@geoLookup\u0026quot; \u0026quot;chain,id:22,drop,msg:'Non-GB IP address'\u0026quot;
SecRule GEO:COUNTRY_CODE \u0026quot;!@streq GB\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="highest_severity"\u003eHIGHEST_SEVERITY\u003c/h2\u003e
\u003cp\u003eThis variable holds the highest severity of any rules that have matched so far. Severities are numeric values and thus can be used with comparison operators such as @lt, and so on. A value of 255 indicates that no severity has been set.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule HIGHEST_SEVERITY \u0026quot;@le 2\u0026quot; \u0026quot;phase:2,id:23,deny,status:500,msg:'severity %{HIGHEST_SEVERITY}'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Higher severities have a lower numeric value.\u003c/p\u003e
\u003ch2 id="inbound_data_error"\u003eINBOUND_DATA_ERROR\u003c/h2\u003e
\u003cp\u003eThis variable will be set to 1 when the request body size is above the setting configured by \u003cstrong\u003eSecRequestBodyLimit\u003c/strong\u003e directive. Your policies should always contain a rule to check this variable. Depending on the rate of false positives and your default policy you should decide whether to block or just warn when the rule is triggered.\u003c/p\u003e
\u003cp\u003eThe best way to use this variable is as in the example below:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule INBOUND_DATA_ERROR \u0026quot;@eq 1\u0026quot; \u0026quot;phase:1,id:24,t:none,log,pass,msg:'Request Body Larger than SecRequestBodyLimit Setting'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="matched_var"\u003eMATCHED_VAR\u003c/h2\u003e
\u003cp\u003eThis variable holds the value of the most-recently matched variable. It is similar to the TX:0, but it is automatically supported by all operators and there is no need to specify the capture action.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS pattern chain,deny,id:25
  SecRule MATCHED_VAR \u0026quot;further scrutiny\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Be aware that this variable holds data for the last operator match. This means that if there are more than one matches, only the last one will be populated. Use MATCHED_VARS variable if you want all matches.\u003c/p\u003e
\u003ch2 id="matched_vars"\u003eMATCHED_VARS\u003c/h2\u003e
\u003cp\u003eSimilar to \u003cstrong\u003eMATCHED_VAR\u003c/strong\u003e except that it is a collection of all matches for the current operator check.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS pattern \u0026quot;chain,deny,id:26\u0026quot;
  SecRule MATCHED_VARS \u0026quot;@eq ARGS:param\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="matched_var_name"\u003eMATCHED_VAR_NAME\u003c/h2\u003e
\u003cp\u003eThis variable holds the full name of the variable that was matched against.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS pattern \u0026quot;chain,deny,id:27\u0026quot;
  SecRule MATCHED_VAR_NAME \u0026quot;@eq ARGS:param\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Be aware that this variable holds data for the last operator match. This means that if there are more than one matches, only the last one will be populated. Use MATCHED_VARS_NAMES variable if you want all matches.\u003c/p\u003e
\u003ch2 id="matched_vars_names"\u003eMATCHED_VARS_NAMES\u003c/h2\u003e
\u003cp\u003eSimilar to MATCHED_VAR_NAME except that it is a collection of all matches for the current operator check.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS pattern \u0026quot;chain,deny,id:28\u0026quot;
  SecRule MATCHED_VARS_NAMES \u0026quot;@eq ARGS:param\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="multipart_crlf_lf_lines"\u003eMULTIPART_CRLF_LF_LINES\u003c/h2\u003e
\u003cp\u003eThis flag variable will be set to 1 whenever a multi-part request uses mixed line terminators. The multipart/form-data RFC requires CRLF sequence to be used to terminate lines. Since some client implementations use only LF to terminate lines you might want to allow them to proceed under certain circumstances (if you want to do this you will need to stop using MULTIPART_STRICT_ERROR and check each multi-part flag variable individually, avoiding MULTIPART_LF_LINE). However, mixing CRLF and LF line terminators is dangerous as it can allow for evasion. Therefore, in such cases, you will have to add a check for MULTIPART_CRLF_LF_LINES.\u003c/p\u003e
\u003ch2 id="multipart_filename"\u003eMULTIPART_FILENAME\u003c/h2\u003e
\u003cp\u003eThis variable contains the multipart data from field FILENAME.\u003c/p\u003e
\u003ch2 id="multipart_name"\u003eMULTIPART_NAME\u003c/h2\u003e
\u003cp\u003eThis variable contains the multipart data from field NAME.\u003c/p\u003e
\u003ch2 id="multipart_strict_error"\u003eMULTIPART_STRICT_ERROR\u003c/h2\u003e
\u003cp\u003e\u003cstrong\u003eMULTIPART_STRICT_ERROR\u003c/strong\u003e will be set to 1 when any of the following variables is also set to 1: REQBODY_PROCESSOR_ERROR, MULTIPART_BOUNDARY_QUOTED, MULTIPART_BOUNDARY_WHITESPACE, MULTIPART_DATA_BEFORE, MULTIPART_DATA_AFTER, MULTIPART_HEADER_FOLDING, MULTIPART_LF_LINE, MULTIPART_MISSING_SEMICOLON MULTIPART_INVALID_QUOTING MULTIPART_INVALID_HEADER_FOLDING MULTIPART_FILE_LIMIT_EXCEEDED. Each of these variables covers one unusual (although sometimes legal) aspect of the request body in multipart/form-data format. Your policies should always contain a rule to check either this variable (easier) or one or more individual variables (if you know exactly what you want to accomplish). Depending on the rate of false positives and your default policy you should decide whether to block or just warn when the rule is triggered.\u003c/p\u003e
\u003cp\u003eThe best way to use this variable is as in the example below:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule MULTIPART_STRICT_ERROR \u0026quot;!@eq 0\u0026quot; \\
\u0026quot;phase:2,id:30,t:none,log,deny,msg:'Multipart request body \\
failed strict validation: \\
PE %{REQBODY_PROCESSOR_ERROR}, \\
BQ %{MULTIPART_BOUNDARY_QUOTED}, \\
BW %{MULTIPART_BOUNDARY_WHITESPACE}, \\
DB %{MULTIPART_DATA_BEFORE}, \\
DA %{MULTIPART_DATA_AFTER}, \\
HF %{MULTIPART_HEADER_FOLDING}, \\
LF %{MULTIPART_LF_LINE}, \\
SM %{MULTIPART_MISSING_SEMICOLON}, \\
IQ %{MULTIPART_INVALID_QUOTING}, \\
IQ %{MULTIPART_INVALID_HEADER_FOLDING}, \\
FE %{MULTIPART_FILE_LIMIT_EXCEEDED}'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eCoraza uses the golang multipart parser, which fails for most evasion attempts and generates an exception.\u003c/p\u003e
\u003ch2 id="multipart_unmatched_boundary"\u003eMULTIPART_UNMATCHED_BOUNDARY\u003c/h2\u003e
\u003cp\u003eSet to 1 when, during the parsing phase of a multipart/request-body, Coraza encounters what feels like a boundary but it is not. Such an event may occur when evasion of Coraza is attempted.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003eThe best way to use this variable is as in the example below:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule MULTIPART_UNMATCHED_BOUNDARY \u0026quot;!@eq 0\u0026quot; \\
\u0026quot;phase:2,id:31,t:none,log,deny,msg:'Multipart parser detected a possible unmatched boundary.'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eChange the rule from blocking to logging-only if many false positives are encountered.\u003c/p\u003e
\u003ch2 id="outbound_data_error"\u003eOUTBOUND_DATA_ERROR\u003c/h2\u003e
\u003cp\u003eThis variable will be set to 1 when the response body size is above the setting configured by SecResponseBodyLimit directive. Your policies should always contain a rule to check this variable. Depending on the rate of false positives and your default policy you should decide whether to block or just warn when the rule is triggered.\u003c/p\u003e
\u003cp\u003eThe best way to use this variable is as in the example below:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule OUTBOUND_DATA_ERROR \u0026quot;@eq 1\u0026quot; \u0026quot;phase:1,id:32,t:none,log,pass,msg:'Response Body Larger than SecResponseBodyLimit Setting'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="path_info"\u003ePATH_INFO\u003c/h2\u003e
\u003cp\u003eContains the extra request URI information, also known as path info. (For example, in the URI /index.php/123, /123 is the path info.) Available only in embedded deployments.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule PATH_INFO \u0026quot;^/(bin|etc|sbin|opt|usr)\u0026quot; \u0026quot;id:33\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="perf_all"\u003ePERF_ALL\u003c/h2\u003e
\u003cp\u003eThis special variable contains a string that’s a combination of all other performance variables, arranged in the same order in which they appear in the Stopwatch2 audit log header. It’s intended for use in custom Apache logs\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_combined"\u003ePERF_COMBINED\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent in Coraza during the current transaction. The value in this variable is arrived to by adding all the performance variables except PERF_SREAD (the time spent reading from persistent storage is already included in the phase measurements).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003ePERF_GC
Contains the time, in microseconds, spent performing garbage collection.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_logging"\u003ePERF_LOGGING\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent in audit logging. This value is known only after the handling of a transaction is finalized, which means that it can only be logged using mod_log_config and the %{VARNAME}M syntax.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_phase1"\u003ePERF_PHASE1\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent processing phase 1.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_phase2"\u003ePERF_PHASE2\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent processing phase 2.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_phase3"\u003ePERF_PHASE3\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent processing phase 3.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_phase4"\u003ePERF_PHASE4\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent processing phase 4.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_phase5"\u003ePERF_PHASE5\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent processing phase 5.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_rules"\u003ePERF_RULES\u003c/h2\u003e
\u003cp\u003ePERF_RULES is a collection, that is populated with the rules hitting the performance threshold defined with SecRulePerfTime. The collection contains the time, in microseconds, spent processing the individual rule. The various items in the collection can be accessed via the rule id.\u003c/p\u003e
\u003cp\u003eSupported on Coraza: TBI\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRulePerfTime            100

SecRule FILES_TMPNAMES \u0026quot;@inspectFile /path/to/util/runav.pl\u0026quot; \\
  \u0026quot;phase:2,id:10001,deny,log,msg:'Virus scan detected an error.'\u0026quot;

SecRule   \u0026amp;PERF_RULES \u0026quot;@eq 0\u0026quot;    \u0026quot;phase:5,id:95000,\\
  pass,log,msg:'All rules performed below processing time limit.'\u0026quot;
SecRule   PERF_RULES  \u0026quot;@ge 1000\u0026quot; \u0026quot;phase:5,id:95001,pass,log,\\
  msg:'Rule %{MATCHED_VAR_NAME} spent at least 1000 usec.'\u0026quot;
SecAction \u0026quot;phase:5,id:95002,pass,log, msg:'File inspection took %{PERF_RULES.10001} usec.'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe rule with id 10001 defines an external file inspection rule. The rule with id 95000 checks the size of the PERF_RULES collection. If the collection is empty, it writes a note in the logfile. Rule 95001 is executed for every item in the PERF_RULES collection. Every item is thus being checked against the limit of 1000 microseconds. If the rule spent at least that amount of time, then a note containing the rule id is being written to the logfile. The final rule 95002 notes the time spent in rule 10001 (the virus inspection).\u003c/p\u003e
\u003ch2 id="perf_sread"\u003ePERF_SREAD\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent reading from persistent storage.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="perf_swrite"\u003ePERF_SWRITE\u003c/h2\u003e
\u003cp\u003eContains the time, in microseconds, spent writing to persistent storage.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cp\u003e## QUERY_STRING
Contains the query string part of a request URI. The value in QUERY_STRING is always provided raw, without URL decoding taking place.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule QUERY_STRING \u0026quot;attack\u0026quot; \u0026quot;id:34\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e## REMOTE_ADDR
This variable holds the IP address of the remote client.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_ADDR \u0026quot;@ipMatch 192.168.1.101\u0026quot; \u0026quot;id:35\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="remote_host"\u003eREMOTE_HOST\u003c/h2\u003e
\u003cp\u003eIf the Apache directive HostnameLookups is set to On, then this variable will hold the remote hostname resolved through DNS. If the directive is set to Off, this variable it will hold the remote IP address (same as REMOTE_ADDR). Possible uses for this variable would be to deny known bad client hosts or network blocks, or conversely, to allow in authorized hosts.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_HOST \u0026quot;\\.evil\\.network\\org\$\u0026quot; \u0026quot;id:36\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="remote_port"\u003eREMOTE_PORT\u003c/h2\u003e
\u003cp\u003eThis variable holds information on the source port that the client used when initiating the connection to our web server.\u003c/p\u003e
\u003cp\u003eIn the following example, we are evaluating to see whether the REMOTE_PORT is less than 1024, which would indicate that the user is a privileged user:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_PORT \u0026quot;@lt 1024\u0026quot; \u0026quot;id:37\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="remote_user"\u003eREMOTE_USER\u003c/h2\u003e
\u003cp\u003eThis variable holds the username of the authenticated user. If there are no password access controls in place (Basic or Digest authentication), then this variable will be empty.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REMOTE_USER \u0026quot;@streq admin\u0026quot; \u0026quot;id:38\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e In a reverse-proxy deployment, this information will not be available if the authentication is handled in the backend web server.\u003c/p\u003e
\u003ch2 id="reqbody_error"\u003eREQBODY_ERROR\u003c/h2\u003e
\u003cp\u003eContains the status of the request body processor used for request body parsing. The values can be 0 (no error) or 1 (error). This variable will be set by request body processors (typically the multipart/request-data parser, JSON or the XML parser) when they fail to do their work.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQBODY_ERROR \u0026quot;@eq 1\u0026quot; deny,phase:2,id:39
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Your policies must have a rule to check for request body processor errors at the very beginning of phase 2. Failure to do so will leave the door open for impedance mismatch attacks. It is possible, for example, that a payload that cannot be parsed by Coraza can be successfully parsed by more tolerant parser operating in the application. If your policy dictates blocking, then you should reject the request if error is detected. When operating in detection-only mode, your rule should alert with high severity when request body processing fails.\u003c/p\u003e
\u003ch2 id="reqbody_error_msg"\u003eREQBODY_ERROR_MSG\u003c/h2\u003e
\u003cp\u003eIf there’s been an error during request body parsing, the variable will contain the following error message:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQBODY_ERROR_MSG \u0026quot;failed to parse\u0026quot; \u0026quot;id:40\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="reqbody_processor"\u003eREQBODY_PROCESSOR\u003c/h2\u003e
\u003cp\u003eContains the name of the currently used request body processor. The possible values are URLENCODED, JSON, MULTIPART, and XML.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQBODY_PROCESSOR \u0026quot;^XML\$ chain,id:41 
  SecRule XML://* \u0026quot;something\u0026quot; \u0026quot;id:123\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="request_basename"\u003eREQUEST_BASENAME\u003c/h2\u003e
\u003cp\u003eThis variable holds just the filename part of REQUEST_FILENAME (e.g., index.php).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_BASENAME \u0026quot;^login\\.php\$\u0026quot; phase:2,id:42,t:none,t:lowercase
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Please note that anti-evasion transformations are not applied to this variable by default. REQUEST_BASENAME will recognize both / and \\ as path separators. You should understand that the value of this variable depends on what was provided in request, and that it does not have to correspond to the resource (on disk) that will be used by the web server.\u003c/p\u003e
\u003ch2 id="request_body"\u003eREQUEST_BODY\u003c/h2\u003e
\u003cp\u003eHolds the raw request body. This variable is available only if the URLENCODED request body processor was used, which will occur by default when the application/x-www-form-urlencoded content type is detected, or if the use of the URLENCODED request body parser was forced.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_BODY \u0026quot;^username=\\w{25,}\\\u0026amp;password=\\w{25,}\\\u0026amp;Submit\\=login\$\u0026quot; \u0026quot;id:43\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIt is possible to force the presence of the REQUEST_BODY variable, but only when there is no request body processor defined using the \u003ccode\u003ectl:forceRequestBodyVariable\u003c/code\u003e option in the REQUEST_HEADERS phase.\u003c/p\u003e
\u003ch2 id="request_body_length"\u003eREQUEST_BODY_LENGTH\u003c/h2\u003e
\u003cp\u003eContains the number of bytes read from a request body.\u003c/p\u003e
\u003ch2 id="request_cookies"\u003eREQUEST_COOKIES\u003c/h2\u003e
\u003cp\u003eThis variable is a collection of all of request cookies (values only). Example: the following example is using the Ampersand special operator to count how many variables are in the collection. In this rule, it would trigger if the request does not include any Cookie headers.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule \u0026amp;REQUEST_COOKIES \u0026quot;@eq 0\u0026quot; \u0026quot;id:44\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="request_cookies_names"\u003eREQUEST_COOKIES_NAMES\u003c/h2\u003e
\u003cp\u003eThis variable is a collection of the names of all request cookies. For example, the following rule will trigger if the JSESSIONID cookie is not present:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule \u0026amp;REQUEST_COOKIES_NAMES:JSESSIONID \u0026quot;@eq 0\u0026quot; \u0026quot;id:45\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="request_filename"\u003eREQUEST_FILENAME\u003c/h2\u003e
\u003cp\u003eThis variable holds the relative request URL without the query string part (e.g., /index.php).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_FILENAME \u0026quot;^/cgi-bin/login\\.php\$\u0026quot; phase:2,id:46,t:none,t:normalizePath
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Please note that anti-evasion transformations are not used on REQUEST_FILENAME, which means that you will have to specify them in the rules that use this variable.\u003c/p\u003e
\u003ch2 id="request_headers"\u003eREQUEST_HEADERS\u003c/h2\u003e
\u003cp\u003eThis variable can be used as either a collection of all of the request headers or can be used to inspect selected headers (by using the REQUEST_HEADERS:Header-Name syntax).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS:Host \u0026quot;^[\\d\\.]+\$\u0026quot; \u0026quot;deny,id:47,log,status:400,msg:'Host header is a numeric IP address'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Coraza will treat multiple headers that have identical names as a \u0026ldquo;list\u0026rdquo;, processing each single value.\u003c/p\u003e
\u003ch2 id="request_headers_names"\u003eREQUEST_HEADERS_NAMES\u003c/h2\u003e
\u003cp\u003eThis variable is a collection of the names of all of the request headers.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_HEADERS_NAMES \u0026quot;^x-forwarded-for\u0026quot; \u0026quot;log,deny,id:48,status:403,t:lowercase,msg:'Proxy Server Used'\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="request_line"\u003eREQUEST_LINE\u003c/h2\u003e
\u003cp\u003eThis variable holds the complete request line sent to the server (including the request method and HTTP version information).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Allow only POST, GET and HEAD request methods, as well as only
# the valid protocol versions 
SecRule REQUEST_LINE \u0026quot;!(^((?:(?:POS|GE)T|HEAD))|HTTP/(0\\.9|1\\.0|1\\.1)\$)\u0026quot; \u0026quot;phase:1,id:49,log,block,t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="request_method"\u003eREQUEST_METHOD\u003c/h2\u003e
\u003cp\u003eThis variable holds the request method used in the transaction.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_METHOD \u0026quot;^(?:CONNECT|TRACE)\$\u0026quot; \u0026quot;id:50,t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="request_protocol"\u003eREQUEST_PROTOCOL\u003c/h2\u003e
\u003cp\u003eThis variable holds the request protocol version information.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_PROTOCOL \u0026quot;!^HTTP/(0\\.9|1\\.0|1\\.1)\$\u0026quot; \u0026quot;id:51\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e## REQUEST_URI
This variable holds the full request URL including the query string data (e.g., /index.php? p=X). However, it will never contain a domain name, even if it was provided on the request line.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_URI \u0026quot;attack\u0026quot; \u0026quot;phase:1,id:52,t:none,t:urlDecode,t:lowercase,t:normalizePath\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Please note that anti-evasion transformations are not used on REQUEST_URI, which means that you will have to specify them in the rules that use this variable.\u003c/p\u003e
\u003ch2 id="request_uri_raw"\u003eREQUEST_URI_RAW\u003c/h2\u003e
\u003cp\u003eSame as REQUEST_URI but will contain the domain name if it was provided on the request line (e.g., http://www.example.com/index.php?p=X).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule REQUEST_URI_RAW \u0026quot;http:/\u0026quot; \u0026quot;phase:1,id:53,t:none,t:urlDecode,t:lowercase,t:normalizePath\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eNote :\u003c/strong\u003e Please note that anti-evasion transformations are not used on REQUEST_URI_RAW, which means that you will have to specify them in the rules that use this variable.\u003c/p\u003e
\u003ch2 id="response_body"\u003eRESPONSE_BODY\u003c/h2\u003e
\u003cp\u003eThis variable holds the data for the response body, but only when response body buffering is enabled.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_BODY \u0026quot;ODBC Error Code\u0026quot; \u0026quot;phase:4,id:54,t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="response_content_length"\u003eRESPONSE_CONTENT_LENGTH\u003c/h2\u003e
\u003cp\u003eResponse body length in bytes. Can be available starting with phase 3, but it does not have to be (as the length of response body is not always known in advance). If the size is not known, this variable will contain a zero. If RESPONSE_CONTENT_LENGTH contains a zero in phase 5 that means the actual size of the response body was 0. The value of this variable can change between phases if the body is modified. For example, in embedded mode, mod_deflate can compress the response body between phases 4 and 5.\u003c/p\u003e
\u003ch2 id="response_content_type"\u003eRESPONSE_CONTENT_TYPE\u003c/h2\u003e
\u003cp\u003eResponse content type. Available only starting with phase 3. The value available in this variable is taken directly from the internal structures of Apache, which means that it may contain the information that is not yet available in response headers. In embedded deployments, you should always refer to this variable, rather than to RESPONSE_HEADERS:Content-Type.\u003c/p\u003e
\u003ch2 id="response_headers"\u003eRESPONSE_HEADERS\u003c/h2\u003e
\u003cp\u003eThis variable refers to response headers, in the same way as REQUEST_HEADERS does to request headers.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_HEADERS:X-Cache \u0026quot;MISS\u0026quot; \u0026quot;id:55\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis variable may not have access to some headers when running in embedded mode. Headers such as Server, Date, Connection, and Content-Type could be added just prior to sending the data to the client. This data should be available in phase 5 or when deployed in proxy mode.\u003c/p\u003e
\u003ch2 id="response_headers_names"\u003eRESPONSE_HEADERS_NAMES\u003c/h2\u003e
\u003cp\u003eThis variable is a collection of the response header names.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_HEADERS_NAMES \u0026quot;Set-Cookie\u0026quot; \u0026quot;phase:3,id:56,t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe same limitations apply as the ones discussed in RESPONSE_HEADERS.\u003c/p\u003e
\u003ch2 id="response_protocol"\u003eRESPONSE_PROTOCOL\u003c/h2\u003e
\u003cp\u003eThis variable holds the HTTP response protocol information.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_PROTOCOL \u0026quot;^HTTP\\/0\\.9\u0026quot; \u0026quot;phase:3,id:57,t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="response_status"\u003eRESPONSE_STATUS\u003c/h2\u003e
\u003cp\u003eThis variable holds the HTTP response status code:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule RESPONSE_STATUS \u0026quot;^[45]\u0026quot; \u0026quot;phase:3,id:58,t:none\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis variable may not work as expected, as some implementations might change the status before releasing the output buffers.\u003c/p\u003e
\u003ch2 id="rule"\u003eRULE\u003c/h2\u003e
\u003cp\u003eThis is a special collection that provides access to the id, rev, severity, logdata, and msg fields of the rule that triggered the action. It can be used to refer to only the same rule in which it resides.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule \u0026amp;REQUEST_HEADERS:Host \u0026quot;@eq 0\u0026quot; \u0026quot;log,deny,id:59,setvar:tx.varname=%{RULE.id}\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="server_addr"\u003eSERVER_ADDR\u003c/h2\u003e
\u003cp\u003eThis variable contains the IP address of the server.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule SERVER_ADDR \u0026quot;@ipMatch 192.168.1.100\u0026quot; \u0026quot;id:67\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="server_name"\u003eSERVER_NAME\u003c/h2\u003e
\u003cp\u003eThis variable contains the transaction’s hostname or IP address, taken from the request itself (which means that, in principle, it should not be trusted).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule SERVER_NAME \u0026quot;hostname\\.com\$\u0026quot; \u0026quot;id:68\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="server_port"\u003eSERVER_PORT\u003c/h2\u003e
\u003cp\u003eThis variable contains the local port that the web server (or reverse proxy) is listening on.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule SERVER_PORT \u0026quot;^80\$\u0026quot; \u0026quot;id:69\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="session"\u003eSESSION\u003c/h2\u003e
\u003cp\u003eThis variable is a collection that contains session information. It becomes available only after setsid is executed.\u003c/p\u003e
\u003cp\u003eThe following example shows how to initialize SESSION using setsid, how to use setvar to increase the SESSION.score values, how to set the SESSION.blocked variable, and finally, how to deny the connection based on the SESSION:blocked value:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Initialize session storage 
SecRule REQUEST_COOKIES:PHPSESSID !^\$ \u0026quot;phase:2,id:70,nolog,pass,setsid:%{REQUEST_COOKIES.PHPSESSID}\u0026quot;

# Increment session score on attack 
SecRule REQUEST_URI \u0026quot;^/cgi-bin/finger\$\u0026quot; \u0026quot;phase:2,id:71,t:none,t:lowercase,t:normalizePath,pass,setvar:SESSION.score=+10\u0026quot; 

# Detect too many attacks in a session
SecRule SESSION:score \u0026quot;@gt 50\u0026quot; \u0026quot;phase:2,id:72,pass,setvar:SESSION.blocked=1\u0026quot;

# Enforce session block 
SecRule SESSION:blocked \u0026quot;@eq 1\u0026quot; \u0026quot;phase:2,id:73,deny,status:403\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="sessionid"\u003eSESSIONID\u003c/h2\u003e
\u003cp\u003eThis variable contains the value set with setsid. See SESSION (above) for a complete example.\u003c/p\u003e
\u003ch2 id="status_line"\u003eSTATUS_LINE\u003c/h2\u003e
\u003cp\u003eThis variable holds the full status line sent by the server (including the request method and HTTP version information).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Generate an alert when the application generates 500 errors.
SecRule STATUS_LINE \u0026quot;@contains 500\u0026quot; \u0026quot;phase:3,id:49,log,pass,logdata:'Application error detected!,t:none\u0026quot;
Version: 2.x
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e\u003cstrong\u003eSupported on Coraza:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="time"\u003eTIME\u003c/h2\u003e
\u003cp\u003eThis variable holds a formatted string representing the time (hour:minute:second).\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME \u0026quot;^(([1](8|9))|([2](0|1|2|3))):\\d{2}:\\d{2}\$\u0026quot; \u0026quot;id:74\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003e## TIME_DAY
This variable holds the current date (1–31). The following rule triggers on a transaction that’s happening anytime between the 10th and 20th in a month:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_DAY \u0026quot;^(([1](0|1|2|3|4|5|6|7|8|9))|20)\$\u0026quot; \u0026quot;id:75\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="time_epoch"\u003eTIME_EPOCH\u003c/h2\u003e
\u003cp\u003eThis variable holds the time in seconds since 1970.\u003c/p\u003e
\u003ch2 id="time_hour"\u003eTIME_HOUR\u003c/h2\u003e
\u003cp\u003eThis variable holds the current hour value (0–23). The following rule triggers when a request is made “off hours”:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_HOUR \u0026quot;^(0|1|2|3|4|5|6|[1](8|9)|[2](0|1|2|3))\$\u0026quot; \u0026quot;id:76\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="time_min"\u003eTIME_MIN\u003c/h2\u003e
\u003cp\u003eThis variable holds the current minute value (0–59). The following rule triggers during the last half hour of every hour:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_MIN \u0026quot;^(3|4|5)\u0026quot; \u0026quot;id:77\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="time_mon"\u003eTIME_MON\u003c/h2\u003e
\u003cp\u003eThis variable holds the current month value (0–11). The following rule matches if the month is either November (value 10) or December (value 11):\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_MON \u0026quot;^1\u0026quot; \u0026quot;id:78\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="time_sec"\u003eTIME_SEC\u003c/h2\u003e
\u003cp\u003eThis variable holds the current second value (0–59).\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_SEC \u0026quot;@gt 30\u0026quot; \u0026quot;id:79\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="time_wday"\u003eTIME_WDAY\u003c/h2\u003e
\u003cp\u003eThis variable holds the current weekday value (0–6). The following rule triggers only on Satur- day and Sunday:\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_WDAY \u0026quot;^(0|6)\$\u0026quot; \u0026quot;id:80\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="time_year"\u003eTIME_YEAR\u003c/h2\u003e
\u003cp\u003eThis variable holds the current four-digit year value.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule TIME_YEAR \u0026quot;^2006\$\u0026quot; \u0026quot;id:81\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="tx"\u003eTX\u003c/h2\u003e
\u003cp\u003eThis is the transient transaction collection, which is used to store pieces of data, create a transaction anomaly score, and so on. The variables placed into this collection are available only until the transaction is complete.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Increment transaction attack score on attack 
SecRule ARGS attack \u0026quot;phase:2,id:82,nolog,pass,setvar:TX.score=+5\u0026quot;

# Block the transactions whose scores are too high 
SecRule TX:SCORE \u0026quot;@gt 20\u0026quot; \u0026quot;phase:2,id:83,log,deny\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eSome variable names in the TX collection are reserved and cannot be used:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eTX:0:\u003c/strong\u003e the matching value when using the @rx or @pm operator with the capture action\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eTX:1-TX:9:\u003c/strong\u003e the captured subexpression value when using the @rx operator with capturing parens and the capture action\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="unique_id"\u003eUNIQUE_ID\u003c/h2\u003e
\u003cp\u003eThis variable holds the unique id for the transaction.\u003c/p\u003e
\u003ch2 id="urlencoded_error"\u003eURLENCODED_ERROR\u003c/h2\u003e
\u003cp\u003eThis variable is created when an invalid URL encoding is encountered during the parsing of a query string (on every request) or during the parsing of an application/x-www-form-urlencoded request body (only on the requests that use the URLENCODED request body processor).\u003c/p\u003e
\u003ch2 id="userid"\u003eUSERID\u003c/h2\u003e
\u003cp\u003eThis variable contains the value set with setuid.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003e# Initialize user tracking
SecAction \u0026quot;nolog,id:84,pass,setuid:%{REMOTE_USER}\u0026quot; 

# Is the current user the administrator?
SecRule USERID \u0026quot;admin\u0026quot; \u0026quot;id:85\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="webappid"\u003eWEBAPPID\u003c/h2\u003e
\u003cp\u003eThis variable contains the current application name, which is set in configuration using SecWebAppId.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eSupported:\u003c/strong\u003e TBI\u003c/p\u003e
\u003ch2 id="xml"\u003eXML\u003c/h2\u003e
\u003cp\u003eSpecial collection used to interact with the XML parser. It must contain a valid XPath expression, which will then be evaluated against a previously parsed XML DOM tree.\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecDefaultAction log,deny,status:403,phase:2,id:90
SecRule REQUEST_HEADERS:Content-Type ^text/xml\$ \u0026quot;phase:1,id:87,t:lowercase,nolog,pass,ctl:requestBodyProcessor=XML\u0026quot;
SecRule REQBODY_PROCESSOR \u0026quot;!^XML\$\u0026quot; skipAfter:12345,id:88
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIt would match against payload such as this one:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-xml"\u003e\u0026lt;employees\u0026gt;
    \u0026lt;employee\u0026gt;
        \u0026lt;name\u0026gt;Fred Jones\u0026lt;/name\u0026gt;
        \u0026lt;address location=\u0026quot;home\u0026quot;\u0026gt;
            \u0026lt;street\u0026gt;900 Aurora Ave.\u0026lt;/street\u0026gt;
            \u0026lt;city\u0026gt;Seattle\u0026lt;/city\u0026gt;
            \u0026lt;state\u0026gt;WA\u0026lt;/state\u0026gt;
            \u0026lt;zip\u0026gt;98115\u0026lt;/zip\u0026gt;
        \u0026lt;/address\u0026gt;
        \u0026lt;address location=\u0026quot;work\u0026quot;\u0026gt;
            \u0026lt;street\u0026gt;2011 152nd Avenue NE\u0026lt;/street\u0026gt;
            \u0026lt;city\u0026gt;Redmond\u0026lt;/city\u0026gt;
            \u0026lt;state\u0026gt;WA\u0026lt;/state\u0026gt;
            \u0026lt;zip\u0026gt;98052\u0026lt;/zip\u0026gt;
        \u0026lt;/address\u0026gt;
        \u0026lt;phone location=\u0026quot;work\u0026quot;\u0026gt;(425)555-5665\u0026lt;/phone\u0026gt;
        \u0026lt;phone location=\u0026quot;home\u0026quot;\u0026gt;(206)555-5555\u0026lt;/phone\u0026gt;
        \u0026lt;phone location=\u0026quot;mobile\u0026quot;\u0026gt;(206)555-4321\u0026lt;/phone\u0026gt;
    \u0026lt;/employee\u0026gt;
\u0026lt;/employees\u0026gt;
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:9,href:"https://coraza.io/docs/tutorials/quick-start/",title:"Quick Start",description:"One page summary of how to start a new Coraza WAF project.",content:`\u003cp\u003eIf you are not looking to use Coraza WAF as a library and you want a working WAF implementation or integration, check the integrations page.\u003c/p\u003e
\u003ch2 id="requirements"\u003eRequirements\u003c/h2\u003e
\u003cul\u003e
\u003cli\u003eGolang 1.16+\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="add-coraza-to-your-go-project"\u003eAdd Coraza to your go project\u003c/h2\u003e
\u003cpre\u003e\u003ccode class="language-sh"\u003ego get github.com/jptosso/coraza-waf/v2@latest
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="create-a-waf-instance"\u003eCreate a WAF instance\u003c/h3\u003e
\u003cp\u003eWAF instances are the main container for settings and rules which are inherited by transactions that will process requests, responses and logging. A WAF instance can be created like this:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003epackage main
import (
  \u0026quot;github.com/jptosso/coraza-waf/v2\u0026quot;
)
func initCoraza(){
  coraza.NewWaf()
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="adding-rules-to-a-waf-instance"\u003eAdding rules to a Waf Instance\u003c/h3\u003e
\u003cp\u003eSeclang rules syntax is used to create Coraza Rules which will be evaluated by transactions and apply disruptive actions like deny(403) or just log the event. See the Seclang references.\u003c/p\u003e
\u003cp\u003eRules are unmarshaled using the seclang package which provides functionalities to compile rules from files or strings.\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003epackage main
import (
  \u0026quot;github.com/jptosso/coraza-waf/v2\u0026quot;
  \u0026quot;github.com/jptosso/coraza-waf/v2/seclang\u0026quot;
)
func parseRules(waf *coraza.Waf){
  parser, _ := seclang.NewParser(waf)
  if err := parser.FromString(\`SecAction \u0026quot;id:1,phase:1,deny:403,log\u0026quot;\`); err != nil {
    panic(err)
  }
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="creating-a-transaction"\u003eCreating a transaction\u003c/h3\u003e
\u003cp\u003eTransactions are created for each http request, they are concurrent-safe and they handle \u003ca href="#"\u003ePhases\u003c/a\u003e to evaluate rules and generate audit and interruptions. A transaction can be created using \u003ccode\u003ewaf.NewTransaction()\u003c/code\u003e.\u003c/p\u003e
\u003ch4 id="handling-an-interruption"\u003eHandling an interruption\u003c/h4\u003e
\u003cp\u003eInterruptions are created by Transactions to tell the web server or application what action is required, based on the rules actions. Interruptions can be retrieved using \u003ccode\u003etx.Interruption\u003c/code\u003e, a nil Interruption means there is no action needed (pass) and a non-nil interruption means the web server must do something like denying the request. For example:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003e//...
tx := waf.NewTransaction()
// Add some variables and process some phases
if it := tx.Interruption;it != nil {
  switch it.Action {
    case \u0026quot;deny\u0026quot;:
      rw.WriteStatus(it.Status)
      rw.Write([]byte(\u0026quot;Some error message\u0026quot;))
      return
  }
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch4 id="handling-a-request"\u003eHandling a request\u003c/h4\u003e
\u003cp\u003eThere are two ways to handle a Request, you can manually process each phase for the request or you can send a http.Request to Coraza.\u003c/p\u003e
\u003cp\u003eTo process an http.Request struct you must use the \u003ccode\u003etx.ProcessRequest(req)\u003c/code\u003e helper. ProcessRequest will evaluate phases 1 and 2, and will stop the execution flow if the transaction was disrupted. \u003cstrong\u003eImportant\u003c/strong\u003e: req.Body will be read replaced with a new pointer, pointing to a buffer or file created by Coraza.\u003c/p\u003e
\u003cp\u003eTo manually process a request we must run 5 functions in the following order:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eProcessConnection\u003c/strong\u003e: Creates variables with connection information like IP addresses and ports.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eProcessUri\u003c/strong\u003e: Creates variables from strings extracted from the Request Line, these are method, url and protocol.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eAddRequestHeader\u003c/strong\u003e: Must be run for each HTTP header, it will create headers variables and cookies.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eProcessRequestHeaders\u003c/strong\u003e: Evaluates phase 1 rules with all the variables felt before. This functions is disruptive.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRequestBodyBuffer.Write\u003c/strong\u003e: Writes to the request body buffer, you can just \u003ccode\u003eio.Copy(tx.RequestBodyBuffer, someReader)\u003c/code\u003e\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eProcessRequestBody\u003c/strong\u003e: Evaluates phase 2 rules with the \u003ccode\u003eREQUEST_BODY\u003c/code\u003e and POST variables. There are other cases like MULTIPART, JSON and XML\u003c/li\u003e
\u003c/ul\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003etx := waf.NewTransaction()
// 127.0.0.1:55555 -\u0026gt; 127.0.0.1:80
tx.ProcessConnection(\u0026quot;127.0.0.1\u0026quot;, 55555, \u0026quot;127.0.0.1\u0026quot;, 80)
// Request URI was /some-url?with=args
tx.ProcessURI(\u0026quot;/some-url?with=args\u0026quot;)
// We add some headers
tx.AddRequestHeader(\u0026quot;Host\u0026quot;, \u0026quot;somehost.com\u0026quot;)
tx.AddRequestHeader(\u0026quot;Cookie\u0026quot;, \u0026quot;some-cookie=with-value\u0026quot;)
// Content-Type is important to tell coraza which BodyProcessor must be used
tx.AddRequestHeader(\u0026quot;Content-Type\u0026quot;, \u0026quot;application/x-www-form-urlencoded\u0026quot;)
// We process phase 1 (Request)
if it := tx.ProcessRequestHeaders();it != nil {
  return processInterruption(it)
}
// We add urlencoded POST data
tx.RequestBodyBuffer.Write([]byte(\u0026quot;somepost=data\u0026amp;with=paramenters\u0026quot;))
// We process phase 2 (Request Body)
if it := tx.ProcessRequestBody();it != nil {
  return processInterruption(it)
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch4 id="handling-a-response"\u003eHandling a response\u003c/h4\u003e
\u003cp\u003eResponses are harder to handler, that\u0026rsquo;s why there is no helper to do that. Many integrations requires you to create \u0026ldquo;body interceptors\u0026rdquo; or other kind of functions.\u003c/p\u003e
\u003cp\u003eThere is a special helper, \u003ccode\u003eIsProcessableResponseBody\u003c/code\u003e that returns \u003cstrong\u003etrue\u003c/strong\u003e if the request can be intercepted by Coraza
In the magical case that you are handling an http.Response or a bytes buffer, you can use:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003etx := waf.NewTransaction()
//parse request...
tx.AddResponseHeader(\u0026quot;some\u0026quot;, \u0026quot;header\u0026quot;)
if it := tx.ProcessResponseHeaders(200); it != nil {
  return processInterruption(it)
}
if !tx.IsProcessableResponseBody() {
  // We stream the response to the client
  sw.WriteStatus(200)
  sw.Write(res.Body)
  sw.Close()
  return
}

//Add response data from a string or bytes:
tx.ResponseBodyBuffer.Write([]byte(\u0026quot;some response data\u0026quot;))
//Or dump a Response.Body buffer into Coraza
io.Copy(tx.ResponseBodyBuffer, res.Body)

sw.WriteStatus(200)
sw.Write(tx.ResponseBodyBuffer.Reader())
sw.Close()
\u003c/code\u003e\u003c/pre\u003e
\u003ch4 id="handling-logging"\u003eHandling logging\u003c/h4\u003e
\u003cp\u003eLogging is a mandatory phase that has to be processed even if the transaction was disrupted. The best way to force calling \u003ccode\u003eProcessLogging()\u003c/code\u003e is to use defer, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003e//...
tx := waf.NewTransaction()
defer tx.ProcessLogging()
//Process phases
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:10,href:"https://coraza.io/docs/tutorials/coreruleset/",title:"OWASP Core Ruleset",description:"OWASP Core Ruleset is the most robust open source WAF rule set available in the internet, compatible with Coraza",content:`\u003cp\u003e\u003cstrong\u003eImportant:\u003c/strong\u003e OWASP Core Ruleset requires \u003ca href="https://github.com/jptosso/coraza-libinjection"\u003ecoraza-libinjection\u003c/a\u003e and \u003ca href="https://github.com/jptosso/coraza-pcre"\u003ecoraza-pcre\u003c/a\u003e plugins to work. There is an upcoming fork that removes the need for the plugins by removing a few features and rewriting some @rx operators to RE2 instead of PCRE.\u003c/p\u003e
\u003ch2 id="installation"\u003eInstallation\u003c/h2\u003e
\u003cp\u003eCore Ruleset can be normally installed by importing each required file in the following order:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-sh"\u003ewget https://raw.githubusercontent.com/jptosso/coraza-waf/v2/master/coraza.conf-recommended -O coraza.conf
git clone https://github.com/coreruleset/coreruleset
\u003c/code\u003e\u003c/pre\u003e
\u003col\u003e
\u003cli\u003ecoraza.conf\u003c/li\u003e
\u003cli\u003ecoreruleset/crs-setup.conf.example\u003c/li\u003e
\u003cli\u003ecoreruleset/rules/*.conf\u003c/li\u003e
\u003c/ol\u003e
\u003cp\u003eFor example:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003efunc initCoraza(){
  waf := coraza.NewWaf()
  parser, _ := seclang.NewParser(waf)
  files := []string{
    \u0026quot;coraza.conf\u0026quot;,
    \u0026quot;coreruleset/crs-setup.conf.example\u0026quot;,
    \u0026quot;coreruleset/rules/*.conf\u0026quot;,
  }
  for _, f := range files {
    if err := parser.FromFile(f); err != nil {
      panic(err)
    }
  }
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="configuration"\u003eConfiguration\u003c/h2\u003e
\u003cp\u003ePlease check \u003ca href="https://coreruleset.org/installation/"\u003ehttps://coreruleset.org/installation/\u003c/a\u003e for configuration examples.\u003c/p\u003e
`}).add({id:11,href:"https://coraza.io/docs/reference/internals/",title:"Internals",description:"",content:`\u003ch2 id="waf-engine"\u003eWAF Engine\u003c/h2\u003e
\u003cp\u003eWaf is the main interface used to store settings, rules and create transactions, most directives will set variables for Waf instances. A coraza implementation might have unlimited Waf instances and each Waf might process unlimited transactions.\u003c/p\u003e
\u003ch2 id="transactions"\u003eTransactions\u003c/h2\u003e
\u003cp\u003eTransactions are an instance of an url call for a Waf instance, transactions are created with \u003ccode\u003ewafinstance.NewTransaction()\u003c/code\u003e. Transactions holds collections and configurations that may be updated using rules.\u003c/p\u003e
\u003ch2 id="macro-expansion"\u003eMacro Expansion\u003c/h2\u003e
\u003cp\u003eMacro expansions are a function available for \u003ccode\u003etransactions\u003c/code\u003e, a macro expansion will compile a string and provide variables data to the current context. Macro expansion is performed by running a regular expresion that will find \u003ccode\u003e%{request_headers.test}\u003c/code\u003e and replace it with it\u0026rsquo;s value using:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003ev1 := tx.GetCollection(variables.RequestHeaders).GetFirstString(\u0026quot;test\u0026quot;)
v2 := tx.MacroExpansion(\u0026quot;%{request_headers.test}\u0026quot;)
v1 == v2
// true
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="rules"\u003eRules\u003c/h2\u003e
\u003cp\u003eRules are triggered by \u003ccode\u003eRuleGroup.Evaluate(phase)\u003c/code\u003e based on the phase number, rules with phase 0 or \u003ccode\u003erule.AlwaysMatch\u003c/code\u003e will always run. Rules that always run are SecMarkers or SecActions which means rules without operators.\u003c/p\u003e
\u003cp\u003eRules marked with a SecMarker will be used to control execution flow and tell the transaction to stop skipping rules from \u003ccode\u003eskipAfter\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003eDifferent from ModSecurity, each rule is a unique struct in Coraza and is shared between each transaction of the same \u003ccode\u003eWaf\u003c/code\u003e instance, which means a transaction should never update any field from a Rule and all \u003cstrong\u003evariable\u003c/strong\u003e fields must be stored within the transaction instead.\u003c/p\u003e
\u003cp\u003eOnce a rule is triggered, it will follow the following flow:\u003c/p\u003e
\u003col\u003e
\u003cli\u003eSkip if this rule is removed for the current transaction\u003c/li\u003e
\u003cli\u003eFill the \u003ccode\u003eRULE\u003c/code\u003e variable data which contain fields from the current rule\u003c/li\u003e
\u003cli\u003eApply removed targets for this transaction\u003c/li\u003e
\u003cli\u003eCompile each \u003ccode\u003evariable\u003c/code\u003e, normal, counters, negations and \u0026ldquo;always match\u0026rdquo;\u003c/li\u003e
\u003cli\u003eApply transformations for each variable, match or multimatch\u003c/li\u003e
\u003cli\u003eExecute the current operator for each variable\u003c/li\u003e
\u003cli\u003eContinue if there was any match\u003c/li\u003e
\u003cli\u003eEvaluate all non-disruptive actions\u003c/li\u003e
\u003cli\u003eEvaluate chains recursively\u003c/li\u003e
\u003cli\u003eLog data if requested\u003c/li\u003e
\u003cli\u003eEvaluate \u003ccode\u003edisruptive\u003c/code\u003e and \u003ccode\u003eflow\u003c/code\u003e rules\u003c/li\u003e
\u003c/ol\u003e
\u003cp\u003eThe return of this function contains each \u003ccode\u003eMatchData\u003c/code\u003e, which will tell the transaction where exactly the data was matched, \u003cstrong\u003eVariable, Key and Value\u003c/strong\u003e. Maybe we should add if it was negation in the future, SecActions and SecMarkers will return a placeholder.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eImportant:\u003c/strong\u003e Rules may update a \u003ccode\u003eTransaction\u003c/code\u003e behaviour but not a \u003ccode\u003eWaf\u003c/code\u003e instance.\u003c/p\u003e
\u003ch3 id="operators"\u003eOperators\u003c/h3\u003e
\u003cp\u003eOperators are stored in \u003ccode\u003egithub.com/jptosso/coraza-waf/v2/operators\u003c/code\u003e and contains an initializer and an evaluation function. Initializers are used to apply arguments during compilation, for example, \u003ccode\u003e\u0026quot;@rx /\\d+/\u0026quot;\u003c/code\u003e will run \u003ccode\u003eop.Init(\u0026quot;/\\\\d+\u0026quot;)\u003c/code\u003e. \u003ccode\u003eop.Evaluate(tx, \u0026quot;args\u0026quot;)\u003c/code\u003e is applied for each compiled variable and will return if the condition matches. Operators uses \u003ccode\u003eTransaction\u003c/code\u003e to create logs, capture fields and access additional variables from the transaction.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Operators must be concurrent-friendly\u003c/p\u003e
\u003ch3 id="actions"\u003eActions\u003c/h3\u003e
\u003cp\u003eActions are stored in \u003ccode\u003egithub.com/jptosso/coraza-waf/v2/actions\u003c/code\u003e and contains an initializer and an evaluation function, the initializers are evaluated during compilation, for example, \u003ccode\u003eid:4\u003c/code\u003e will run \u003ccode\u003eact.Init(\u0026quot;4\u0026quot;)\u003c/code\u003e. Depending on the \u003ccode\u003eType()\u003c/code\u003e of each action, it will run on different phases.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eNon-Disruptive:\u003c/strong\u003e Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain. \u003cstrong\u003eNon-disruptive rules are evaluated after the rule matches some data\u003c/strong\u003e.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eFlow actions:\u003c/strong\u003e These actions affect the rule flow (for example skip or skipAfter). Flow actions are evaluated after the rule successfully matched and will only run for the parent rule of a chain.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eMeta-data actions:\u003c/strong\u003e Meta-data actions are used to provide more information about rules. Examples include id, rev, severity and msg. Meta-data rules are only initialized, they won\u0026rsquo;t be evaluated, \u003ccode\u003eact.Evaluate(...)\u003c/code\u003e will never be called.\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="transformations"\u003eTransformations\u003c/h3\u003e
\u003cp\u003eTransformations are simple functions to transform some string into another string. There is a special struct called \u003ccode\u003etransactions.Tools\u003c/code\u003e, that contains useful \u0026ldquo;tools\u0026rdquo; required for some transformations, which are \u003ccode\u003eUnicodeMapping\u003c/code\u003e for \u003ccode\u003eutf8ToUnicode\u003c/code\u003e and \u003ccode\u003ewaf.Logger\u003c/code\u003e to debug transformations. More fields may be added in the future.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Transformations are evaluated thousands of times per transaction and they must be SUPER FAST.\u003c/p\u003e
\u003ch2 id="rule-groups"\u003eRule Groups\u003c/h2\u003e
\u003cp\u003eRule Groups are like Modsecurity \u003ccode\u003eRules\u003c/code\u003e, it\u0026rsquo;s just a container for rules that will return the list of rules concurrent-safe and will evaluate rules based on the requested phase.\u003c/p\u003e
\u003ch2 id="collections"\u003eCollections\u003c/h2\u003e
\u003cp\u003eCollections are used by Coraza to store \u003ccode\u003eVariables\u003c/code\u003e, all Variables are treated as the same type, even if they map values, they are single values or arrays.\u003c/p\u003e
\u003cp\u003eCollections are stored as a slice \u003ccode\u003e[]*Collection\u003c/code\u003e, each index is assigned based on it\u0026rsquo;s constant name provided by \u003ccode\u003evariables.go\u003c/code\u003e. For example, if you want to get a collection you might use \u003ccode\u003etx.GetCollection(variables.Files)\u003c/code\u003e. If you want to transform a named variable to it\u0026rsquo;s constant you may use:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003eb, _ := variables.ParseVariable(\u0026quot;FILES\u0026quot;)
tx.GetCollection(b)
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eIn the following example we are showing the output for \u003ccode\u003etx.GetCollection(variables.RequestHeaders).Data()\u003c/code\u003e.\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-json"\u003e{
    \u0026quot;user-agent\u0026quot;: [
        \u0026quot;some user agent string\u0026quot;
    ]
}
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eSome helpers may be used for this cases, like \u003ccode\u003etx.GetCollection(variables.RequestHeaders).GetFirstString(\u0026quot;\u0026quot;)\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003eVariables are compiled in runtime in order to support Regex(precompiled) and XML, the function \u003ccode\u003etx.GetField(variable)\u003c/code\u003e. Using RuleVariable.Exceptions and []exceptions might seem redundant but both are different, the list of exception is complemented from the rule. In case of Regex, \u003ccode\u003eGetField\u003c/code\u003e will use \u003ccode\u003eRuleVariable.Regex\u003c/code\u003e to match data instead of \u003ccode\u003eRuleVariable.Key\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003eNote:\u003c/strong\u003e Collections are not concurrent-safe, don\u0026rsquo;t share transactions between routines.\u003c/p\u003e
\u003ch2 id="phases"\u003ePhases\u003c/h2\u003e
\u003cp\u003ePhases are used by \u003ccode\u003eRuleGroup\u003c/code\u003e to filter between execution phases on HTTP/1.1 and HTTP/1.0.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003ePhase 1: Request Headers\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eThis phase process theorically consists in three phases:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eConnection (\u003ccode\u003etx.ProcessConnection()\u003c/code\u003e): Request address and port\u003c/li\u003e
\u003cli\u003eRequest line (\u003ccode\u003etx.ProcessURI()\u003c/code\u003e): Request URL, does not include GET arguments\u003c/li\u003e
\u003cli\u003eRequest headers (\u003ccode\u003etx.ProcessRequestHeaders()\u003c/code\u003e) Will evaluate phase 1\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003ePhase 2: Request Body\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eThis phase only runs when \u003ccode\u003eRequestBodyAcces\u003c/code\u003e is \u003ccode\u003eOn\u003c/code\u003e, otherwise we will skip to phase 3. This phase will do one of the following:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eReject transaction if the request body is too long and \u003ccode\u003eRequestBodyLimitAction\u003c/code\u003e is set to \u003ccode\u003eReject\u003c/code\u003e\u003c/li\u003e
\u003cli\u003eIf \u003ccode\u003eURLENCODED\u003c/code\u003e: set POST arguments and request_Body\u003c/li\u003e
\u003cli\u003eIf \u003ccode\u003eMULTIPART\u003c/code\u003e: Parse files and set FILES variables\u003c/li\u003e
\u003cli\u003eIf \u003ccode\u003eJSON\u003c/code\u003e: Not implemented yet\u003c/li\u003e
\u003cli\u003eIf none of the above was met and \u003ccode\u003eForceRequestBodyVariable\u003c/code\u003e is set to true, URLENCODED will be forced\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eSee \u003cstrong\u003eBody Handling\u003c/strong\u003e for more info.\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003ePhase 3: Response Headers\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003ePhase 4: Response Body\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003e\u003cstrong\u003ePhase 5: Logging\u003c/strong\u003e\u003c/p\u003e
\u003cp\u003eThis is a special phase, it will always run but it must be handled by the client. For example, if there is any error reported by Coraza, the client must at least implement a \u003ccode\u003edefer tx.ProcessLogging()\u003c/code\u003e. This phase will close handlers, save persistent collections and write audit loggers, in order to write the audit loggers the following conditions must be met:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003eTransaction was marked with \u003ccode\u003eauditlog\u003c/code\u003e action\u003c/li\u003e
\u003cli\u003eThere must be at least one audit logger (\u003ccode\u003eSecAuditLog\u003c/code\u003e)\u003c/li\u003e
\u003cli\u003e\u003ccode\u003eAuditEngine\u003c/code\u003e must be \u003ccode\u003eOn\u003c/code\u003e or \u003ccode\u003eRelevantOnly\u003c/code\u003e\u003c/li\u003e
\u003cli\u003eIf \u003ccode\u003eAuditEngine\u003c/code\u003e was set to \u003ccode\u003eRelevantOnly\u003c/code\u003e the response status must match \u003ccode\u003eAuditLogRelevantStatus\u003c/code\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003ch2 id="body-handling"\u003eBody handling\u003c/h2\u003e
\u003cp\u003eBodyBuffer is a struct that will manage the request or response buffer and store the data to temprary files if required. BodyBuffer will apply a few rules to decide whether to buffer the data in memory or write a temporary file, it will also return a \u003ccode\u003eReader\u003c/code\u003e to the memory buffer or the temporary file created. Temporary files must be deleted by \u003ccode\u003etx.ProccessLoging\u003c/code\u003e.\u003c/p\u003e
\u003ch2 id="persistent-collections"\u003ePersistent Collections\u003c/h2\u003e
\u003cp\u003eNot working yet.\u003c/p\u003e
\u003ch2 id="the-txprocessrequestreq-helper"\u003eThe \u003ccode\u003etx.ProcessRequest(req)\u003c/code\u003e helper\u003c/h2\u003e
`}).add({id:12,href:"https://coraza.io/docs/reference/roadmap/",title:"Roadmap",description:"What to expect from Coraza in the near future.",content:""}).add({id:13,href:"https://coraza.io/docs/tutorials/using-plugins/",title:"Using Plugins",description:"Plugins can extend most Coraza functionalities like, audit logging, geo ip, operators, actions, transformations and body processors.",content:`\u003cp\u003ePlugins must be included in your project\u0026rsquo;s main package, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003epackage main

include(
  \u0026quot;github.com/jptosso/coraza-waf/v2\u0026quot;
  _ \u0026quot;github.com/jptosso/coraza-libinjection\u0026quot;
)
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThe previous code will automatically add the @detectXSS and @detectSQLi operators. (Please note this plugin requires libinjection)\u003c/p\u003e
`}).add({id:14,href:"https://coraza.io/docs/reference/benchmarks/",title:"Benchmarks",description:"",content:`\u003ch2 id="results"\u003eResults\u003c/h2\u003e
\u003ch3 id="1-without-rules-get"\u003e1. Without rules GET\u003c/h3\u003e
\u003ch3 id="2-without-rules-post-multipart"\u003e2. Without rules POST Multipart\u003c/h3\u003e
\u003ch3 id="3-without-rules-post-xml"\u003e3. Without rules POST XML\u003c/h3\u003e
\u003ch3 id="4-with-crs-get"\u003e4. With CRS GET\u003c/h3\u003e
\u003ch3 id="5-with-crs-post-multipart"\u003e5. With CRS POST Multipart\u003c/h3\u003e
\u003ch3 id="6-with-crs-post-xml"\u003e6. With CRS POST XML\u003c/h3\u003e
\u003ch2 id="methodology"\u003eMethodology\u003c/h2\u003e
\u003ch2 id="run-your-own-benchmarks"\u003eRun your own benchmarks\u003c/h2\u003e
\u003cp\u003eFirst make sure you meet all the requirements:\u003c/p\u003e
\u003cul\u003e
\u003cli\u003egolang 1.16+\u003c/li\u003e
\u003cli\u003elibpcre and libinjection installed\u003c/li\u003e
\u003cli\u003egcc compiler\u003c/li\u003e
\u003cli\u003elibinjection installed\u003c/li\u003e
\u003cli\u003epython 3\u003c/li\u003e
\u003c/ul\u003e
\u003cpre\u003e\u003ccode class="language-sh"\u003egit clone https://github.com/jptosso/coraza-benchmark --depth=1
cd coraza-benchmark
make all
./run-benchmarks.sh
./parse-results.sh
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eThis will print the tables with the benchmark results.\u003c/p\u003e
\u003cp\u003eYou may also run the docker image from the Dockerfile using \u003ccode\u003edocker build -t coraza-benchmark .\u003c/code\u003e\u003c/p\u003e
`}).add({id:15,href:"https://coraza.io/docs/reference/extending/",title:"Extending",description:"Easily extend Coraza with your own Operators, Actions, Audit Loggers and Persistence engines.",content:`\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eRule Operators:\u003c/strong\u003e Create rule operators like @even to detect even numbers\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRule Transformations:\u003c/strong\u003e Create rule transformations like t:rot13 to encode your values in ROT13\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRule Actions:\u003c/strong\u003e Create rule actions like challenge to redirect a malicious request to some bot detection system\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eThe plugin interface provides three functions to extend rule operators, transformations and actions. Each one of them must match it\u0026rsquo;s proper type or interface and be registered using the \u003ccode\u003eplugins\u003c/code\u003e package.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOperators\u003c/strong\u003e: \u003ccode\u003etype PluginOperatorWrapper() types.RuleOperator\u003c/code\u003e\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eActions\u003c/strong\u003e: \u003ccode\u003etype PluginOperatorWrapper() types.RuleAction\u003c/code\u003e\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eTransformations\u003c/strong\u003e: \u003ccode\u003etype Transformation = func(input string, tools *transformations.Tools) string\u003c/code\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003eAfter defining the plugins, we must register them using the \u003ccode\u003eplugins.Register...\u003c/code\u003e function inside the init function \u003ccode\u003efunc init(){}\u003c/code\u003e.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eOperators\u003c/strong\u003e: \u003ccode\u003eoperators.RegisterPlugin(operator PluginOperatorWrapper)\u003c/code\u003e\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eActions\u003c/strong\u003e: \u003ccode\u003eactions.RegisterPlugin(action PluginActionWrapper)\u003c/code\u003e\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eTransformations\u003c/strong\u003e: \u003ccode\u003etransformations.RegisterPlugin(transformation transformations.Transformation)\u003c/code\u003e\u003c/li\u003e
\u003c/ul\u003e
\u003cp\u003e\u003cstrong\u003eImportant:\u003c/strong\u003e Some integrations like Traefik does not support plugins, because we cannot control how the integration is compiled by Pilot.\u003c/p\u003e
\u003ch2 id="installing-a-plugin"\u003eInstalling a plugin\u003c/h2\u003e
\u003cp\u003ePlugin model is based on Caddy plugins system, they must be compiled within the project just by importing them like this:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003eimport(
    \u0026quot;github.com/jptosso/coraza-waf/v2\u0026quot;
    _ \u0026quot;github.com/someone/somecorazaplugin\u0026quot;
)
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="creating-rule-actions"\u003eCreating Rule Actions\u003c/h2\u003e
\u003ch3 id="rule-action-interface"\u003eRule Action interface\u003c/h3\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003etype RuleAction interface {
	// Initializes an action, will be done during compilation
	Init(*Rule, string) error
	// Evaluate will be done during rule evaluation
	Evaluate(*Rule, *Transaction)
	// Type will return the rule type, it's used by Evaluate
	// to choose when to evaluate each action
	Type() int
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="action-types"\u003eAction types\u003c/h3\u003e
\u003cp\u003eEach action can have one type that defines in which part of the rule lifetime it will be evaluated.\u003c/p\u003e
\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eACTION_TYPE_DISRUPTIVE\u003c/strong\u003e: Cause Coraza to do something. In many cases something means block transaction, but not in all. For example, the allow action is classified as a disruptive action, but it does the opposite of blocking. There can only be one disruptive action per rule (if there are multiple disruptive actions present, or inherited, only the last one will take effect), or rule chain (in a chain, a disruptive action can only appear in the first rule).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eACTION_TYPE_NONDISRUPTIVE\u003c/strong\u003e: Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eACTION_TYPE_FLOW\u003c/strong\u003e: These actions affect the rule flow (for example skip or skipAfter).\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eACTION_TYPE_METADATA\u003c/strong\u003e: Meta-data actions are used to provide more information about rules. Examples include id, rev, severity and msg.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eACTION_TYPE_DATA\u003c/strong\u003e: - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="creating-a-custom-action"\u003eCreating a custom action\u003c/h3\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003etype id15 struct{}

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
var _ coraza.RuleAction = \u0026amp;id15{}
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="transforming-the-action-to-plugin"\u003eTransforming the action to plugin\u003c/h3\u003e
\u003cp\u003eOnce the action is created, it must be wrapper inside a \u003ccode\u003etype PluginActionWrapper = func() types.RuleAction\u003c/code\u003e in order to be registered.\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003eimport(
    \u0026quot;github.com/jptosso/coraza-waf/v2/actions\u0026quot;
    \u0026quot;github.com/jptosso/coraza-waf/v2/types\u0026quot;
)

func init() {
	actions.RegisterPlugin(\u0026quot;id15\u0026quot;, func() types.RuleAction {
		return \u0026amp;id15{}
	})
}
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eAfter properly importing the plugin, you may be able to create rules with \u003ccode\u003eid15\u003c/code\u003e action, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecAction \u0026quot;id15, nolog, pass\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="creating-rule-transformations"\u003eCreating Rule Transformations\u003c/h2\u003e
\u003cp\u003eTransformations are the easiest components to extend, each transformation implements the \u003ccode\u003etransformations.Transformation\u003c/code\u003e type and can be registered directly using \u003ccode\u003eplugins.RegisterPlugin(transformation transformations.Transformation)\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003eThe *Tools struct is designed to add additional functionalities like logging and unicode mapping.\u003c/p\u003e
\u003ch3 id="transformation-type"\u003eTransformation Type\u003c/h3\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003etype Transformation = func(input string, tools *Tools) string
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="example"\u003eExample\u003c/h3\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003eimport (
  \u0026quot;github.com/jptosso/coraza-waf/v2/transformations\u0026quot;
  \u0026quot;strings\u0026quot;
)

func transformationToLowercase(input string) (string, error) {
	return strings.ToLower(input)
}

func init() {
  transformations.RegisterPlugin(\u0026quot;tolower2\u0026quot;, transformationToLowercase)
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="creating-rule-operators"\u003eCreating Rule Operators\u003c/h2\u003e
\u003ch3 id="rule-operator-interface"\u003eRule Operator interface\u003c/h3\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003e// Operator interface is used to define rule @operators
type Operator interface {
	// Init is used during compilation to setup and cache
	// the operator
	Init(string) error
	// Evaluate is used during the rule evaluation,
	// it returns true if the operator succeeded against
	// the input data for the transaction
	Evaluate(*Transaction, string) bool
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="creating-a-custom-operator"\u003eCreating a custom operator\u003c/h3\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003etype opEven struct{}

func (opEven) Init(_ string) error {
	return nil
}

func (opEven) Evaluate(_ *coraza.Transaction, input string) bool {
	i, _ := strconv.Atoi(input)
	return i%2 == 0
}

//Tripwire
var _ coraza.Operator = \u0026amp;opEven{}
\u003c/code\u003e\u003c/pre\u003e
\u003ch3 id="transforming-the-operator-to-plugin"\u003eTransforming the operator to plugin\u003c/h3\u003e
\u003cp\u003eOnce the operator is created, it must be wrapper inside a \u003ccode\u003etype PluginOperatorWrapper = func() coraza.Operator\u003c/code\u003e in order to be registered.\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003eimport(
    \u0026quot;github.com/jptosso/coraza-waf/v2/operators\u0026quot;
    \u0026quot;github.com/jptosso/coraza-waf/v2/types\u0026quot;
)

func init() {
	operators.RegisterPlugin(\u0026quot;even\u0026quot;, func() types.Operator {
		return \u0026amp;opEven{}
	})
}
\u003c/code\u003e\u003c/pre\u003e
\u003cp\u003eAfter properly importing the plugin, you may be able to create rules with \u003ccode\u003eeven\u003c/code\u003e operator, for example:\u003c/p\u003e
\u003cpre\u003e\u003ccode\u003eSecRule ARGS:id \u0026quot;@even\u0026quot; \u0026quot;id:1, nolog, pass\u0026quot;
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="testing-your-plugin"\u003eTesting your plugin\u003c/h2\u003e
\u003cp\u003eThere are no special helpers to test plugins but you may use the seclang compiler to achieve this, for example, if we want to test that the tolower2 transformation works we must write the following test:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-go"\u003eimport(
    \u0026quot;github.com/jptosso/coraza-waf/v2/seclang\u0026quot;
    \u0026quot;github.com/jptosso/coraza-waf/v2/types\u0026quot;
    \u0026quot;github.com/jptosso/coraza-waf/v2/transformations\u0026quot;
    \u0026quot;strings\u0026quot;
    \u0026quot;testing\u0026quot;
)

func TestToLower2(t *testing.T){
  waf := coraza.NewWaf()
  parser, _ := seclang.NewParser(waf)
  if err := parser.FromString(\`SecRule ARGS:id \u0026quot;lowercase\u0026quot; \u0026quot;id:1, t:tolower2\u0026quot;\`); err != nil{
    t.Error(err)
  }
  str := \u0026quot;TOLowEr\u0026quot;
  if strings.ToLower(str) != transformationToLowercase(TOLowEr) {
    t.Error(\u0026quot;Transformation tolower2 failed\u0026quot;)
  }
}
\u003c/code\u003e\u003c/pre\u003e
\u003ch2 id="adding-plugins-to-coraza-plugin-repository"\u003eAdding plugins to Coraza Plugin Repository\u003c/h2\u003e
\u003cp\u003eThis feature will be available soon, in the meantime, you can edit this site and add plugins to \u003ccode\u003eplugins.html\u003c/code\u003e.\u003c/p\u003e
\u003cp\u003eThe site will update it\u0026rsquo;s database every 60 minutes, searching for projects with the \u003ccode\u003ecoraza-plugin\u003c/code\u003e topic.\u003c/p\u003e
\u003cp\u003eIf the site fails to add the plugin to the database, it will create an issue with the details.\u003c/p\u003e
\u003ch3 id="requirements"\u003eRequirements\u003c/h3\u003e
\u003cul\u003e
\u003cli\u003eThe project must be public in github.\u003c/li\u003e
\u003cli\u003eThe project must have the \u003ccode\u003ecoraza-plugin\u003c/code\u003e keyword.\u003c/li\u003e
\u003cli\u003eThe project must have a valid \u003ccode\u003e.coraza.yml\u003c/code\u003e file in the root path.\u003c/li\u003e
\u003cli\u003eThe project must have a valid \u003ccode\u003ego.mod\u003c/code\u003e file\u003c/li\u003e
\u003c/ul\u003e
\u003ch3 id="corazayml"\u003e.coraza.yml\u003c/h3\u003e
\u003cp\u003eThis file will be used in the future by the Coraza Public Plugin Repository, it\u0026rsquo;s not required by the plugin itself.\u003c/p\u003e
\u003cp\u003e\u003ccode\u003e.coraza.yml\u003c/code\u003e must be placed in the root directory of your repository and it must contain the following valid yaml structure:\u003c/p\u003e
\u003cpre\u003e\u003ccode class="language-yaml"\u003e# We only accept alphanumeric and -.  ([\\w-])
name: some-plugin
author: Your Full name or whatever you want to show
repository: github.com/path/to-project
# Coraza Plugin repository will only accept projects with apache2, MIT and BSD licenses,
# we might accept more in the future
license: apache2
description: Short description to display in plugins.coraza.io
# We are using Ruby Gem version syntax: https://guides.rubygems.org/patterns/#pessimistic-version-constraint
# The min supported Coraza version, each item represents an AND operator
version: 
  - \u0026quot;\u0026gt;= v1.1\u0026quot;
  - \u0026quot;\u0026lt; v2\u0026quot;
  # or ~\u0026gt; that is identical to the previous statements
  - \u0026quot;~\u0026gt; v1.1\u0026quot;
tags:
  - Add some tags
  - For filtering
defs:
  - name: even
    type: operator|operator|transformation
    description: Will match if the number is even
\u003c/code\u003e\u003c/pre\u003e
`}).add({id:16,href:"https://coraza.io/docs/reference/",title:"Reference",description:"Coraza WAF API References.",content:""}).add({id:17,href:"https://coraza.io/docs/tutorials/",title:"Tutorials",description:"Coraza WAF tutorials.",content:""}).add({id:18,href:"https://coraza.io/docs/",title:"Use Cases",description:"OWASP Coraza WAF use cases.",content:""}).add({id:19,href:"https://coraza.io/docs/seclang/",title:"Seclang",description:"Coraza WAF Docs.",content:""}),userinput.addEventListener("input",t,!0),suggestions.addEventListener("click",n,!0);function t(){const n=5;var s=this.value,o=e.search(s,{limit:n,enrich:!0});suggestions.classList.remove("d-none"),suggestions.innerHTML="";const t={};o.forEach(e=>{e.result.forEach(e=>{t[e.doc.href]=e.doc})});for(const s in t){const o=t[s],e=document.createElement("div");if(e.innerHTML="<a href><span></span><span></span></a>",e.querySelector("a").href=s,e.querySelector("span:first-child").textContent=o.title,e.querySelector("span:nth-child(2)").textContent=o.description,suggestions.appendChild(e),suggestions.childElementCount==n)break}}function n(){for(;suggestions.lastChild;)suggestions.removeChild(suggestions.lastChild);return!1}})()