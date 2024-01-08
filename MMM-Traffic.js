Module.register("MMM-Traffic", {
  defaults: {    
    updateInterval: 600000,
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    start: "Domkloster 4 50667 Koeln, Germany",
    destination: "Champ de Mars, 5 Avenue Anatole, Paris, France",
  },

  getStyles: function () {
    return ["style.css"];
  },  

  // Override start method
  start: function () {   
    this.loaded = false;    
    this.url = `http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=${this.config.start}&wayPoint.2=${this.config.destination}&key=${this.config.apiKey}`;  
    this.getData();
    setInterval(() => {
      this.getData();      
    }, this.config.updateInterval);
  },

  getData: async function () {
    try {
      const response = await fetch(this.url);
      const data = await response.json();                  
      if(data["statusDescription"] = "OK") {        
        console.log(data.resourceSets[0]["resources"][0].travelDuration);
        //alert(data.resourceSets["resources"]["routeLegs"]["startLocation"]["address"]["formattedAddress"]);
        //alert(data["resourceSets"]["resources"]["routeLegs"]["startLocation"]["address"]["formattedAddress"]);
        this.myDestination = data.resourceSets[0]["resources"][0]["routeLegs"]["endLocation"]["address"]["formattedAddress"];
        this.myDistance = data.resourceSets[0]["resources"][0]["travelDistance"];
        this.myDistanceUnit = data.resourceSets[0]["resources"][0]["distanceUnit"];
        this.myTravelDuration = data.resourceSets[0]["resources"][0]["travelDuration"];
        this.myTravelDurationTraffic = data.resourceSets[0]["resources"][0]["travelDurationTraffic"];                
        this.loaded = true;
        this.updateDom();
      }
      else {
        Log.error(`Fehler beim Abrufen der Daten von Traffic API.`);
      }
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Traffic API: ${error}`);
    }    
  },
  
  getHeader: function () {
    return "Meine Strecke";
  },

  getDom: function () {
    var wrapper = document.createElement("table");
    wrapper.className = "small traffic-table";

    if (!this.loaded) {
      wrapper.innerHTML = "Lade aktuelle Verkehrslage...";
      wrapper.className = "dimmed light";
      return wrapper;
    }

    // Header Row
    var headerRow = document.createElement("tr");
    var startAddressHeader = document.createElement("th");
    startAddressHeader.innerHTML = "Start";
    headerRow.appendChild(startAddressHeader);
    var destinationAddressHeader = document.createElement("th");
    destinationAddressHeader.innerHTML = "Ziel";
    headerRow.appendChild(destinationAddressHeader);
    var distanceHeader = document.createElement("th");
    distanceHeader.innerHTML = "Km";
    headerRow.appendChild(distanceHeader);
    var durationHeader = document.createElement("th");
    durationHeader.innerHTML = "Fahrzeit";
    headerRow.appendChild(durationHeader);    
    wrapper.appendChild(headerRow);

    // Data Row
    var row = document.createElement("tr");

    // Start Address
    var startAddress = document.createElement("td");
    startAddress.innerHTML = this.myStart;
    row.appendChild(startAddress);

    // Destination Address
    var destinationAddress = document.createElement("td");
    destinationAddress.innerHTML = this.myDestination;
    row.appendChild(destinationAddress);
    
    // Distance
    var distance = document.createElement("td");
    distance.innerHTML = this.myDistance + " " + this.myDistanceUnit;    
    row.appendChild(distance);

     // Duration
    var duration = document.createElement("td");
    duration.innerHTML = this.myTravelDuration;
    row.appendChild(duration);
   
    wrapper.appendChild(row);    
    return wrapper;
  }
});
