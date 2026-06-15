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

// Fungsi pembantu untuk membulatkan tampilan angka jika merupakan desimal panjang
function formatDesimal(angka) {
    if (isNaN(angka)) return "NaN";
    // Jika angka bulat asli, biarkan bulat. Jika desimal, potong jadi 3 angka di belakang koma
    return angka % 1 === 0 ? angka.toString() : Number(angka.toFixed(3)).toString();
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
        a = ${aInput} (${formatDesimal(a)})<br>
        r = ${rInput} (${formatDesimal(r)})<br>
        n = ${n}
        <br><br>
        <b>Rumus:</b><br>
        Un = a × r^(n-1)
        <br><br>
        <b>Penyelesaian:</b><br>
        U${n} = ${formatDesimal(a)} × (${formatDesimal(r)})^(${n}-1)<br>
        U${n} = ${formatDesimal(a)} × (${formatDesimal(r)})^${n-1}<br>
        U${n} = ${formatDesimal(un)}
        <br><br>
        <b>Akar Suku ke-${n}</b><br>
        √U${n} = ${isNaN(akar) ? "Hasil bernilai imajiner (Suku Un Negatif)" : formatDesimal(akar)}
        <br><br>
        <h3>Jawaban = ${formatDesimal(un)}</h3>
    `;
}

function hitungDeret() {
    let aInput = document.getElementById("deret_a").value;
    let rInput = document.getElementById("deret_r").value;
    let nUnInput = document.getElementById("deret_n_un").value; // Input ke-3 (n Un)
    let nSnInput = document.getElementById("deret_n_sn").value; // Input ke-4 (n Sn)

    let a = parseInput(aInput);
    let r = parseInput(rInput);
    let nUn = Number(nUnInput);
    let nSn = Number(nSnInput);
    let hasil = document.getElementById("hasil");

    // Validasi kelengkapan data input
    if (isNaN(a) || isNaN(r) || nUnInput === "" || nSnInput === "" || nUn < 1 || nSn < 1) {
        hasil.innerHTML = "❌ Input belum benar atau nilai n harus minimal 1";
        return;
    }

    // --- 1. Perhitungan Suku ke-n (Un) menggunakan nUn ---
    let un = a * Math.pow(r, nUn - 1);
    let langkahUn = `U${nUn} = ${formatDesimal(a)} × (${formatDesimal(r)})^(${nUn}-1) = ${formatDesimal(un)}`;

    // --- 2. Perhitungan Jumlah Suku (Sn) menggunakan nSn ---
    let sn;
    let langkahSn = "";

    if (r === 1) {
        sn = nSn * a;
        langkahSn = `S${nSn} = ${nSn} × ${formatDesimal(a)} = ${formatDesimal(sn)}`;
    } else {
        sn = (a * (Math.pow(r, nSn) - 1)) / (r - 1);
        
        let rn = Math.pow(r, nSn);
        let rnMinus1 = rn - 1;
        let rMinus1 = r - 1;
        let pembilangAtas = a * rnMinus1;

        langkahSn = `
            S${nSn} = (${formatDesimal(a)} × (${formatDesimal(r)}^${nSn} - 1)) / (${formatDesimal(r)} - 1)<br>
            S${nSn} = (${formatDesimal(a)} × (${formatDesimal(rn)} - 1)) / (${formatDesimal(rMinus1)})<br>
            S${nSn} = (${formatDesimal(pembilangAtas)}) / (${formatDesimal(rMinus1)})<br>
            S${nSn} = ${formatDesimal(sn)}
        `;
    }

    // --- Tampilkan hasil ke UI ---
    hasil.innerHTML = `
        <h2>Hasil Perhitungan Deret Geometri</h2>
        <b>Diketahui:</b><br>
        a = ${aInput} (${formatDesimal(a)})<br>
        r = ${rInput} (${formatDesimal(r)})<br>
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
        <b>Suku ke-${nUn} (U${nUn}) = ${formatDesimal(un)}</b><br>
        <b>Jumlah ${nSn} Suku (S${nSn}) = ${formatDesimal(sn)}</b>
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
