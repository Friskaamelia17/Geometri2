// ============ FUNGSI PARSING EXPRESSIONS MATEMATIKA ============

function parseInput(input) {
    if (!input || input.trim() === '') return NaN;
    
    let expr = input.trim();
    
    // Ganti semua spasi
    expr = expr.replace(/\s+/g, '');
    
    // Handle berbagai format akar:
    // 1. √16 → 16^(1/2)
    // 2. sqrt(16) → 16^(1/2)
    // 3. √ 16 → 16^(1/2)
    
    // Handle akar kuadrat: √x → x^(1/2)
    expr = expr.replace(/√(\d+(\.\d+)?)/g, '($1)^(1/2)');
    expr = expr.replace(/√(\$[^)]+\$)/, (match, inner) => {
        return `(${inner})^(1/2)`;
    });
    
    // Handle sqrt(x) → x^(1/2)
    expr = expr.replace(/sqrt(\d+(\.\d+)?)/gi, '($1)^(1/2)');
    expr = expr.replace(/sqrt(\$[^)]+\$)/gi, (match, inner) => `(${inner})^(1/2)`);
    
    // Handle akar pangkat n: ⁿ√x → x^(1/n)
    // Contoh: ³√8, ⁴√16
    expr = expr.replace(/(\d+)√(\d+(\.\d+)?)/g, '($2)^(1/$1)');
    
    // Handle pangkat: x^y
    // Hanya hitung jika ada tanda ^
    if (expr.includes('^')) {
        // Validasi format pangkat
        const powerRegex = /\^(\d+(\.\d+)?|\$[^)]+\$)/g;
        expr = expr.replace(powerRegex, (match, exp) => {
            return match; // Biarkan evaluateMath来处理
        });
    }
    
    return evaluateMath(expr);
}

// ============ FUNGSI EVALUASI MATEMATIKA ============

function evaluateMath(expr) {
    try {
        // Ganti operasi matematika ke format JavaScript
        let evalExpr = expr;
        
        // Handle pangkat (^)
        // Ubah a^(b) menjadi Math.pow(a,b)
        evalExpr = evalExpr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?|\$[^)]*\$)/g, (match, base, _, exp) => {
            // Jika exp berupa (a), ambil nilai di dalamnya
            let expValue = exp;
            if (exp.startsWith('(') && exp.endsWith(')')) {
                expValue = evaluateMath(exp.slice(1, -1));
            }
            return `Math.pow(${base},${expValue})`;
        });
        
        // Handle operasi dasar: +, -, *, /
        // Konversi format (1/2) menjadi 0.5 dll
        evalExpr = evalExpr.replace(/\/(\d+)/g, '/$1'); // Biarkan JS yang bagi
        
        // Validasi hanya angka dan operasi yang diizinkan
        if (!/^[\d\.\+\-\*\/\$\$\sMath.pow]+$/.test(evalExpr)) {
            return NaN;
        }
        
        // Evaluate dengan cara aman
        const result = new Function('return ' + evalExpr)();
        return result;
        
    } catch (e) {
        console.error("Error parsing:", e);
        return NaN;
    }
}

// ============ FUNGSI HITUNG BARIS GEOMETRI ============

function hitungBaris() {
    const aInput = document.getElementById('suku1').value;
    const rInput = document.getElementById('rasio').value;
    const n = parseInt(document.getElementById('n').value);
    
    // Parse input dengan support akar dan pangkat
    const a = parseInput(aInput);
    const r = parseInput(rInput);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = '❌ Masukkan angka atau ekspresi matematika yang valid!<br><small>Contoh: √4, sqrt(4), 2^3, ³√8</small>';
        return;
    }
    
    const un = a * Math.pow(r, n - 1);
    
    let penjelasan = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 20px; border-radius: 15px; margin-bottom: 15px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: 'Comic Sans MS', cursive;">
            <h3 style="margin: 0 0 15px 0; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                📝 PENJELASAN LENGKAP
            </h3>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; 
                        border-left: 5px solid #FFD700; line-height: 1.8; font-size: 1.1rem;">
                <div style="margin-bottom: 12px;">
                    <strong>✅ Diketahui:</strong><br>
                    - Suku pertama (a) = <strong>${a}</strong><br>
                    - Rasio (r) = <strong>${r}</strong><br>
                    - Suku ke-<strong>${n}</strong>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <strong>📐 Rumus Baris Geometri:</strong><br>
                    <span style="font-size: 1.3rem; color: #FFD700;">U<sub>n</sub> = a × r<sup>n-1</sup></span>
                </div>
                
                <div style="margin-bottom: 12px; padding: 15px; 
                            background: rgba(255,255,255,0.2); border-radius: 8px;">
                    <strong>🔢 Langkah Penyelesaian:</strong><br><br>
                    
                    <div style="text-align: center; margin: 10px 0;">
                        <span style="display: block; font-size: 1.4rem; margin: 8px 0;">
                            U<sub>${n}</sub> = ${a} × ${r}<sup>${n-1}</sup>
                        </span>
                    </div>
                    
                    <div style="text-align: center; margin: 10px 0;">
                        <span style="display: block; font-size: 1.4rem; margin: 8px 0; color: #90EE90;">
                            ${r}<sup>${n-1}</sup> = ${Math.pow(r, n-1).toLocaleString('id-ID', {maximumFractionDigits: 4})}
                        </span>
                    </div>
                    
                    <div style="text-align: center;">
                        <span style="display: block; font-size: 1.5rem; margin: 8px 0; 
                                    color: #FF6B6B; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                            U<sub>${n}</sub> = <strong>${un.toLocaleString('id-ID', {maximumFractionDigits: 4})}</strong>
                        </span>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding: 10px; 
                            background: rgba(255,215,0,0.2); border-radius: 8px; 
                            border: 2px solid #FFD700; text-align: center;">
                    <strong>🎯 JAWABAN:</strong><br>
                    <span style="font-size: 1.4rem; color: #FFD700;">Suku ke-${n} = ${un.toLocaleString('id-ID', {maximumFractionDigits: 4})}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('hasil').innerHTML = penjelasan;
}

