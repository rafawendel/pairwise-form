# Pairwise Form

A simple form implementation of a Round-Robin pairwise comparison.

The UI will take the image options from the ```/public/img``` folder and randomly show them to the respondent for a determined number of times. Then the server validates the answer and save it to a Google Spreadsheet, using Google Apps Script.

The algorithm will only display unique pairs, and will prefer pairs with items displayed the least number of times.

### Known issues

 - The current Round-Robin implementation runs in an exhaustive O(n²)

### Todos

 - ~~Add NProgress progress bar~~
 - ~~Make onFormUpdate into an effect that only updates upon change of the selected state~~
 - ~~Solve the bug that causes a register after~~
 - ~~Solve bug that causes a pair to be submitted  before~~
 - ~~Solve the bug that causes the repetition of pairs~~
 - Implement some sort of progress to the user
 - Make getStaticProps to actually get the list of ids of the pictures inside ```/public/img```
 - Improve it so as to achieve O(n log n) aka. bracket tournament / merge sort
 - Add elimination option for a first-place-only selection which runs in O(n)
 - Implement choice of display mode among Round-Robin, PAPRIKA, PROMETHEE