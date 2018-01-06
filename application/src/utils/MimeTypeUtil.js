export const mimeTypes = {
  "application/x-abiword": { extension: "abw", description: "AbiWord document" },
  "application/octet-stream": { extension: "arc", description: "Archive document (multiple files embedded)" },
  "application/octet-stream": { extension: "bin", description: "Any kind of binary data" },
  "application/x-bzip": { extension: "bz", description: "BZip archive" },
  "application/x-bzip2": { extension: "bz2", description: "BZip2 archive" },
  "application/x-csh": { extension: "csh", description: "C-Shell script" },
  "application/msword": { extension: "doc", description: "Microsoft Word" },
  "application/vnd.amazon.ebook": { extension: "azw", description: "Amazon Kindle eBook format" },
  "application/vnd.ms-powerpoint": { extension: "ppt", description: "Microsoft PowerPoint" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { extension: "pptx", description: "Microsoft PowerPoint" },
  "application/vnd.visio": { extension: "vsd", description: "Microsoft Visio" },
  "application/vnd.ms-excel": { extension: "xlsx", description: "Microsoft Excel" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { extension: "docx", description: "MS Word document" },
  "application/vnd.ms-fontobject": { extension: "eot", description: "MS Embedded OpenType fonts" },
  "application/vnd.apple.installer+xml": { extension: "mpkg", description: "Apple Installer Package" },
  "application/vnd.oasis.opendocument.presentation": { extension: "odp", description: "OpenDocument presentation document" },
  "application/vnd.oasis.opendocument.spreadsheet": { extension: "ods", description: "OpenDocument spreadsheet document" },
  "application/vnd.oasis.opendocument.text": { extension: "odt", description: "OpenDocument text document" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { extension: "xlsx", description: "MS Excel" },
  "application/vnd.google-apps.script+json": { extension: "json", description: "JSON" },
  "application/vnd.google-apps.audio": { extension: "", description: "" },
  "application/vnd.google-apps.document": { extension: "gdoc", description: "Google Docs" },
  "application/vnd.google-apps.drawing": { extension: "", description: "Google Drawing" },
  "application/vnd.google-apps.file": { extension: "", description: "Google Drive file" },
  "application/vnd.google-apps.folder": { extension: "", description: "Google Drive folder" },
  "application/vnd.google-apps.form": { extension: "", description: "Google Forms" },
  "application/vnd.google-apps.fusiontable": { extension: "", description: "Google Fusion Tables" },
  "application/vnd.google-apps.map": { extension: "", description: "Google My Maps" },
  "application/vnd.google-apps.photo": { extension: "", description: "" },
  "application/vnd.google-apps.presentation": { extension: "gslides", description: "Google Slides" },
  "application/vnd.google-apps.script": { extension: "", description: "Google Apps Scripts" },
  "application/vnd.google-apps.sites": { extension: "", description: "Google Sites" },
  "application/vnd.google-apps.spreadsheet": { extension: "gsheet", description: "Google Sheets" },
  "application/vnd.google-apps.unknown": { extension: "", description: "" },
  "application/vnd.google-apps.video": { extension: "", description: "" },
  "application/vnd.google-apps.drive-sdk": { extension: "", description: "3rd party shortcut" },
  "application/vnd.mozilla.xul+xml": { extension: "xul", description: "XUL" },
  "application/x-vnd.oasis.opendocument.text": { extension: "odt", description: "OpenDocument text document" },
  "application/x-vnd.oasis.opendocument.spreadsheet": { extension: "ods", description: "OpenDocument spreadsheet document" },
  "application/x-vnd.oasis.opendocument.presentation": { extension: "ods", description: "OpenDocument spreadsheet document" },
  "application/epub+zip": { extension: "epub", description: "Electronic publication (EPUB)" },
  "application/java-archive": { extension: "jar", description: "Java Archive (JAR)" },
  "application/javascript": { extension: "js", description: "JavaScript (ECMAScript)" },
  "application/json": { extension: "json", description: "JSON format" },
  "application/ogg": { extension: "ogx", description: "OGG" },
  "application/pdf": { extension: "pdf", description: "Adobe Portable Document Format (PDF)" },
  "application/x-rar-compressed": { extension: "rar", description: "RAR archive" },
  "application/x-7z-compressed": { extension: "7z", description: "7-zip archive" },
  "application/x-zip-compressed": { extension: "zip", description: "Zip archive" },
  "application/x-tar": { extension: "tar", description: "Tape Archive (TAR)" },
  "application/x-sh": { extension: "sh", description: "Bourne shell script" },
  "application/x-shockwave-flash": { extension: "swf", description: "Small web format (SWF) or Adobe Flash document" },
  "application/rtf": { extension: "rtf", description: "Rich Text Format (RTF)" },
  "application/typescript": { extension: "ts", description: "Typescript file" },
  "application/xhtml+xml": { extension: "xhtml", description: "XHTML" },
  "application/xml": { extension: "xml", description: "XML" },
  "application/zip": { extension: "zip", description: "ZIP archive" },
  "text/css": { extension: "css", description: "Cascading Style Sheets (CSS)" },
  "text/csv": { extension: "csv", description: "Comma-separated values (CSV)" },
  "text/html": { extension: "html", description: "HyperText Markup Language (HTML)" },
  "text/calendar": { extension: "ics", description: "iCalendar format" },
  "audio/aac": { extension: "aac", description: "AAC audio file" },
  "audio/midi": { extension: "midi", description: "Musical Instrument Digital Interface (MIDI)" },
  "audio/ogg": { extension: "oga", description: "OGG audio" },
  "audio/x-wav": { extension: "wav", description: "Waveform Audio Format" },
  "audio/webm": { extension: "weba", description: "WEBM audio" },
  "video/mpeg": { extension: "mpeg", description: "MPEG Video" },
  "video/ogg": { extension: "ogv", description: "OGG video" },
  "video/webm": { extension: "webm", description: "WEBM video" },
  "video/3gpp": { extension: "3gp", description: "3GPP audio/video container" },
  "video/3gpp2": { extension: "3g2", description: "3GPP2 audio/video container" },
  "video/x-msvideo": { extension: "avi", description: "AVI: Audio Video Interleave" },
  "font/otf": { extension: "otf", description: "OpenType font" },
  "font/ttf": { extension: "ttf", description: "TrueType Font" },
  "font/woff": { extension: "woff", description: "Web Open Font Format (WOFF)" },
  "font/woff2": { extension: "woff2", description: "Web Open Font Format (WOFF)" },
  "image/webp": { extension: "webp", description: "WEBP image" },
  "image/tiff": { extension: "tiff", description: "Tagged Image File Format (TIFF)" },
  "image/svg+xml": { extension: "svg", description: "Scalable Vector Graphics (SVG)" },
  "image/gif": { extension: "gif", description: "Graphics Interchange Format (GIF)" },
  "image/x-icon": { extension: "ico", description: "Icon format" },
  "image/jpeg": { extension: "jpg", description: "JPEG images" },
  "image/png": { extension: "png", description: "Portable Network Graphics" }
};

export const mimeTypesGoogle = {
  "application/vnd.google-apps.document": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.google-apps.spreadsheet": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.presentation": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // "application/vnd.google-apps.script+json": "",
  // "application/vnd.google-apps.audio": "",
  // "application/vnd.google-apps.drawing": "",
  // "application/vnd.google-apps.file": "",
  // "application/vnd.google-apps.folder": "",
  // "application/vnd.google-apps.form": "",
  // "application/vnd.google-apps.fusiontable": "",
  // "application/vnd.google-apps.map": "",
  // "application/vnd.google-apps.photo": "",
  // "application/vnd.google-apps.script": "",
  // "application/vnd.google-apps.sites": "",
  // "application/vnd.google-apps.unknown": "",
  // "application/vnd.google-apps.video": "",
  // "application/vnd.google-apps.drive-sdk": ""
};