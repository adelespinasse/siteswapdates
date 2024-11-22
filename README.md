# siteswapdates

Finds dates in YYYYMMDD format that are valid siteswap patterns.

If you just want to see all the siteswapable dates in the next few million years, go to
[this spreadsheet](https://docs.google.com/spreadsheets/d/1E1x4YKym4dZAJWupoP05sDJfZRWI9len2mik3dZtGok/edit?usp=sharing).

This JavaScript code just defines a brute force function that checks whether a string of digits is a valid
siteswap pattern, then iterates through dates and prints the ones that are valid. It outputs to stdout in CSV format.
You can run it using Node.js.
