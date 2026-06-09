function parseInput(input) {
    if (!input || input.trim() === '') return NaN;
    
    var expr = input.trim().replace(/\s+/g, '');
    
    // sqrt(x) -> x^(1/2)
    expr = expr.replace(/sqrt(\d+(\.\d+)?)/gi, '($1)^(1/2)');
    
    // nsqrt(x) -> x^(1/n)
    expr = expr.replace(/(\d+)sqrt(\d+)/gi, '($2)^(1/$1)');
    
    return evaluateMath(expr);
}

function evaluateMath(expr) {
    try {
        var evalExpr = expr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?|\$[^)]+\$|\d+\/\d+)/g, function(m, base, _, exp) {
            var expVal = exp;
            if (exp.includes('/')) {
                var p = exp.split('/');
                expVal = parseFloat(p[0]) / parseFloat(p[1]);
            } else if (exp.charAt(0) === '(' && exp.charAt(exp.length-1) === ')') {
                var inner = exp.slice(1, -1);
                if (/^[\d.]+$/.test(inner)) expVal = inner;
            }
            return 'Math.pow(' + base + ',' + expVal + ')';
        });
        
        var allowed = '0123456789.+-*/()Mathpow ';
        for (var i = 0; i < evalExpr.length; i++) {
            if (allowed.indexOf(evalExpr[i]) === -1) return NaN;
        }
        
        var result = new Function('return ' + evalExpr)();
        return isNaN(result) || !isFinite(result) ? NaN : result;
    } catch (e) {
        return NaN;
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
    document.querySelector('[onclick="switchTab(\'' + tabName + '\')"]').classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
    document.getElementById('hasil').innerHTML = '';
}

function insertSimbol(sym) {
    var inputs = document.querySelectorAll('input');
    var active = null;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.activeElement) { active = inputs[i]; break; }
    }
    if (!active) {
        var vis = document.querySelector('.tab-content.active input');
        if (vis) active = vis;
    }
    if (active) {
        var pos = active.selectionStart;
        var val = active.value;
        active.value = val.substring(0, pos) + sym + val.substring(pos);
        active.focus();
        active.setSelectionRange(pos + sym.length, pos + sym.length);
    }
}

function hitungBaris() {
    var a = parseInput(document.getElementById('suku1').value);
    var r = parseInput(document.getElementById('rasio').value);
    var n = parseInt(document.getElementById('n').value);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = '<p style="color:red;">Masukkan input valid! Contoh: sqrt(4), 2^3</p>';
        return;
    }
    
    var un = a * Math.pow(r, n - 1);
    document.getElementById('hasil').innerHTML = 
        '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:20px;border-radius:10px;">' +
        '<h3 style="text-align:center;margin-bottom:15px;">Penjelasan</h3>' +
        '<p><strong>Diketahui:</strong> a=' + a + ', r=' + r + ', n=' + n + '</p>' +
        '<p><strong>Rumus:</strong> Un = a x r^(n-1)</p>' +
        '<p><strong>Perhitungan:</strong> U' + n + ' = ' + a + ' x ' + r + '^' + (n-1) + '</p>' +
        '<p><strong>Hasil:</strong> U' + n + ' = ' + un.toFixed(4) + '</p>' +
        '</div>';
}

function hitungDeret() {
    var a = parseInput(document.getElementById('deret_a').value);
    var r = parseInput(document.getElementById('deret_r').value);
    var n = parseInt(document.getElementById('deret_n').value);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = '<p style="color:red;">Masukkan input valid! Contoh: sqrt(4), 2^3</p>';
        return;
    }
    
    var sn = Math.abs(r - 1) < 0.0001 ? a * n : a * (Math.pow(r, n) - 1) / (r - 1);
    document.getElementById('hasil').innerHTML = 
        '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:20px;border-radius:10px;">' +
        '<h3 style="text-align:center;margin-bottom:15px;">Penjelasan</h3>' +
        '<p><strong>Diketahui:</strong> a=' + a + ', r=' + r + ', n=' + n + '</p>' +
        '<p><strong>Rumus:</strong> Sn = a x (r^n - 1)/(r - 1)</p>' +
        '<p><strong>Perhitungan:</strong> S' + n + ' = ' + a + ' x (' + r + '^' + n + ' - 1)/(' + r + ' - 1)</p>' +
        '<p><strong>Hasil:</strong> S' + n + ' = ' + sn.toFixed(4) + '</p>' +
        '</div>';
}
