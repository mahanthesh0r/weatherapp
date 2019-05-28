const moment = require('moment');
const Store = require('electron-store');
var fs = require('fs');
const {BrowserWindow} = require('electron').remote
var Chart = require('chart.js');
const path = require('path')
const url = require('url')
var os = require('os');


$(document).ready(function () {
    $("#dimmer, #settingsBox").hide();
    loadConfig();
    getWeather();
    $("#btnClose").click(function () {
        saveConfig();
        window.close();
    });
    $("#dimmer").click(function () {
        $("#settingsBox").slideUp(250);
        $("#dimmer").fadeOut(250);
        getWeather();
        saveConfig();
    });
    $("#btnSettings").click(function () {
        $("#settingsBox").slideDown(150);
        $("#dimmer").fadeIn(150);
    });
    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            $("#settingsBox").slideUp(250);
            $("#dimmer").fadeOut(250);
            getWeather();
            saveConfig();
        }
    });

});



function getWeather() {
    const API_KEY = $("#txtAPIKey").val();
    var units = $("#cmbUnits").val();
    var address = $("#txtAddress").val();

    var unitTemp, unitPressure, unitSpeed;
    if (units === 'metric') {
        unitTemp = "C";
        unitPressure = "bar";
        unitSpeed = "kph";
    } else if (units === 'imperial') {
        unitTemp = "F";
        unitPressure = "bar";
        unitSpeed = "mph";
    }
    $.getJSON(`http://api.openweathermap.org/data/2.5/weather?q=${address}&units=${units}&appid=${API_KEY}`, function (data) {
        var city = data['name'] + ", " + data['sys']['country'];
        var curTime = moment.unix(data['dt']).format("D MMM, dddd");
        var temp = (data['main']['temp']).toFixed() + "&deg;";
        var cond = data['weather'][0]['description'];
        var minMax = (data['main']['temp_min']).toFixed() + "&deg;" + unitTemp + " - " + (data['main']['temp_max']).toFixed() + "&deg;" + unitTemp;
        var pressure = hpatobar(data['main']['pressure']) + " " + unitPressure;
        var humidity = data['main']['humidity'] + "%";
        var windSpeed;
        if (units === 'metric') {
            windSpeed = mstokph(data['wind']['speed']) + " " + unitSpeed;
        } else if (units === 'imperial') {
            windSpeed = (data['wind']['speed']).toFixed() + " " + unitSpeed;
        }
        $("#country").html(city + " &bullet; " + curTime);
        $("#currentTemp").html(temp);
        $("#conditions").html(cond);
        $("#minMax").html(minMax);
        $("#pressure").html(pressure);
        $("#humidity").html(humidity);
        $("#windSpeed").html(windSpeed);

        var wCode = Number(data['weather'][0]['icon'].substring(0, 2));
        if (wCode === 01) { // clear sky
            $("body").css("background-color", "#6ee2ff");
            setDark();
        } else if (wCode === 02 || wCode === 03 || wCode === 04 || wCode === 50) { // clouds, mist
            $("body").css("background-color", "#bbb");
            setDark();
        } else if (wCode === 09 || wCode === 10) { // rain
            $("body").css("background-color", "#0062d3");
            setLight();
        } else if (wCode === 11) { // thunderstorm
            $("body").css("background-color", "#444444");
            setLight();
        } else if (wCode === 13) { // snow
            $("body").css("background-color", "#eeeeee");
            setDark();
        }
    })
        .done(function () {
            $(".banner").hide();
        })
        .fail(function () {
            $(".banner").show();
        });
    
    $.getJSON(`http://api.openweathermap.org/data/2.5/forecast?q=${address}&units=${units}&cnt=5&appid=${API_KEY}`, (data) => {
        var day1 = moment.unix(data['list'][0]['dt']).format("ddd ha");
        var minMax1 = (data['list'][0]['main']['temp_min']).toFixed() + "&deg;" + unitTemp + " - " + (data['list'][0]['main']['temp_max']).toFixed() + "&deg;" + unitTemp;
        var cond1 = data['list'][0]['weather'][0]['main'];
        //raw temperature of day1
        var Tday1_raw = data['list'][0]['main']['temp']
        //raw pressure of day1 
        var Pday1_raw = data['list'][0]['main']['pressure']
        //raw Humidity of day1
        var Hday1_raw = data['list'][0]['main']['humidity']
        

        var day2 = moment.unix(data['list'][2]['dt']).format("ddd ha");
        var minMax2 = (data['list'][2]['main']['temp_min']).toFixed() + "&deg;" + unitTemp + " - " + (data['list'][0]['main']['temp_max']).toFixed() + "&deg;" + unitTemp;
        var cond2 = data['list'][2]['weather'][0]['main'];
        //raw temperature of day2
        var Tday2_raw = data['list'][2]['main']['temp']
        //raw pressure of day2
        var Pday2_raw = data['list'][2]['main']['pressure']
        //raw Humidity of day2
        var Hday2_raw = data['list'][2]['main']['humidity']

        var day3 = moment.unix(data['list'][4]['dt']).format("ddd ha");
        var minMax3 = (data['list'][4]['main']['temp_min']).toFixed() + "&deg;" + unitTemp + " - " + (data['list'][0]['main']['temp_max']).toFixed() + "&deg;" + unitTemp;
        var cond3 = data['list'][4]['weather'][0]['main'];
        //raw temperature of day3
        var Tday3_raw = data['list'][4]['main']['temp']
        //raw pressure of day1 
        var Pday3_raw = data['list'][4]['main']['pressure']
        //raw Humidity of day1
        var Hday3_raw = data['list'][4]['main']['humidity']

        //Location name
        var logcity = data['city']['name']
        console.log(logcity);
        logData(logcity,Tday1_raw,Tday2_raw,Tday3_raw,Pday1_raw,Pday2_raw,Pday3_raw,Hday1_raw,Hday2_raw,Hday3_raw);

        $("#fDay1").text(day1);
        $("#fTemp1").html(minMax1);
        $("#fCond1").text(cond1);

        $("#fDay2").text(day2);
        $("#fTemp2").html(minMax2);
        $("#fCond2").text(cond2);

        $("#fDay3").text(day3);
        $("#fTemp3").html(minMax3);
        $("#fCond3").text(cond3);
        
    });
    
    
}

