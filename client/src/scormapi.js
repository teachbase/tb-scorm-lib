/** 
 * SCORM RTS (LMS)
 * @author Ondej Medek
 * License: Poetic License 
 *  
 * 1. call API_1484_11.__preInitialize
 * 2. load SCO
 * 
 * 
 */
API_1484_11 = {
	version : "1.0", // mandatory version attribute
	STATE : {
		NOT_INITIALIZED : "Not Initialized",
		RUNNING : "Running",
		TERMINATED : "Terminated"
	},
	running : false,
	debug : typeof (console) == "undefined" ? null : console, // console, false
	error : 0,
	cmiDefault : {
		"cmi._version" : this.version,
		"cmi.mode" : "normal",
		"cmi.credit" : "no-credit",
		"cmi.entry" : "ab-initio",
		"cmi.location" : "",
		"cmi.success_status" : "unknown",
		"cmi.completion_status" : "incomplete",
		"cmi.score._children" : "scaled,min,max,raw",
		"cmi.interactions._children" : "", //"id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
		"cmi.interactions._count" : "0"
	},
	cmi : null,
	_valuesChanged : {},
	_valueNameSecurityCheckRe : /^cmi\.(\w|\.)+$/,

	// help functions
	_stringEndsWith : function(str, suffix) {
		return str.length >= suffix.length && str.substr(str.length - suffix.length) == suffix;
	},
	_valueNameSecurityCheck : function(name) {
		this.error = name.search(this._valueNameSecurityCheckRe) === 0 ? 0 : 401;
		return this.error === 0;
	},
	_valueNameCheckReadOnly : function(name) {
		this.error = 0;
		if (this._stringEndsWith(name, "._children")) {
			this.error = 403;
		}
		return this.error === 0;
	},
	_checkRunning : function(errBefore, errAfter) {
		if (this.state === this.STATE.NOT_INITIALIZED) {
			this.error = errBefore;
		} else if (this.state === this.STATE.TERMINATED) {
			this.error = errAfter;
		} else {
			this.error = 0;
		}
		return this.error === 0;
	},

	_preInitialize : function() {
		this.state = this.STATE.NOT_INITIALIZED;

		// set cmi - clone default cmi
		this.cmi = jQuery.extend(true, {}, this.cmiDefault);
		
		// custom code
	},

	// SCO RTE functions
	Initialize : function() {
		if (this.debug) this.debug.log("LMS Initialize");
		if (this.state === this.STATE.RUNNING) {
			this.error = 103;
			return "false";
		}
		if (this.state === this.STATE.TERMINATED) {
			this.error = 103;
			return "false";
		}
		this.state = this.STATE.RUNNING;
		this.error = 0;

		return "true";
	},

	Terminate : function() {
		if (this.debug) this.debug.log("LMS Terminate");
		if (!this._checkRunning(112, 113)) return "false";

		this.Commit();
		this.state = this.STATE.TERMINATED;
		
		// custom code ...
		
		return "true";
	},

	GetValue : function(name) {
		if (this.debug) this.debug.log("LMS GetValue", name);
		if (!this._checkRunning(122, 123)) {
			return "";
		}
		if (!this._valueNameSecurityCheck(name)) return "";

		var retval = this.cmi[name];
		if (typeof (retval) == "undefined") {
			retval = "";
		}

		if (this.debug) this.debug.log("LMS GetValue return: ", retval);
		return retval;
	},

	SetValue : function(name, value) {
		if (this.debug) this.debug.log("LMS SetValue", name, value);
		if (!this._checkRunning(132, 133)) return "false";
		if (!this._valueNameSecurityCheck(name)) return "false";
		if (!this._valueNameCheckReadOnly(name)) return "false";

		this._valuesChanged[name] = value;
		return "true";
	},

	Commit : function() {
		if (this.debug) this.debug.log("LMS Commit", this._valuesChanged);
		if (!this._checkRunning(142, 143)) return "false";

		// merge values
		jQuery.extend(true, this.cmi, this._valuesChanged);

		// custom code ...

		
		this._valuesChanged = {}; // clean changed values
		return "true";
	},

	GetDiagnostic : function(errCode) {
		if (this.debug) this.debug.log("LMS GetDiagnostic", errCode);
		if (!errCode) return this.GetLastError();
		return this.error_strings[errCode] ? this.error_strings[errCode] : 'Uknown errCode.';
	},

	GetErrorString : function(errCode) {
		if (this.debug) this.debug.log("LMS GetErrorString", errCode);
		return this.error_strings[errCode] ? this.error_strings[errCode] : '';
	},

	GetLastError : function() {
		if (this.debug && this.error != 0) this.debug.log("LMS GetLastError return", this.error);
		return this.error;
	},

	// predefined constants
	error_strings : {
		0 : "No error",
		// General Errors 100-199
		101 : "General Exception",
		102 : "General Initialization Failure",
		103 : "Already Initialized",
		104 : "Content Instance Terminated",
		111 : "General Termination Failure",
		112 : "Termination Before Initialization",
		113 : "Termination After Termination",
		122 : "Retrieve Data Before Initialization",
		123 : "Retrieve Data After Termination",
		132 : "Store Data Before Initialization",
		133 : "Store Data After Termination",
		142 : "Commit Before Initialization",
		143 : "Commit After Termination",
		// Syntax Errors 200-299
		201 : "General Argument Error",
		// RTS (LMS) Errors 300-399
		301 : "General Get Failure",
		351 : "General Set Failure",
		391 : "General Commit Failure",
		// Data Model Errors 400-499
		401 : "Undefined Data Model Element",
		402 : "Unimplemented Data Model Element",
		403 : "Data Model Element Value Not Initialized",
		404 : "Data Model Element Is Read Only",
		405 : "Data Model Element Is Write Only",
		406 : "Data Model Element Type Mismatch",
		407 : "Data Model Element Value Out Of Range",
		408 : "Data Model Dependency Not Established",
		// Implementation-defined Errors 1000-65535
		1000 : "General communication failure (Ajax)"
	}

};