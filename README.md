# Pairwise Form

This is a simple form that will take the image options from the ```/public/img``` folder and ramdomly show them to the respondent for a determined number of times. Then the server validates the answer and save it to a Google Spreadsheet, using Google Apps Script.

### Known issues

?

### Todo

 - ~~Add NProgress progress bar~~
 - ~~Make onFormUpdate into an effect that only updates upon change of the selected state~~
 - ~~Solve the bug that causes a register after~~
 - ~~Solve bug that causes a pair to be submited  before~~
 - ~~Solve the bug that causes the repetition of pairs~~
 - Implement some sort of progress to the user
 - Add that smart thing that considers A > C if you mark A > B and B > C
 - Make getStaticProps to actually get the list of ids of the pictures inside ```/public/img```