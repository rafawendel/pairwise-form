/**
 * @OnlyCurrentDoc
 */
const SHEET_NAME = 'Form';
const SCRIPT_PROP = PropertiesService.getScriptProperties();
function doPost(e) {
  return handleResponse(e, (event, sheet) => {
    const [,decipher] = crypto(Config.DUMMY_CYPHER_PASSPHRASE);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const { postData: data } = event;
    if (!data.type.includes('json')) throw new Error('Invalid data type');
    if (data.length <= 0) throw new Error('Empty payload');
    const payload = JSON.parse(data.contents);

    const row = headers.map(header => {
      if (header === 'time_stamp') return new Date();
      if (header === 'ip') return decipher(payload[header]);
      return typeof payload[header] === 'object' ? JSON.stringify(payload[header]) : payload[header];
    });

    sheet.appendRow(row);

    return { 'message':'success', 'row': nextRow };
  });
}

function doGet(e) {
  return handleResponse(e, (event, sheet) => {
    const dataRange = sheet.getDataRange().getValues();
    const [headers] = dataRange;
    const [,decipher] = crypto(Config.DUMMY_CYPHER_PASSPHRASE);

    const { parameters } = event;
    if (!Object.keys(parameters).includes('ip')) throw new Error('Invalid request');

    const ipCol = headers.indexOf('ip');
    const ips = dataRange.map(row => row[ipCol].toString());
    const isIpOnList = ips.includes(decipher(parameters.ip.toString()));

    return { 'message':'success', 'auth': !isIpOnList };
  });
}

function handleResponse(event, withSheetCb) {
  const lock = LockService.getPublicLock();
  lock.waitLock(10000);
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();//openById(SCRIPT_PROP.getProperty('key'));
    const sheet = doc.getSheetByName(SHEET_NAME);

    const res = withSheetCb(event, sheet);
    
    return ContentService
          .createTextOutput(JSON.stringify(res))
          .setMimeType(ContentService.MimeType.JSON);

  } catch(err){
    return ContentService
          .createTextOutput(JSON.stringify({ 'message':'error', 'error': err.message, auth: false }))
          .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
