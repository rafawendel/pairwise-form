/**
 * @OnlyCurrentDoc
 */
function onOpen(_e) {
  SpreadsheetApp.getUi().createMenu('Form').addItem('Evaluate Answers', 'evaluate').addToUi();
}
