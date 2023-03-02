// Copyright 2023 iiPython

// Initialization
const services = [
    { name: "Main Site", url: "iipython.cf", description: "My main website with account links." },
    { name: "Legacy Site", url: "old.iipython.cf", description: "2020-2021 version of my website." },
    { name: "Geesecraft Site", url: "gc.iipython.cf", description: "Archival site for the Geesecraft minecraft server." },
    { name: "CubeRPC Album Art", url: "albumart.iipython.cf", description: "Album art storage server for CubeRPC." },
    { name: "Weather Archiver", url: "weather.iipython.cf", description: "Project to archive weather data every 10 minutes." },
    { name: "Snippets Site", url: "quirks.iipython.cf", description: "Random HTML snippets and things." },
    { name: "Down Site", url: "down.iipython.cf", description: "Manual site that I use for maintenance." },
    { name: "Status Site", url: "status.iipython.cf", description: "This site, hosted by Github Pages." }
];
const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const nth = (d) => {
    // Shamelessly stolen from:
    // https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  

// Handle service updating
function updateServices() {
    for (let service of services) {

        // Update or create element
        let element = $(`div.service[attr-name='${service.name}']`);
        function update(ping, text) {
            if (ping > 5000) text = "slow";
            let result = element.find("p.result");
            console.log(result, element);
            result.text(`${text.toUpperCase()} (${Math.round(ping, 2)}ms)`);
            element.find("div.si").attr("class", `si si-${text}`);
        }
        if (!element[0]) {
            element = $(`<div class = "service" attr-name = "${service.name}">
                <h3 class = "title">${service.name}</h3>
                <p class = "description">${service.description}</p>
                <div class = "response">
                    <div class = "si si-slow"></div>
                    <p class = "result">FETCHING...</p>
                </div>
            </div>`);
            element.appendTo($("#status"));
        }
        element.on("click", () => {
            window.location.href = `https://${service.url}`;
        });

        // Fetch ping times
        let start = new Date();
        $.ajax({
            type: "GET",
            url: `https://${service.url}`,
            cache: false,
            timeout: 15000,
            success: (html, status, req) => {
                let elapsed = (new Date()).getTime() - start.getTime();
                if (req.status !== 200) update(elapsed, "down");
                update(elapsed, "up");
            },
            error: (req, status, error) => {
                let elapsed = (new Date()).getTime() - start.getTime();
                console.warn(`Network error connecting to ${service.url}!`);
                console.warn(error);
                update(elapsed, "down");
            }
        });
    }
    // March 1st 2023, 5:37 PM CST
    let obj = new Date();
    let day = obj.getDay();
    let time = obj.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    $("#update-time").text(`${formatter.format(obj.getMonth())} ${day}${nth(day)} ${obj.getFullYear()}, ${time}`);
}

updateServices();
setInterval(updateServices, 30000);
