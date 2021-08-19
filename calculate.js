$(function(){

    $("#calculate").on("click", function(){

        var input = {
            startingAmount: parseFloat($("#starting-amount").val()),
            monthlyContribution: parseFloat($("#monthly-contribution").val()),
            avarageReturn: parseFloat($("#annual-return").val()),
            compaundingSettings: $('input[name=compaunding-settings]:checked', '#compaunding-settings').val(),
            years: parseInt($("#years").val()),
            inflation: parseFloat($("#inflation").val()),
        }

        
        var inputFlag = checkInput(input);
        logInput(input);
        var result = calculate(input);
        console.log('\n');
        console.log(result);
        populate(result);
    

    });
    
    $("#years-details").on("click", ".expand-button", function(){

        var year = $(this).attr("year");
        var yearDiv = $(`#year${year}-details`);

        if(yearDiv.css("display") == "none"){
            yearDiv.css("display", "block");
        }
        else{
            yearDiv.css("display", "none");
        }
        
    });

});

function checkInput(input){

    var flag = true;
    
    //check starting amount
    if(input.startingAmount < 0){
        alert("Starting amount can't be a negative number!");
        flag = false;
    }
    else if(isNaN(input.startingAmount)){
        input.startingAmount = 0;
    }

    //check monthly contribution
    if(input.monthlyContribution < 0){
        alert("Monthly contribution can't be a negarive number!");
        flag = false;
    }
    else if(isNaN(input.monthlyContribution)){
        input.monthlyContribution = 0;
    }

    //check annual return
    if(isNaN(input.avarageReturn)){
        input.avarageReturn = 0;
    }
    else{
        input.avarageReturn = input.avarageReturn / 100;
    }

    //check inflation
    if(isNaN(input.inflation)){
        input.inflation = 0;
    }
    else{
        input.inflation = input.inflation / 100;
    }

    return flag;
}

function logInput(input){
    console.log(
        "starting amount: " + input.startingAmount + "\n" + 
        "monthly contribution: " + input.monthlyContribution + "\n" + 
        "avarage return: " + input.avarageReturn + "\n" +
        "compaund settings: " + input.compaundingSettings + "\n" + 
        "years: " + input.years + "\n" + 
        "inflation: " + input.inflation
    )
}

function calculate(input){

    var total = {
        total: 0,
        years: []
    }

    var currentTotal = input.startingAmount;

    for(i=0; i<input.years; i++){
        year = {
            yearTotal: 0,
            months: []
        }
        for(j=1; j<=12; j++){

            currentTotal = currentTotal + input.monthlyContribution;

            var month = {
                invested: input.monthlyContribution
            }
            var monthTotal;
            var gainedByReturns;
            var lostByInflation;

            if(input.compaundingSettings == "monthly"){
                gainedByReturns = currentTotal * (input.avarageReturn / 12);
                lostByInflation = (currentTotal + gainedByReturns) * (input.inflation / 12);
                monthTotal = currentTotal + gainedByReturns - lostByInflation;
                currentTotal = monthTotal;
            }
            else if(input.compaundingSettings == "annual"){
                if(j==12){
                    gainedByReturns = currentTotal * (input.avarageReturn);
                    lostByInflation = (currentTotal + gainedByReturns) * (input.inflation)
                    monthTotal = currentTotal + gainedByReturns - lostByInflation;  
                }
                else{
                    monthTotal = currentTotal;
                    gainedByReturns = 0;
                    lostByInflation = 0;
                }
                currentTotal = monthTotal;
            }

            month.monthTotal = monthTotal;
            month.gainedByReturns = gainedByReturns;
            month.lostByInflation = lostByInflation;

            year.months.push(month);
        }
        year.yearTotal = currentTotal
        total.years.push(year);
    }
    total.total = currentTotal;
    return total;
}

function populate(result){
    populateSummary(result);
    populateDetailed(result);
}

function populateSummary(result){

    $(".output-summary").empty();

    $(".output-summary").append(
        '<h2>At the end of year ' + result.years.length + ' you will have: ' + result.total.toFixed(2));

}

function populateDetailed(result){

    $("#years-details").empty();

    for(i=1; i<result.years.length+1; i++){
        $("#years-details").append(`<div id=year${i}></div>`)
        $(`#year${i}`).append(`<h3>Year ${i}: ${result.years[i-1].yearTotal.toFixed(2)}</h3><button class="expand-button" year=${i}>Expand</button>`);
        $(`#year${i}`).append(`<div id=year${i}-details></div>`);
        for(j=1; j<result.years[i-1].months.length+1; j++){
            $(`#year${i}-details`).append(
                `<div id=year-${i}-month${j}>` + 
                `<h4>Month ${j}</h4>` + 
                `<p>Month total: ${result.years[i-1].months[j-1].monthTotal}` + 
                `<p>Income: ${result.years[i-1].months[j-1].invested}` +
                `<p>Gained by returns: ${result.years[i-1].months[j-1].gainedByReturns}` +
                `<p>Lost by inflation: ${result.years[i-1].months[j-1].lostByInflation}` +
                `</div>`
                );
            $(`#year${i}-details`).css("display", "none");
        }
    }

}