$(document).ready(function() {
  
  var counter = 0;
  var c = 0;
  var i = setInterval(function(){
      $(".loading-page .counter h1").html(c + "%");
      $(".loading-page .counter hr").css("width", c + "%");
      //$(".loading-page .counter").css("background", "linear-gradient(to right, #f60d54 "+ c + "%,#0d0d0d "+ c + "%)");

    /*
    $(".loading-page .counter h1.color").css("width", c + "%");
    */
    counter++;
    c++;
    if(counter == 20) {
      const scriptURL = "https://script.google.com/macros/s/AKfycbzVWKqu7p4j1QavEaViu9NCHvgm1yrDjbEK1G_KXWiJJrPxZQiZ_1D8auMo-K_-9Tix/exec?action=addViews"
      $(document).ready(() => {
        $.getJSON('https://api.ipgeolocation.io/ipgeo?apiKey=e8a3f5946a324fc6b9380663378a044d', function(data) {
          const ip = data.ip;
          const isp = data.isp;
          const country = data.country_name;
          const city = data.city;
          const client_time = data.time_zone.current_time;

          // console.log(ip)
          // console.log(isp)
          // console.log(country)
          // console.log(city)
          // console.log(client_time)

          const payload = {
            IP: ip,
            country: country,
            city: city,
            client_timestamp: client_time,
            ISP: isp
          };

          fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json'
            },
            mode: 'no-cors'
          })
        });
      });


    }
      
    if(counter == 101) {
      const url = "home.html";
      window.location.href = url;
      clearInterval(i);
    }
  }, 40);
});