function hpatobar(hPa) {
    return (hPa * 0.001).toFixed(2);
}

function mstokph(ms) {
    return (ms * 3.6).toFixed();
}

function setDark() {
    $("#btnSettings, #btnClose").css("filter", "invert(0)");
    $("body").css("color", "black");
}

function setLight() {
    $("#btnSettings, #btnClose").css("filter", "invert(1)");
    $("body").css("color", "white");
}

const store = new Store();
function loadConfig() {
    $("#txtAddress").val(store.get('address'));
    $("#cmbUnits").val(store.get('units'));
    $("#txtAPIKey").val(store.get('API_KEY'));
}
function saveConfig() {
    store.set('address', $("#txtAddress").val());
    store.set('units', $("#cmbUnits").val());
    store.set('API_KEY', $("#txtAPIKey").val());
}

function logData(logcity,day1_temp,day2_temp,day3_temp,day1_prs,day2_prs,day3_prs,day1_hum,day2_hum,day3_hum) {
    fs.appendFileSync('weatherLog.txt',logcity+'|'+day1_temp+'|'+day2_temp+'|'+day3_temp+'|'+day1_prs+'|'+day2_prs+'|'+day3_prs+'|'+day1_hum+'|'+day2_hum+'|'+day3_hum+'\n', function(err) {
        if (err) 
        throw err;
        console.log('saved');

    });
}


const button = document.getElementById('newWindow');
button.addEventListener('click', () => {
    createNewBrowserWindow();
    
});


function createNewBrowserWindow(){

  const win1 = new BrowserWindow({
    height: 600,
    width: 800

  });
  win1.loadURL(url.format({
    pathname: path.join(__dirname, 'logged.html'),
    protocol: 'file:',
    slashes: true
}));
win1.once('ready-to-show', () => {
    win.show();
    
});
}




