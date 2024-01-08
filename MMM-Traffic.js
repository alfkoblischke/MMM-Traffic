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
      console.log(data);
      if(data.ok) {
        alert("hurra");
        this.letzterPegel1 = data[data.length-1]['value'];     
        this.loaded = true;
        this.updateDom();
      }
      else {
        Log.error(`Fehler beim Abrufen der Daten von Pegel API.`);
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Pegel API: ${error}`);
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
    var stationNameHeader = document.createElement("th");
    stationNameHeader.innerHTML = "Ort";
    headerRow.appendChild(stationNameHeader);
    var waterNameHeader = document.createElement("th");
    waterNameHeader.innerHTML = "Fluss";
    headerRow.appendChild(waterNameHeader);
    var kmHeader = document.createElement("th");
    kmHeader.innerHTML = "Km";
    headerRow.appendChild(kmHeader);
    var timeHeader = document.createElement("th");
    timeHeader.innerHTML = "Uhrzeit";
    headerRow.appendChild(timeHeader);
    var pegelHeader = document.createElement("th");
    pegelHeader.innerHTML = "Pegel";
    headerRow.appendChild(pegelHeader);
    wrapper.appendChild(headerRow);

    // 1 Data Row
    var row = document.createElement("tr");

    // Pegel Name
    var pegelName = document.createElement("td");
    pegelName.innerHTML = this.stationName;
    row.appendChild(pegelName);

    // Water Name
    var waterName = document.createElement("td");
    waterName.innerHTML = this.stationWater;    
    row.appendChild(waterName);

     // Pegel Km
    var pegelKm = document.createElement("td");
    pegelKm.innerHTML = this.stationKm;
    row.appendChild(pegelKm);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime1;
    row.appendChild(pegelTime);
    
    // Pegel Height
    var pegelHeight = document.createElement("td");
    pegelHeight.innerHTML = this.letzterPegel1 + " cm";
    row.appendChild(pegelHeight);

    wrapper.appendChild(row);    
    return wrapper;
  }
});
