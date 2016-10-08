var dataUrl = "https://spreadsheets.google.com/tq?key=1bTB8cpcdKocuH4vrwsXfyumFAkvAPwX-zqL2RTlJQls&tqx=out:csv";
window.googleDocCallback = function () { return true; };

function getEntity() {
    var param = window.location.search;
    console.log(param);
    var at = param.indexOf("entity=");
    param = param.substr(at+7);
    console.log(param);
    at = param.indexOf("&");
    if(at>0) {
        param=param.substr(0,at);
    }
    console.log(param);
    return param.toLowerCase();
}

function readData(data) {
    console.info("reading data");
    var entity = getEntity();
    
    data = data.filter(function(row) {
	   return row["id"] && row["type"] && !(""===row["type"]) && !(""===row["id"]);
    });
    data = data.filter(function(row) {
        if(!(entity==="") && "statement"==row["type"]) {
            var e = row["entities"].toLowerCase();
            return e.indexOf(entity)>=0;
        }
        return true;
    });
    data.reverse();
    var consonant=0;
    var dissonant=0;
    var neutral=0;
    for(var i=0;i<data.length;++i){
        var isConsonant = data[i]["consonant"];
        if("y"==isConsonant){
            ++consonant;
        } else if("n"==isConsonant){
            ++dissonant;
        } else {
            ++neutral;
        }
    }
    console.info("inserting data");
    
    // var summary = document.getElementById('summary');
    // summary.innerHTML="Found " + data.length + " data points (" + consonant + " pro, " + dissonant + " con)";
    
    var quotes = d3.select("#list-a").selectAll(".quote").data(data, function(row) {return row["id"];});
    
    quotes.exit().remove();
    
    var enter = quotes.enter().append("div")
    .attr("class", function(row) {
        var result = "quote ";
        result += row["type"];
        var isConsonant = row["consonant"];
        if("y"==isConsonant){
            result += " consonant";
        } else if("n"==isConsonant){
            result += " dissonant";
        } else {
            result += " neutral";
        }
        return result;
    });
    
    enter.append("div")
    .attr("class", function(row) {
        var result = "";
        var isConsonant = row["consonant"];
        if("n"==isConsonant){
            result += "bias-enabled";
        } else {
            result += "bias-disabled";
        }
        return result;
    });
    
    enter.append("div")
    .classed("bias", true)
    .attr("style",function(row) {
        var result = "";
        var isConsonant = row["consonant"];
        if("y"==isConsonant){
            var partyColor = row["bgcolor"];
            if(partyColor && !(partyColor==="")){
                result += "background-color: " + partyColor;
            }
        }
        return result===""?"background-color: #efefef":result;
    });
    
    enter.append("div")
    .classed("bias", true)
    .attr("style",function(row) {
        var result = "";
        var isConsonant = row["consonant"];
        if("n"==isConsonant){
            var partyColor = row["bgcolor"];
            if(partyColor && !(partyColor==="")){
                result += "background-color: " + partyColor;
            }
        }
        return result===""?"background-color: #efefef":result;
    });
    
    
    var subenter = enter.append("div").attr("class", function(row) {
        return "quote-" + row["type"];
    });
    subenter.append("span")
    .attr("style",function(row) {
        var result = "";
        var partyColor = row["bgcolor"];
        if(partyColor && !(partyColor==="")){
           result += "background-color: " + partyColor;
        }
        var fgColor = row["fgcolor"];
        if(fgColor && !(fgColor==="")){
           result += ";color: " + fgColor;
        }
        return result + "";
    })
    .classed("entity",true)
    .text(function(row){
        return row["entities"];
    });
    
    subenter.append("p")
    .classed("title",true)
    .text(function(row){
        return row["text"];
    });
    
    subenter.append("span").classed("source-label",true)
    .text("fonte");
    
    subenter.append("span")
    .classed("source",true)
    .text(function(row){
        return row["source"];
    });
    
    subenter.append("span")
    .classed("date",true)
    .text(function(row){
        return row["date"];
    });
    
    
}

function track() {
    console.info("fetching data");
    d3.csv(dataUrl,readData);
}


