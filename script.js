function parseInput(input){

    if(input==""){
        return 0;
    }


    let nilai = input;


    nilai = nilai.replace(/√/g,"Math.sqrt");


    nilai = nilai.replace(/\^/g,"**");


    try{

        return Function("return "+nilai)();

    }catch(e){

        return NaN;

    }

}




function hitungBaris(){


    let aInput = document.getElementById("suku1").value;

    let rInput = document.getElementById("rasio").value;

    let n = Number(document.getElementById("n").value);



    let a = parseInput(aInput);

    let r = parseInput(rInput);



    let hasil = document.getElementById("hasil");



    if(isNaN(a) || isNaN(r) || n==""){


        hasil.innerHTML =

        "❌ Input belum benar";


        return;

    }



    let un = a * Math.pow(r,n-1);


    let akar = Math.sqrt(un);



    hasil.innerHTML = `


<h2>Hasil Perhitungan</h2>


<b>Diketahui:</b><br>

a = ${aInput}<br>

r = ${rInput}<br>

n = ${n}


<br><br>


<b>Rumus:</b><br>

Un = a × r^(n-1)


<br><br>


<b>Penyelesaian:</b><br>


U${n} = ${aInput} × (${rInput})^(${n}-1)


<br>


U${n} = ${un}


<br><br>


<b>Akar Suku ke-${n}</b><br>


√U${n} = ${akar.toFixed(2)}


<br><br>


<h3>
Jawaban = ${un}
</h3>


`;



}






function insertSimbol(simbol){


let input = document.activeElement;


if(input.tagName=="INPUT"){

input.value += simbol;

}

}




function switchTab(tab){


document.querySelectorAll(".tab-content")
.forEach(function(x){

x.classList.remove("active");

});


document.getElementById(tab+"-tab")
.classList.add("active");


}
