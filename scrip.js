// ================= PARSE AKAR & PANGKAT =================

function parseInput(input){

    if(!input || input.trim()==""){
        return NaN;
    }


    let expr = input.trim();

    expr = expr.replace(/\s+/g,"");



    // AKAR KUADRAT √

    expr = expr.replace(
        /√(\d+(\.\d+)?)/g,
        "Math.sqrt($1)"
    );


    // sqrt()

    expr = expr.replace(
        /sqrt\((.*?)\)/gi,
        "Math.sqrt($1)"
    );



    // AKAR PANGKAT

    expr = expr.replace(
        /³√(\d+)/g,
        "Math.pow($1,1/3)"
    );


    expr = expr.replace(
        /⁴√(\d+)/g,
        "Math.pow($1,1/4)"
    );


    expr = expr.replace(
        /⁵√(\d+)/g,
        "Math.pow($1,1/5)"
    );



    // PANGKAT

    expr = expr.replace(
        /\^/g,
        "**"
    );



    try{

        return Function(
            "return "+expr
        )();


    }catch(e){

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
        "❌ Input tidak valid";

        return;
    }



    let pangkat=n-1;


    let un =
    a*Math.pow(r,pangkat);



    let akar =
    Math.sqrt(un);



    document.getElementById("hasil").innerHTML = `


<h2>📌 Hasil Baris Geometri</h2>


<b>Diketahui:</b><br>

a = ${aText}<br>

r = ${rText}<br>

n = ${n}


<br><br>


<b>Rumus:</b><br>

Un = a × r⁽ⁿ⁻¹⁾


<br><br>


<b>Penyelesaian:</b><br>


U${n} = ${aText} × (${rText})⁽${n}-1⁾


<br>


U${n} = ${un.toFixed(2)}


<br><br>


<b>Akar:</b><br>


√U${n} = √${un.toFixed(2)}


<br>


√U${n} = ${akar.toFixed(2)}



<h3>
✅ Hasil Akhir = ${un.toFixed(2)}
</h3>

`;

}





// ================= HITUNG DERET =================


function hitungDeret(){


let a =
parseInput(document.getElementById("deret_a").value);


let r =
parseInput(document.getElementById("deret_r").value);


let n =
Number(document.getElementById("deret_n").value);



if(isNaN(a)||isNaN(r)||isNaN(n)){

document.getElementById("hasil").innerHTML=
"❌ Input tidak valid";

return;

}



let sn;


if(r==1){

sn=a*n;

}else{

sn=
a*(Math.pow(r,n)-1)/(r-1);

}



document.getElementById("hasil").innerHTML=`

<h2>📌 Hasil Deret</h2>


<b>Rumus:</b><br>

Sn = a(rⁿ-1)/(r-1)


<br><br>


S${n} = ${sn.toFixed(2)}

`;

}





// ================= TOMBOL SIMBOL =================


function insertSimbol(simbol){


let input=document.activeElement;


if(input.tagName=="INPUT"){


input.value += simbol;

input.focus();


}

}





// ================= TAB =================


function switchTab(tab){


document.querySelectorAll(".tab-content")
.forEach(function(x){

x.classList.remove("active");

});



document.querySelectorAll(".tab-btn")
.forEach(function(x){

x.classList.remove("active");

});



document.getElementById(tab+"-tab")
.classList.add("active");

event.target.classList.add("active");


}
