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
    let nInput = document.getElementById("deret_n").value;

    let n = Number(nInput);
    let a = parseInput(aInput);
    let r = parseInput(rInput);
    let hasil = document.getElementById("hasil");

    if (isNaN(a) || isNaN(r) || nInput === "" || n < 1) {
        hasil.innerHTML = "❌ Input belum benar atau nilai n harus minimal 1";
        return;
    }

    let sn;
    let langkahKerja = "";

    if (r === 1) {
        sn = n * a;
        langkahKerja = `S${n} = ${n} × ${a} = ${sn}`;
    } else {
        sn = (a * (Math.pow(r, n) - 1)) / (r - 1);
        langkahKerja = `
            S${n} = (${a} × (${r}^${n} - 1)) / (${r} - 1)<br>
            S${n} = (${a} × (${Math.pow(r, n)} - 1)) / (${r - 1})<br>
            S${n} = (${a * (Math.pow(r, n) - 1)}) / (${r - 1})<br>
            S${n} = ${sn}
        `;
    }

    hasil.innerHTML = `
        <h2>Hasil Perhitungan Deret</h2>
        <b>Diketahui:</b><br>
        a = ${aInput} (${a})<br>
        r = ${rInput} (${r})<br>
        n = ${n}
        <br><br>
        <b>Rumus:</b><br>
        ${r === 1 ? 'Sn = n × a (Rasio = 1)' : 'Sn = a × (r^n - 1) / (r - 1)'}
        <br><br>
        <b>Penyelesaian:</b><br>
        ${langkahKerja}
        <br><br>
        <h3>Jawaban = ${sn}</h3>
    `;
}

function insertSimbol(simbol) {
    // Jika user belum memfokuskan form manapun, arahkan otomatis ke input paling pertama
    if (!lastFocusedInput) {
        lastFocusedInput = document.querySelector("input");
    }

    if (lastFocusedInput) {
        let startPos = lastFocusedInput.selectionStart;
        let endPos = lastFocusedInput.selectionEnd;
        let textValue = lastFocusedInput.value;

        // Menyisipkan simbol tepat di koordinat posisi kursor aktif
        lastFocusedInput.value = textValue.substring(0, startPos) + simbol + textValue.substring(endPos);
        
        // Mengembalikan fokus kursor ke input box setelah tombol ditekan
        lastFocusedInput.focus();
        lastFocusedInput.selectionStart = lastFocusedInput.selectionEnd = startPos + simbol.length;
    }
}

function switchTab(tab) {
    // Sembunyikan semua container isi tab
    document.querySelectorAll(".tab-content").forEach(function(x) {
        x.classList.remove("active");
    });

    // Aktifkan tab yang dipilih
    document.getElementById(tab + "-tab").classList.add("active");

    // Reset status visual aktif pada seluruh tombol tab menu
    document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Tambahkan kembali kelas aktif pada tombol menu yang baru diklik
    const buttons = document.querySelectorAll(".tab-btn");
    if (tab === 'baris') {
        buttons[0].classList.add("active");
    } else if (tab === 'deret') {
        buttons[1].classList.add("active");
    }
}
