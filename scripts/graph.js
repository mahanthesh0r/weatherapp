var fs = require('fs');
var os = require('os');
var Chart = require('chart.js');


var payloads;
var payload_1;
var payload_2;
var payload_3;
var line;
var temp_1,city_1,prs_1,hum_1;
var temp_2,city_2,prs_2,hum_2;;
var temp_3,city_3,prs_3,hum_3;;



function readContent() {
  payloads = fs.readFileSync('weatherLog.txt','utf8');
  line = payloads.split(os.EOL);
  payload_1 = line[1].split("|");
  payload_2 = line[2].split("|");
  payload_3 = line[3].split("|");

 city_1 = payload_1[0];
 temp_1 = payload_1[1];
 temp_2 = payload_1[2];
 temp_3 = payload_1[3];

 prs_1 = payload_1[4];
 prs_2 = payload_1[5];
 prs_3 = payload_1[6];

 hum_1 = payload_1[7];
 hum_2 = payload_1[8];
 hum_3 = payload_1[9];

//city 2

 city_2 = payload_2[0];
 var temp_11 = payload_2[1];
 var temp_22 = payload_2[2];
 var temp_33 = payload_2[3];
 
 var prs_11= payload_2[4];
 var prs_22 = payload_2[5];
 var prs_33 = payload_2[6];

 var hum_11 = payload_2[7];
 var hum_22 = payload_2[8];
 var hum_33 = payload_2[9];

 //city 3
 city_3 = payload_3[0];
 var temp_111 = payload_3[1];
 var temp_222 = payload_3[2];
 var temp_333 = payload_3[3];
 
 var prs_111= payload_3[4];
 var prs_222 = payload_3[5];
 var prs_333 = payload_3[6];

 var hum_111 = payload_3[7];
 var hum_222 = payload_3[8];
 var hum_333 = payload_3[9];

 var Tdata1 = [temp_1,temp_2,temp_3];
 var Tdata2 = [temp_11,temp_22,temp_33];
 var Tdata3 = [temp_111,temp_222,temp_333];

 var Pdata1 = [prs_1,prs_2,prs_3];
 var Pdata2 = [prs_11,prs_22,prs_33];
 var Pdata3 = [prs_111,prs_222,prs_333];

 var Hdata1 = [hum_1,hum_2,hum_3];
 var Hdata2 = [hum_11,hum_22,hum_33];
 var Hdata3 = [hum_111,hum_222,hum_333];

 console.log(temp_1,temp_2,temp_3);




var ctx = document.getElementById('myChart')
    
    let myChart = new Chart(ctx,{
      type: 'line',
      data: {
        labels: ['Day1','Day2','Day3'],
        datasets: [{ 
            data: Tdata1,
            label: city_1,
            borderColor: "#3e95cd",
            fill: false
        },
        {
            data: Tdata2,
            label: city_2,
            borderColor: "#A569BD",
            fill: false
        },
        {
          data: Tdata3,
          label: city_3,
          borderColor: "#D35400",
          fill: false
      },
      

      ]
      },
      options:{
        title:{
          display: true,
          text: 'Temperature',
          fontSize: 20
        },
        layout: {
          padding:{
            left:0,
            right:0,
            top:20,
            bottom:0
          }
        }
      }
    });

    var ctx2 = document.getElementById('myChart2')
    let myChart2 = new Chart(ctx2,{
      type: 'line',
      data: {
        labels: ['Day1','Day2','Day3'],
        datasets: [{ 
            data: Pdata1,
            label: city_1,
            borderColor: "#3e95cd",
            fill: false
        },
        {
            data: Pdata2,
            label: city_2,
            borderColor: "#A569BD",
            fill: false
        },
        {
          data: Pdata3,
          label: city_3,
          borderColor: "#D35400",
          fill: false
      }

      ]
      },
      options:{
        title:{
          display: true,
          text: 'Pressure',
          fontSize:20
        },
        layout: {
          padding:{
            top: 10
          }
        }
      }
    });

    var ctx3 = document.getElementById('myChart3')
    let myChart3 = new Chart(ctx3,{
      type: 'line',
      data: {
        labels: ['Day1','Day2','Day3'],
        datasets: [{ 
            data: Hdata1,
            label: city_1,
            borderColor: "#3e95cd",
            fill: false
        },
        {
            data: Hdata2,
            label: city_2,
            borderColor: "#A569BD",
            fill: false
        },
        {
          data: Hdata3,
          label: city_3,
          borderColor: "#D35400",
          fill: false
      }

      ]
      },
      options:{
        title:{
          display: true,
          text: 'Humidity',
          fontSize: 20
        },
        layout: {
          padding:{
            top: 10
          }
        }
      }
    });
  }
  window.onload = readContent();