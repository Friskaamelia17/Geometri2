// script.js - VERSI LENGKAP DAN SUDAH DIUBAH

// ============ FUNGSI PARSING EXPRESSIONS MATEMATIKA ============

function parseInput(input) {
    if (!input || input.trim() === '') return NaN;
    
    let expr = input.trim();
    
    // Ganti semua spasi
    expr = expr.replace(/\s+/g, '');
    
    console.log("Input asli:", expr);
    
    // Handle berbagai format akar:
    
    // 1. Handle akar kuadrat: √16 → (16)^(1/2)
    expr = expr.replace(/√(\d+(\.\d+)?)/g, '($1)^(1/2)');
    
    // 2. Handle sqrt(x) → x^(1/2)
    expr = expr.replace(/sqrt(\d+(\.\d+)?)/gi, '($1)^(1/2)');
    
    // 3. Handle akar pangkat n: ³√8 → (8)^(1/3)
    expr = expr.replace(/(\d+)√(\d+(\.\d+)?)/g, '($2)^(1/$1)');
    
    // 4. Handle sqrt dengan kurung: sqrt(x) → (x)^(1/2)
    expr = expr.replace(/sqrt(\$[^)]+\$)/gi, function(match, inner) {
        return '(' + inner + ')^(1/2)';
    });
    
    console.log("Setelahparse akar:", expr);
    
    return evaluateMath(expr);
}

// ============ FUNGSI EVALUASI MATEMATIKA ============

function evaluateMath(expr) {
    try {
        let evalExpr = expr;
        
        // Handle pangkat (^) - ubah ke Math.pow()
        // Untuk angka^(angka) atau angka^(1/angka)
        evalExpr = evalExpr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?|\$[^)]+\$|\d+\/\d+)/g, 
            function(match, base, _, exp) {
                let expValue = exp;
                
                // Jika exp adalah pecahan seperti 1/2
                if (exp.includes('/')) {
                    let parts = exp.split('/');
                    expValue = parseFloat(parts[0]) / parseFloat(parts[1]);
                } 
                // Jika exp dalam kurung
                else if (exp.startsWith('(') && exp.endsWith(')')) {
                    let inner = exp.slice(1, -1);
                    if (/^[\d.]+$/.test(inner)) {
                        expValue = inner;
                    } else if (inner.includes('/')) {
                        let parts = inner.split('/');
                        expValue = parseFloat(parts[0]) / parseFloat(parts[1]);
                    }
                }
                
                return 'Math.pow(' + base + ',' + expValue + ')';
            }
        );
        
        console.log("Sesudah replace pow:", evalExpr);
        
        // Validasi hanya karakter yang diizinkan
        const allowedChars = '0123456789.+-*/()Mathpow ';
        for (let char of evalExpr) {
            if (!allowedChars.includes(char) && char !== ' ') {
                console.log("Karakter tidak diizinkan:", char);
                return NaN;
            }
        }
        
        // Evaluate dengan cara aman
        const result = new Function('return ' + evalExpr)();
        
        console.log("Hasil:", result);
        
        if (isNaN(result) || !isFinite(result)) {
            return NaN;
        }
        
        return result;
        
    } catch (e) {
        console.error("Error parsing:", e);
        return NaN;
    }
}

// ============ FUNGSI SWITCH TAB ============

function switchTab(tabName) {
    // Hapus semua active
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });
    
    // Tambah active ke tab yang dipilih
    var btn = document.querySelector('[onclick="switchTab(\'' + tabName + '\')"]');
    var content = document.getElementById(tabName + '-tab');
    
    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');
    
    // Clear hasil
    var hasil = document.getElementById('hasil');
    if (hasil) hasil.innerHTML = '';
}

// ============ INSERT SIMBOL ============

function insertSimbol(sym) {
    // Cari input yang aktif
    var inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    var activeInput = null;
    
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.activeElement) {
            activeInput = inputs[i];
            break;
        }
    }
    
    // Jika tidak ada yang aktif, cari yang visible
    if (!activeInput) {
        var visibleInputs = document.querySelectorAll('.tab-content.active input');
        if (visibleInputs.length > 0) {
            activeInput = visibleInputs[0];
        }
    }
    
    // Insert simbol di cursor position
    if (activeInput) {
        var start = activeInput.selectionStart;
        var end = activeInput.selectionEnd;
        var val = activeInput.value;
        
        activeInput.value = val.substring(0, start) + sym + val.substring(end);
        activeInput.focus();
        activeInput.setSelectionRange(start + sym.length, start + sym.length);
    }
}

