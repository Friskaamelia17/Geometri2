function hitungDeret() {
    let aInput = document.getElementById("deret_a").value;
    let rInput = document.getElementById("deret_r").value;
    let nUnInput = document.getElementById("deret_n_un").value; // Mengambil input ke-3
    let nSnInput = document.getElementById("deret_n_sn").value; // Mengambil input ke-4

    let a = parseInput(aInput);
    let r = parseInput(rInput);
    let nUn = Number(nUnInput);
    let nSn = Number(nSnInput);
    let hasil = document.getElementById("hasil");

    // Validasi apakah semua 4 input sudah terisi dengan benar
    if (isNaN(a) || isNaN(r) || nUnInput === "" || nSnInput === "" || nUn < 1 || nSn < 1) {
        hasil.innerHTML = "❌ Input belum benar atau nilai n harus minimal 1";
        return;
    }

    // --- 1. Perhitungan Suku ke-n (Un) menggunakan nUn ---
    let un = a * Math.pow(r, nUn - 1);
    let langkahUn = `U${nUn} = ${a} × (${r})^(${nUn}-1) = ${un}`;

    // --- 2. Perhitungan Jumlah Suku (Sn) menggunakan nSn ---
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

    // --- Menampilkan Hasil Cetak Gabungan ke UI ---
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
