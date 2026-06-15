// Variable untuk melacak input mana yang terakhir kali aktif / difokuskan oleh pengguna
let lastFocusedInput = null;

// Daftarkan event listener setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            lastFocusedInput = input;
        });
    });
});

function parseInput(input) {
    if (input === "" || input === undefined) {
        return 0;
    }

    let nilai = input;

    // Menangani akar pangkat 3 (³√) dan akar pangkat 4 (⁴√) sesuai hint placeholder
    nilai = nilai.replace(/³√(\d+(?:\.\d+)?)/g, "Math.cbrt($1)");
    nilai = nilai.replace(/³√\(([^)]+)\)/g, "Math.cbrt($1)");
    nilai = nilai.replace(/⁴√(\d+(?:\.\d+)?)/g, "Math.pow($1, 1/4)");
    nilai = nilai.replace(/⁴√\(([^)]+)\)/g, "Math.pow($1, 1/4)");

    // Mengubah simbol akar kuadrat (√) menjadi fungsi Math.sqrt bawaan JS secara presisi
    nilai = nilai.replace(/√(\d+(?:\.\d+)?)/g, "Math.sqrt($1)");
    nilai = nilai.replace(/√(?=\()/g, "Math.sqrt"); // Jika user menulis dengan tanda kurung, misal √(4)

    // Pendukung jika pengguna mengetik tulisan 'sqrt' biasa
    nilai = nilai.replace(/(?<!Math\.)sqrt/g, "Math.sqrt");

    // Mengubah tanda caret (^) menjadi operator eksponen eksklusif JS (**)
    nilai = nilai.replace(/\^/g, "**");

    try {
        return Function("return " + nilai)();
    } catch (e) {
        return NaN;
    }
}

function hitungBaris() {
    let aInput = document.getElementById("suku1").value;
    let rInput = document.getElementById("rasio").value;
    let nInput = document.getElementById("n").value;

    let n = Number(nInput);
    let a = parseInput(aInput);
    let r = parseInput(rInput);
    let hasil = document.getElementById("hasil");

    if (isNaN(a) || isNaN(r) || nInput === "" || n < 1) {
        hasil.innerHTML = "❌ Input belum benar atau nilai n harus minimal 1";
        return;
    }

    let un = a * Math.pow(r, n - 1);
    let akar = Math.sqrt(un);

    hasil.innerHTML = `
        <h2>Hasil Perhitungan Baris</h2>
        <b>Diketahui:</b><br>
        a = ${aInput} (${a})<br>
        r = ${rInput} (${r})<br>
        n = ${n}
        <br><br>
        <b>Rumus:</b><br>
        Un = a × r^(n-1)
        <br><br>
        <b>Penyelesaian:</b><br>
        U${n} = ${a} × (${r})^(${n}-1)<br>
        U${n} = ${a} × (${r})^${n-1}<br>
        U${n} = ${un}
        <br><br>
        <b>Akar Suku ke-${n}</b><br>
        √U${n} = ${isNaN(akar) ? "Hasil bernilai imajiner (Suku Un Negatif)" : akar.toFixed(2)}
        <br><br>
        <h3>Jawaban = ${un}</h3>
    `;
}

function hitungDeret() {
    let aInput = document.getElementById("deret_a").value;
    let rInput = document.getElementById("deret_r").value;
    let nUnInput = document.getElementById("deret_n_un").value;
    let nSnInput = document.getElementById("deret_n_sn").value;

    let a = parseInput(aInput);
    let r = parseInput(rInput);
    let nUn = Number(nUnInput);
    let nSn = Number(nSnInput);
    let hasil = document.getElementById("hasil");

    // Validasi input
    if (isNaN(a) || isNaN(r) || nUnInput === "" || nSnInput === "" || nUn < 1 || nSn < 1) {
        hasil.innerHTML = "❌ Input belum benar atau nilai n harus minimal 1";
        return;
    }

    // --- Perhitungan Suku ke-n (Un) ---
    let un = a * Math.pow(r, nUn - 1);
    let langkahUn = `U${nUn} = ${a} × (${r})^(${nUn}-1) = ${un}`;

    // --- Perhitungan Jumlah Suku (Sn) ---
    let sn;
    let langkahSn = "";

    if (r === 1) {
        sn = nSn * a;
        langkahSn = `S${nSn} = ${nSn} × ${a} = ${sn}`;
    } else {
        sn = (a * (Math.pow(r, nSn) - 1)) / (r - 1);
        langkahSn = `
            S${nSn} = (${a} × (${r}^${nSn} - 1)) / (${r} - 1)<br>
            S${nSn} = (${a} × (${Math.pow(r, nSn)} - 1)) / (${r - 1})<br>
            S${nSn} = (${a * (Math.pow(r, nSn) - 1)}) / (${r - 1})<br>
            S${nSn} = ${sn}
        `;
    }

    // --- Menampilkan Hasil Gabungan ---
    hasil.innerHTML = `
        <h2>Hasil Perhitungan Deret Geometri</h2>
        <b>Diketahui:</b><br>
        a = ${aInput} (${a})<br>
        r = ${rInput} (${r})<br>
        n (untuk Un) = ${nUn}<br>
        n (untuk Sn) = ${nSn}
        <br><br>
        
        <h3>1. Perhitungan Suku ke-${nUn} (U${nUn})</h3>
        <b>Rumus:</b> Un = a × r^(n-1)<br>
        <b>Penyelesaian:</b><br>
        ${langkahUn}
        <br><br>
        
        <h3>2. Perhitungan Jumlah ${nSn} Suku Pertama (S${nSn})</h3>
        <b>Rumus:</b> ${r === 1 ? 'Sn = n × a' : 'Sn = a × (r^n - 1) / (r - 1)'}<br>
        <b>Penyelesaian:</b><br>
        ${langkahSn}
        <br><br>
        <hr>
        <h3>Hasil Akhir:</h3>
        <b>Suku ke-${nUn} (U${nUn}) = ${un}</b><br>
        <b>Jumlah ${nSn} Suku (S${nSn}) = ${sn}</b>
    `;
}

function insertSimbol(simbol) {
    if (!lastFocusedInput) {
        lastFocusedInput = document.querySelector("input");
    }

    if (lastFocusedInput) {
        let startPos = lastFocusedInput.selectionStart;
        let endPos = lastFocusedInput.selectionEnd;
        let textValue = lastFocusedInput.value;

        lastFocusedInput.value = textValue.substring(0, startPos) + simbol + textValue.substring(endPos);
        
        lastFocusedInput.focus();
        lastFocusedInput.selectionStart = lastFocusedInput.selectionEnd = startPos + simbol.length;
    }
}

function switchTab(tab) {
    document.querySelectorAll(".tab-content").forEach(function(x) {
        x.classList.remove("active");
    });

    document.getElementById(tab + "-tab").classList.add("active");

    document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.classList.remove("active");
    });

    const buttons = document.querySelectorAll(".tab-btn");
    if (tab === 'baris') {
        buttons[0].classList.add("active");
    } else if (tab === 'deret') {
        buttons[1].classList.add("active");
    }
}