// ============ HITUNG BARIS GEOMETRI ============

function hitungBaris() {
    var aInput = document.getElementById('suku1').value;
    var rInput = document.getElementById('rasio').value;
    var n = parseInt(document.getElementById('n').value);
    
    console.log("aInput:", aInput, "rInput:", rInput, "n:", n);
    
    // Parse input dengan support akar dan pangkat
    var a = parseInput(aInput);
    var r = parseInput(rInput);
    
    console.log("a:", a, "r:", r, "n:", n);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = 
            '<div style="background: #ffcccc; padding: 20px; border-radius: 15px; border-left: 5px solid #ff0000;">' +
            '<h3 style="color: #ff0000; margin-bottom: 10px;">❌ Input Tidak Valid</h3>' +
            '<p style="color: #333;">Masukkan angka atau ekspresi matematika yang valid!</p>' +
            '<p style="color: #666; margin-top: 10px;"><strong>Contoh yang bisa digunakan:</strong></p>' +
            '<ul style="color: #666; margin-left: 20px;">' +
            '<li>√4 (akar kuadrat)</li>' +
            '<li>sqrt(4) (akar kuadrat)</li>' +
            '<li>2^3 (pangkat)</li>' +
            '<li>³√8 (akar pangkat 3)</li>' +
            '<li>4^(1/2) (akar pangkat)</li>' +
            '</ul>' +
            '</div>';
        return;
    }
    
    var un = a * Math.pow(r, n - 1);
    
    var penjelasan = 
        '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">' +
        '<h3 style="margin: 0 0 15px 0; text-align: center;">📝 PENJELASAN LENGKAP</h3>' +
        
        '<div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 10px; border-left: 5px solid #FFD700;">' +
        '<div style="margin-bottom: 12px;">' +
        '<strong>✅ Diketahui:</strong><br>' +
        '- Suku pertama (a) = <strong>' + a + '</strong><br>' +
        '- Rasio (r) = <strong>' + r + '</strong><br>' +
        '- Suku ke-n (n) = <strong>' + n + '</strong>' +
        '</div>' +
        
        '<div style="margin-bottom: 12px;">' +
        '<strong>📐 Rumus Baris Geometri:</strong><br>' +
        '<span style="font-size: 1.2rem; color: #FFD700;">Un = a × r<sup>n-1</sup></span>' +
        '</div>' +
        
        '<div style="margin-bottom: 12px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px;">' +
        '<strong>🔢 Langkah Penyelesaian:</strong><br><br>' +
        
        '<div style="text-align: center; margin: 10px 0;">' +
        '<span style="font-size: 1.3rem;">U<sub>' + n + '</sub> = ' + a + ' × ' + r + '<sup>' + (n-1) + '</sup></span>' +
        '</div>' +
        
        '<div style="text-align: center; margin: 10px 0;">' +
        '<span style="font-size: 1.3rem; color: #90EE90;">' + r + '<sup>' + (n-1) + '</sup> = ' + Math.pow(r, n-1).toLocaleString('id-ID', {maximumFractionDigits: 4}) + '</span>' +
        '</div>' +
        
        '<div style="text-align: center;">' +
        '<span style="font-size: 1.5rem; color: #FF6B6B; font-weight: bold;">U<sub>' + n + '</sub> = <strong>' + un.toLocaleString('id-ID', {maximumFractionDigits: 4}) + '</strong></span>' +
        '</div>' +
        '</div>' +
        
        '<div style="margin-top: 15px; padding: 15px; background: rgba(255,215,0,0.3); border-radius: 8px; text-align: center; border: 2px solid #FFD700;">' +
        '<strong style="font-size: 1.3rem;">🎯 JAWABAN: U' + n + ' = ' + un.toLocaleString('id-ID', {maximumFractionDigits: 4}) + '</strong>' +
        '</div>' +
        '</div>' +
        '</div>';
    
    document.getElementById('hasil').innerHTML = penjelasan;
}

// ============ HITUNG DERET GEOMETRI ============

