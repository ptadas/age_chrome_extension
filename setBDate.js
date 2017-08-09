document.addEventListener(
  'DOMContentLoaded',
  function() {
    document.getElementById("setBDate").addEventListener("click", setBirthDate);
});


/*
* Check if birthDate is set
* if it is, show age
* */
chrome.storage.local.get('birthDate', function (val) {
  if(typeof val.birthDate !== 'undefined'){
    showAge(val.birthDate)

  }

});


var quotes = [
  'Its not the smartest people who achieve success. Its the people who procrastinate less, make fewer excuses as they take actions everyday towards the goals they want to achieve.',

  'Not making a decision is a decision',

  'Working hard for the sake of working hard is stupid.',

  'Happiness is removing pain points, not adding pleasure',

  'Hard choices - easy life. Easy choices - hard life',

];


/*
* Show age on the screen
* - hide form element
* - show age element
* - select random quote
* - set interval for age update
* */
function showAge(birthDate) {
  // hide form if we have the birthday set
  document.getElementById("form").style.display = 'none';

  // show age div
  document.getElementById("age").style.display = 'block';

  // show random quote
  var quoteIx =
(Math.random() * 100).toFixed(0) % (quotes.length - 1);
  document.getElementById("quote").innerHTML = quotes[quoteIx];

  var ageHolder = document.getElementById("ageHolder");
  // set timer to update age
  setInterval(function() {
      ageHolder.innerHTML = getAge(birthDate)
    },
    100
  );
}


/*
* Get age in milliseconds
* */
function getAge(birthDate){
  var bday = new Date(birthDate);
  var age = new Date() - bday;

  // milliseconds in a year - 3.154e+10
  return (age / 3.154e+10).toFixed(9)
}


// The handler also must go in a .js file
function setBirthDate(obj) {
  var bDay = document.getElementById("BDate").value;
  var bDate = new Date(bDay);
  var bDateStr = bDate.toISOString().substring(0, 10);

  // to remove - chrome.storage.local.remove('birthDate')
  chrome.storage.local.set({
    'birthDate': bDateStr
  }, function () {
      showAge(bDateStr)
  });

}

// https://stackoverflow.com/questions/28046084/chrome-app-extension-to-remove-a-page-element

