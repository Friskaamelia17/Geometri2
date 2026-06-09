// script.js - Complete Fixed Version

// ============ FUNGSI PARSING EXPRESSIONS MATEMATIKA ============

function parseInput(input) {
    if (!input || input.trim() === '') return NaN;
    
    let expr = input.trim();
    
    // Ganti semua spasi
    expr = expr.replace(/\s+/g, '');
    
    // Debug: console.log("Input:", expr);
    
    // Handle berbagai format akar:
    
    // 1. Handle akar kuadrat: √x → x^(1/2)
    // Sebelum: √16 → (16)^(1/2)
    // Setelah: (16)^(1/2) → Math.pow(16, 1/2) = 4
    expr = expr.replace(/√(\d+(\.\d+)?)/g, '($1)^(1/2)');
    
    // 2. Handle sqrt(x) → x^(1/2)
    expr = expr.replace(/sqrt(\d+(\.\d+)?)/gi, '($1)^(1/2)');
    
    // 3. Handle akar pangkat n: ⁿ√x → x^(1/n)
    // Contoh: ³√8 = 8^(1/3), ⁴√16 = 16^(1/4)
    expr = expr.replace(/(\d+)√(\d+(\.\d+)?)/g, '($2)^(1/$1)');
    
    // 4. Handle sqrt dengan parentheses: sqrt(x) → x^(1/2)
    expr = expr.replace(/sqrt(\$[^)]+\$)/gi, (match, inner) => {
        return `(${inner})^(1/2)`;
    });
    
    // 5. Handle pangkat sederhana: x^y
    // Tidak perlu diubah, akan dihandle oleh evaluateMath
    
    // console.log("Setelah parse akar:", expr);
    
    return evaluateMath(expr);
}

// ============ FUNGSI EVALUASI MATEMATIKA ============

function evaluateMath(expr) {
    try {
        let evalExpr = expr;
        
        // Handle pangkat (^)
        // Ubah a^(b) menjadi Math.pow(a, b)
        // Regex: angka^(angka) atau angka^(1/angka)
        evalExpr = evalExpr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?|\$[^)]+\$|\d+\/\d+)/g, (match, base, _, exp) => {
            // Cek apakah exp adalah pecahan like 1/2
            let expValue = exp;
            
            if (exp.includes('/')) {
                // Ini adalah pecahan seperti 1/2, 1/3, dll
                // Kita perlu hitung nilainya
                let parts = exp.split('/');
                expValue = parseFloat(parts[0]) / parseFloat(parts[1]);
            } else if (exp.startsWith('(') && exp.endsWith(')')) {
                // Ini adalah expression dalam parentheses
                // Recursive evaluation bisa dilakukan tapi perlu hati-hati
                // Untuk saat ini gunakan langsung
                let inner = exp.slice(1, -1);
                // Coba parsing jika inner adalah angka atau operasi sederhana
                if (/^[\d.\/]+$/.test(inner)) {
                    // Ini adalah pecahan seperti 1/2
                    let parts = inner.split('/');
                    expValue = parseFloat(parts[0]) / parseFloat(parts[1]);
                } else {
                    expValue = exp; // Biarkan apa adanya
                }
            }
            
            return `Math.pow(${base},${expValue})`;
        });
        
        // console.log("Sesudah replace pow:", evalExpr);
        
        // Validasi hanya angka dan operasi yang diizinkan
        const allowedChars = '0123456789.+-*/()Mathpow ';
        for (let char of evalExpr) {
            if (!allowedChars.includes(char) && char !== ' ') {
                console.log("Karakter tidak diizinkan:", char);
                return NaN;
            }
        }
        
        // Evaluate dengan cara aman
        const result = new Function('return ' + evalExpr)();
        
        if (isNaN(result) || !isFinite(result)) {
            return NaN;
        }
        
        return result;
        
    } catch (e) {
        console.error("Error parsing:", e);
        return NaN;
    }
}

// ============ FUN
