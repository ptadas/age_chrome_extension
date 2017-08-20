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
  // document.getElementById("quote").innerHTML = quotes[quoteIx];

  var ageHolder = document.getElementById("ageHolder");
  var years = document.getElementById("years");
  var days = document.getElementById("days");
  var seconds = document.getElementById("seconds");

  // set timer to update age
  setInterval(function() {
      var age = getAge(birthDate);

      // milliseconds in a year - 3.154e+10
      var year = Math.floor(age / 3.154e+10);

      var currYearMilli = age - year * 3.154e+10;
      var day =  currYearMilli / (1000 * 3600 * 24);

      var dt = new Date();

      var totalSeconds = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
      var milliseconds = Math.round(dt.getMilliseconds() / 100);
      milliseconds = milliseconds === 10 ? 0 : milliseconds;

      var second = totalSeconds + '.' + milliseconds;

      years.innerHTML = year;
      days.innerHTML = Math.floor(day);
      seconds.innerHTML = second;
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

  return age;
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

// https://developer.chrome.com/webstore/publish