function hitungDeret() {
    var aInput = document.getElementById('deret_a').value;
    var rInput = document.getElementById('deret_r').value;
    var n = parseInt(document.getElementById('deret_n').value);
    
    console.log("aInput:", aInput, "rInput:", rInput, "n:", n);
    
    // Parse input dengan support akar dan pangkat
    var a = parseInput(aInput);
    var r = parseInput(rInput);
    
    console.log("a:", a, "r:", r, "n:", n);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = 
            '<div style="background: #ffcccc; padding: 20px; border-radius: 15px; border-left: 5px solid #ff0000;">' +
            '<h3 style="color: #ff0000; margin-bottom: 10px;">❌ Input Tidak Valid</h3>' +
            '<p style="color: #333;">Masukkan angka atau ekspresi matematika yang valid!</p>' +
            '<p style="color: #666; margin-top: 10px;"><strong>Contoh yang bisa digunakan:</strong></p>' +
            '<ul style="color: #666; margin-left: 20px;">' +
            '<li>√4 (akar kuadrat)</li>' +
            '<li>sqrt(4) (akar kuadrat)</li>' +
            '<li>2^3 (pangkat)</li>' +
            '<li>³√8 (akar pangkat 3)</li>' +
            '<li>4^(1/2) (akar pangkat)</li>' +
            '</ul>' +
            '</div>';
        return;
    }
    
    var sn, penjelasan;
    
    if (Math.abs(r - 1) < 0.0001) {
        // Kasus r = 1
        sn = a * n;
        penjelasan = 
            '<div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #333; padding: 25px; border-radius: 15px; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">' +
            '<h3 style="margin: 0 0 15px 0; text-align: center; color: #e74c3c;">📝 PENJELASAN LENGKAP (KASUS r = 1)</h3>' +
            
            '<div style="background: white; padding: 15px; border-radius: 10px; border-left: 5px solid #e74c3c;">' +
            '<div style="margin-bottom: 12px;">' +
            '<strong>✅ Diketahui:</strong><br>' +
            '- Suku pertama (a) = <strong>' + a + '</strong><br>' +
            '- Rasio (r) = <strong>1</strong><br>' +
            '- Jumlah suku (n) = <strong>' + n + '</strong>' +
            '</div>' +
            
            '<div style="margin-bottom: 12px;">' +
            '<strong>📐 Rumus Khusus (r = 1):</strong><br>' +
            '<span style="font-size: 1.2rem; color: #e74c3c;">Sn = a × n</span>' +
            '</div>' +
            
            '<div style="margin-bottom: 12px; padding: 15px; background: rgba(231,76,60,0.1); border-radius: 8px;">' +
            '<strong>🔢 Langkah Penyelesaian:</strong><br><br>' +
            
            '<div style="text-align: center; margin: 10px 0;">' +
            '<span style="font-size: 1.4rem;">S<sub>' + n + '</sub> = ' + a + ' × ' + n + ' = <strong>' + sn.toLocaleString('id-ID', {maximumFractionDigits: 4}) + '</strong></span>' +
            '</div>' +
            '</div>' +
            
            '<div style="margin-top: 15px; padding: 15px; background: rgba(46,204,113,0.2); border-radius: 8px; text-align: center; border: 2px solid #27ae60;">' +
            '<strong style="font-size: 1.3rem; color: #27ae60;">🎯 JAWABAN: S' + n + ' = ' + sn.toLocaleString('id-ID', {maximumFractionDigits: 4}) + '</strong>' +
            '</div>' +
            '</div>' +
            '</div>';
    } else {
        // Rumus umum
        var rn = Math.pow(r, n);
        sn = a * (rn - 1) / (r - 1);
        
        penjelasan = 
            '<div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; padding: 25px; border-radius: 15px; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">' +
            '<h3 style="margin: 0 0 15px 0; text-align: center; color: #3498db;">📝 PENJELASAN LENGKAP (RUMUS UMUM)</h3>' +
            
            '<div style="background: white; padding: 15px; border-radius: 10px; border-left: 5px solid #3498db;">' +
            '<div style="margin-bottom: 12px;">' +
            '<strong>✅ Diketahui:</strong><br>' +
            '- Suku pertama (a) = <strong>' + a + '</strong><br>' +
            '- Rasio (r) = <strong>' + r + '</strong><br>' +
            '- Jumlah suku (n) = <strong>' + n + '</strong>' +
            '</div>' +
            
            '<div style="margin-bottom: 12px;">' +
            '<strong>📐 Rumus Deret Geometri:</strong><br>' +
            '<span style="font-size: 1.2rem; color: #3498db;">Sn = a × (r<sup>n</sup> - 1)/(r - 1)</span>' +
            '</div>' +
            
            '<div style="margin-bottom: 12px; padding: 15px; background: rgba(52,152,219,0.1); border-radius: 8px;">' +
            '<strong>🔢 Langkah Penyelesaian:</strong><br><br>' +
