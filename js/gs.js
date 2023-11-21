const form = document.forms['google-sheet']
form.addEventListener('submit', e => {
    e.preventDefault()
    const scriptURL = "https://script.google.com/macros/s/AKfycbw_Ms0K7JcEF5iH7AlTPec79oatFwKDt5AUe8fqcO0ZihtU5nDVpn2KGjbrw-Sux8wNkg/exec?action=addLeads"
    const name = form.elements["name"].value;
    const email = form.elements["email"].value;
    const company = form.elements["company"].value;
    const subject = form.elements["subject"].value;
    const message = form.elements["message"].value;

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
                name: name,
                email: email,
                company: company,
                subject: subject,
                message: message,
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
            console.log(JSON.stringify(payload))
        });
    });
    alert("Thanks for your message..! I Will Contact with You Soon...")
    form.reset();
})