/**
 * @OnlyCurrentDoc
 */
function evaluate() {
  const dataRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form').getDataRange().getValues();
  const headers = dataRange.shift();
  const pairsList = dataRange.map(row => JSON.parse(row[headers.indexOf('pairs')]));
  const selectedsList = dataRange.map(row => JSON.parse(row[headers.indexOf('selected')]));
  const notSelected = pairsList.map((pairs, i) => pairs.map(pair => pair[0] === selectedsList[i] ? pair[1] : pair[0]));
  
  const ranksList = selectedsList.map((selecteds, i) => {
    graph.reset();
    selecteds.forEach((sel, j) => {
      graph.link(notSelected[i][j], sel, 1.0)
    });

    let ranks = {};
    graph.rank(0.85, 0.000001, (node, rank) => { ranks[node] = Math.round((+rank + Number.EPSILON) * 1000) });
    
    return ranks;
  });
  
  const accumulatedRanks = ranksList.reduce((accRanks, currRanks) =>
    Object.entries(currRanks).reduce((acc, [node, rank]) => ({ ...acc, [node]: acc[node] ? acc[node] + rank : rank }), accRanks)
  , {});

  const sortedAccRank =
    Object.entries(accumulatedRanks).sort(([,rankA], [,rankB]) => rankB - rankA)//.map(([node, rank]) => ({ [node]: rank }));
    
  const destination = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ranks').getRange(2, 1, ranksList.length + 1, 1);
  destination.setValues([ ...ranksList.map(i => [JSON.stringify(i)]), [JSON.stringify(sortedAccRank)]]);
}

function test() {
  const dataRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form').getRange(2, 4, 12, 1).getValues().map(row => JSON.parse(row[0]));
  console.log(dataRange.map(item => item.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0])))
}