// ============ FUNGSI HITUNG DERET GEOMETRI ============

function hitungDeret() {
    const aInput = document.getElementById('deret_a').value;
    const rInput = document.getElementById('deret_r').value;
    const n = parseInt(document.getElementById('deret_n').value);
    
    // Parse input dengan support akar dan pangkat
    const a = parseInput(aInput);
    const r = parseInput(rInput);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = '❌ Masukkan angka atau ekspresi matematika yang valid!<br><small>Contoh: √4, sqrt(4), 2^3, ³√8</small>';
        return;
    }
    
    let sn, penjelasan;
    
    if (Math.abs(r - 1) < 0.0001) {
        // Kasus r = 1
        sn = a * n;
        penjelasan = `
            <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); 
                        color: #333; padding: 20px; border-radius: 15px; margin-bottom: 15px; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: 'Comic Sans MS', cursive;">
                <h3 style="margin: 0 0 15px 0; text-align: center; color: #e74c3c; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    📝 PENJELASAN LENGKAP (KASUS KHUSUS r = 1)
                </h3>
                
                <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; 
                            border-left: 5px solid #e74c3c; line-height: 1.8; font-size: 1.1rem;">
                    <div style="margin-bottom: 12px;">
                        <strong>✅ Diketahui:</strong><br>
                        - Suku pertama (a) = <strong>${a}</strong><br>
                        - Rasio (r) = <strong>1</strong><br>
                        - Jumlah <strong>${n}</strong> suku
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <strong>📐 Kasus Khusus (r = 1):</strong><br>
                        <span style="font-size: 1.3rem; color: #e74c3c;">S<sub>n</sub> = a × n</span>
                    </div>
                    
                    <div style="margin-bottom: 12px; padding: 15px; 
                                background: rgba(231,76,60,0.1); border-radius: 8px;">
                        <strong>🔢 Langkah Penyelesaian:</strong><br><br>
                        
                        <div style="text-align: center; margin: 15px 0;">
                            <span style="display: block; font-size: 1.5rem; margin: 10px 0; color: #e74c3c;">
                                S<sub>${n}</sub> = ${a} × ${n}
                            </span>
                            <span style="display: block; font-size: 1.6rem; margin: 10px 0; 
                                        color: #27ae60; font-weight: bold;">
                                S<sub>${n}</sub> = <strong>${sn.toLocaleString('id-ID', {maximumFractionDigits: 4})}</strong>
                            </span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; padding: 10px; 
                                background: rgba(46,204,113,0.2); border-radius: 8px; 
                                border: 2px solid #27ae60; text-align: center;">
                        <strong>🎯 JAWABAN:</strong><br>
                        <span style="font-size: 1.4rem; color: #27ae60;">Jumlah ${n} suku = ${sn.toLocaleString('id-ID', {maximumFractionDigits: 4})}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Rumus umum
        const rn = Math.pow(r, n);
        sn = a * (rn - 1) / (r - 1);
        
        penjelasan = `
            <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); 
                        color: #333; padding: 20px; border-radius: 15px; margin-bottom: 15px; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: 'Comic Sans MS', cursive;">
                <h3 style="margin: 0 0 15px 0; text-align: center; color: #3498db; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    📝 PENJELASAN LENGKAP (RUMUS UMUM)
                </h3>
                
                <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; 
                            border-left: 5px solid #3498db; line-height: 1.8; font-size: 1.1rem;">
                    <div style="margin-bottom: 12px;">
                        <strong>✅ Diketahui:</strong><br>
                        - Suku pertama (a) = <strong>${a}</strong><br>
                        - Rasio (r) = <strong>${r}</strong><br>
                        - Jumlah <strong>${n}</strong> suku
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <strong>📐 Rumus Deret Geometri:</strong><br>
                        <span style="font-size: 1.3rem; color: #3498db;">S<sub>n</sub> = a × (r<sup>n</sup> - 1)/(r - 1)</span>
                    </div>
                    
                    <div style="margin-bottom: 12px; padding: 15px; 
                                background: rgba(52,152,219,0.1); border-radius: 8px;">
                        <strong>🔢 Langkah Penyelesaian:</strong><br><br>
                        
                        <div style="text-align: center; margin: 10px 0;">
                            <span style="display: block; font-size: 1.3rem; margin: 8px 0;">
                                S<sub>${n}</sub> = ${a} × (${r}<sup>${n}</sup> - 1)/( ${r} - 1)
                            </span>
                        </div>
                        
                        <div style="text-align: center; margin: 10px 0;">
                            <span style="display: block; font-size: 1.3rem; margin: 8px 0;">
                                S<sub>${n}</sub> = ${a} × (${rn.toLocaleString('id-ID', {maximumFractionDigits: 4})} - 1)/(${r} - 1)
                            </
