document.addEventListener(
  'DOMContentLoaded',
  function() {
    document.getElementById("setBDate").addEventListener("click", setBirthDate);
    document.getElementById("toggle").addEventListener("click", changeAgeDisplay);
    document.getElementById("clear").addEventListener("click", clearBirthDate);
    document.getElementById("background").addEventListener("click", randBackground);
});


function randBackground() {
  var num = Math.round(Math.random() * 100 % 5);
  document.body.className = 'pattern' + num;

  chrome.storage.local.set({
    existenceAppBackgroundClass: 'pattern' + num
  })

}

/*
* Check if birthDate is set
* if it is, show age
* */
function showAgeWrapper() {
  chrome.storage.local.get(['existenceApp', 'existenceAppTypeId', 'existenceAppBackgroundClass'], function (obj) {
    if(typeof obj.existenceApp !== 'undefined'){
      var person = obj.existenceApp;

      document.body.className = obj.existenceAppBackgroundClass;

      if(obj.existenceAppTypeId === 1){
        showAge(person.birthDate, person.name)
      } else {
        showAge2(person.birthDate, person.name)
      }
    } else {
      // show form
      document.getElementById("form").style.display = 'block';
    }
  });
}

// check if we need to show age
showAgeWrapper();

var quotes = [
  'Its not the smartest people who achieve success. Its the people who procrastinate less, make fewer excuses as they take actions everyday towards the goals they want to achieve.',

  'Not making a decision is a decision',

  'Working hard for the sake of working hard is stupid.',

  'Happiness is removing pain points, not adding pleasure',

  'Hard choices - easy life. Easy choices - hard life',

  // 'Life is about basics' (in terms of applications of seemingly complex subjects ie Math, Physics
  'It\'s all about first principles and understanding the basics 100%'
  /*
  “It is not the strongest of the species that survives,
nor the most intelligent,
but the one most responsive to change.”
— Charles Darwin*/

//   “What the pupil must learn, if he learns anything at all,
// is that the world will do most of the work for you,
// provided you cooperate with it by identifying
// how it really works and aligning with those realities.
// If we do not let the world teach us, it teaches us a lesson.”
// — Joseph Tussman

];


/*
* Show age on the screen
* - hide form element
* - show age element
* - select random quote
* - set interval for age update
* */
function showAge(birthDate, name) {
  // hide form if we have the birthday set
  document.getElementById("form").style.display = 'none';
  document.getElementById("age2").style.display = 'none';

  // show age div
  document.getElementById("age").style.display = 'block';
  document.getElementById("age1").style.display = 'block';
  document.getElementById("options").style.display = 'block';

  var years = document.getElementById("years");
  var days = document.getElementById("days");
  var seconds = document.getElementById("seconds");

  document.getElementById("title").innerHTML = 'Tick Tack ' + name;

  // set timer to update age
  var intervlaId = setInterval(function() {
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

  chrome.storage.local.set({
    existenceAppIntervalId: intervlaId
  })
}


function showAge2(birthDate, name) {
  // hide form if we have the birthday set
  document.getElementById("form").style.display = 'none';
  document.getElementById("age1").style.display = 'none';

  // show age div
  document.getElementById("age").style.display = 'block';
  document.getElementById("age2").style.display = 'block';
  document.getElementById("options").style.display = 'block';


  var ageHolder = document.getElementById("age2");

  document.getElementById("title").innerHTML = 'Tick Tack ' + name;

  // set timer to update age
  var intervlaId = setInterval(function() {
    var age = getAge(birthDate);

    ageHolder.innerHTML = (age / 3.154e+10).toFixed(9);
    },
    100
  );

  chrome.storage.local.set({
    existenceAppIntervalId: intervlaId
  })
}

function changeAgeDisplay() {
  // get and stop the old interval
  chrome.storage.local.get('existenceAppIntervalId', function (val) {
    clearInterval(val.existenceAppIntervalId);
  });

  chrome.storage.local.get('existenceAppTypeId', function (type) {
    var typeId = type.existenceAppTypeId === 1 ? 2 : 1;

    chrome.storage.local.set({
      existenceAppTypeId: typeId
    }, function () {
      showAgeWrapper()
    });
  });

}


/*
* Get age in milliseconds
* */
function getAge(birthDate){
  return new Date() - new Date(birthDate);
}


function clearBirthDate(obj){
  chrome.storage.local.remove('existenceApp');

  // hide form if we have the birthday set
  document.getElementById("form").style.display = 'block';

  // show age div
  document.getElementById("age").style.display = 'none';
  document.getElementById("options").style.display = 'none';
}


// The handler also must go in a .js file
function setBirthDate(obj) {
  var name = document.getElementById("name").value;

  var year = document.getElementById("year").value;
  var month = document.getElementById("month").value;
  var day = document.getElementById("day").value;

  day = day.length === 1 ? '0' + day : day;
  month = month.length === 1 ? '0' + month : month;

  var date = year + '-' + month + '-' + day;

  var bDate = new Date(date);
  var bDateStr = bDate.toISOString().substring(0, 10);

  // to remove - chrome.storage.local.remove('birthDate')
  chrome.storage.local.set({
    existenceApp: {
      birthDate: bDateStr,
      name : name
    },
    existenceAppTypeId: 1,
    existenceAppBackgroundClass: 'pattern1'
  }, function () {
      showAge(bDateStr, name)
  });

}

// https://stackoverflow.com/questions/28046084/chrome-app-extension-to-remove-a-page-element

// https://developer.chrome.com/webstore/publish

