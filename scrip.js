// ================= PARSE INPUT =================

function parseInput(input){

    if(!input || input.trim()==""){
        return NaN;
    }

    let expr = input.trim();

    expr = expr.replace(/\s+/g,"");


    // akar √
    expr = expr.replace(/√/g,"Math.sqrt");


    // sqrt()
    expr = expr.replace(/sqrt/gi,"Math.sqrt");


    // akar pangkat
    expr = expr.replace(/³√(\d+)/g,"Math.pow($1,1/3)");
    expr = expr.replace(/⁴√(\d+)/g,"Math.pow($1,1/4)");
    expr = expr.replace(/⁵√(\d+)/g,"Math.pow($1,1/5)");


    // pangkat
    expr = expr.replace(/\^/g,"**");


    try{

        return Function("return "+expr)();

    }catch(error){

        return NaN;

    }

}



// ================= HITUNG BARIS =================

function hitungBaris(){


    let aText =
    document.getElementById("suku1").value;


    let rText =
    document.getElementById("rasio").value;


    let n =
    Number(document.getElementById("n").value);



    let a=parseInput(aText);

    let r=parseInput(rText);



    if(isNaN(a)||isNaN(r)||isNaN(n)){

        document.getElementById("hasil").innerHTML =
        "Input tidak valid";

        return;

    }



    let un = a * Math.pow(r,n-1);


    let akar = Math.sqrt(un);



    document.getElementById("hasil").innerHTML = `


<h2>Hasil Perhitungan</h2>

Diketahui:

<br>

a = ${aText}

<br>

r = ${rText}

<br>

n = ${n}


<br><br>


Rumus:

<br>

Un = a x r^(n-1)


<br><br>


Penyelesaian:

<br>


U${n} = ${aText} x (${rText})^(${n}-1)


<br>


U${n} = ${un}


<br><br>


Akar:

<br>

√U${n} = ${akar.toFixed(2)}


`;

}



// ================= DERET =================


function hitungDeret(){


let a=parseInput(
document.getElementById("deret_a").value
);


let r=parseInput(
document.getElementById("deret_r").value
);


let n=Number(
document.getElementById("deret_n").value
);



let hasil;


if(r==1){

hasil=a*n;

}else{

hasil=a*(Math.pow(r,n)-1)/(r-1);

}



document.getElementById("hasil").innerHTML=

"Sn = "+hasil;


}



// ================= SIMBOL =================


function insertSimbol(simbol){


let input=document.activeElement;


if(input.tagName=="INPUT"){

input.value += simbol;

}

}



// ================= TAB =================


function switchTab(tab){


let tabs =
document.querySelectorAll(".tab-content");


tabs.forEach(function(x){

x.classList.remove("active");

});



document.getElementById(tab+"-tab")
.classList.add("active");


}
