var scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
    action = e.parameter.action;
    if (action == 'addViews'){
        return addViews(e);
    }
    if (action == 'addLeads'){
        return addLeads(e);
    }
    else {
        return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'invalid action' }))
        .setMimeType(ContentService.MimeType.JSON)
    }
}


function addViews(request = {}){
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)
  try {

    var sheetName = 'viewsSheet'

    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    const { parameter, postData: { contents, type } = {} } = request;
    const { source } = parameter;

    const data = JSON.parse(contents);
    // return ContentService.createTextOutput(JSON.stringify(jsonData));
    // var data = JSON.parse(e.postData.contents);

    var timestamp = Utilities.formatDate(new Date(), "IST", "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([data.IP, data.country, data.city, data.client_timestamp, data.ISP,	timestamp])

    return ContentService
      .createTextOutput(JSON.stringify(contents))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}

function addLeads(request = {}){
    var lock = LockService.getScriptLock()
    lock.tryLock(10000)
    try {

      var sheetName = 'LeadsSheet'

      var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
      var sheet = doc.getSheetByName(sheetName)

      const { parameter, postData: { contents, type } = {} } = request;
      const { source } = parameter;

      const data = JSON.parse(contents);
      // return ContentService.createTextOutput(JSON.stringify(jsonData));
      // var data = JSON.parse(e.postData.contents);

      var timestamp = Utilities.formatDate(new Date(), "IST", "yyyy-MM-dd HH:mm:ss");

      sheet.appendRow([data.name, data.email,	data.company, data.subject, data.message, data.IP, data.country, data.city, data.client_timestamp, data.ISP,	timestamp])

      return ContentService
        .createTextOutput(JSON.stringify(contents))
        .setMimeType(ContentService.MimeType.JSON)
    }

    catch (e) {
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
        .setMimeType(ContentService.MimeType.JSON)
    }

    finally {
      lock.releaseLock()
    }
 }