// ============ FUNGSI PARSING INPUT ============
function parseInput(input) {
    if (!input || input.trim() === '') return NaN;
    
    var expr = input.trim().replace(/\s+/g, '');
    
    // Handle sqrt(x) -> x^(1/2)
    expr = expr.replace(/sqrt(\d+(\.\d+)?)/gi, '($1)^(1/2)');
    
    // Handle nsqrt(x) -> x^(1/n)
    expr = expr.replace(/(\d+)sqrt(\d+)/gi, '($2)^(1/$1)');
    
    return evaluateMath(expr);
}

// ============ FUNGSI EVALUASI MATEMATIKA ============
function evaluateMath(expr) {
    try {
        var evalExpr = expr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?|\$[^)]+\$|\d+\/\d+)/g, 
            function(m, base, _, exp) {
                var expVal = exp;
                if (exp.includes('/')) {
                    var p = exp.split('/');
                    expVal = parseFloat(p[0]) / parseFloat(p[1]);
                } else if (exp.charAt(0) === '(' && exp.charAt(exp.length-1) === ')') {
                    var inner = exp.slice(1, -1);
                    if (/^[\d.]+$/.test(inner)) expVal = inner;
                }
                return 'Math.pow(' + base + ',' + expVal + ')';
            }
        );
        
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

// ============ SWITCH TAB ============
function switchTab(tabName) {
    var buttons = document.querySelectorAll('.tab-btn');
    var contents = document.querySelectorAll('.tab-content');
    
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }
    
    // Find button by data-tab attribute
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-tab') === tabName) {
            buttons[i].classList.add('active');
        }
    }
    
    document.getElementById(tabName + '-tab').classList.add('active');
    document.getElementById('hasil').innerHTML = '';
}

// Add click handlers to tabs
document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
            var tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    }
});

// ============ INSERT SIMBOL ============
function insertSimbol(sym) {
    var inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    var active = null;
    
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.activeElement) {
            active = inputs[i];
            break;
        }
    }
    
    if (!active) {
        var visibleInputs = document.querySelectorAll('.tab-content.active input[type="text"]');
        if (visibleInputs.length > 0) {
            active = visibleInputs[0];
        }
    }
    
    if (active) {
        var pos = active.selectionStart;
        var val = active.value;
        active.value = val.substring(0, pos) + sym + val.substring(pos);
        active.focus();
        active.setSelectionRange(pos + sym.length, pos + sym.length);
    }
}

// ============ HITUNG BARIS GEOMETRI ============
function hitungBaris() {
    var aInput = document.getElementById('suku1').value;
    var rInput = document.getElementById('rasio').value;
    var n = parseInt(document.getElementById('n').value);
    
    var a = parseInput(aInput);
    var r = parseInput(rInput);
    
    if (isNaN(a) || isNaN(r) || isNaN(n) || n <= 0) {
        document.getElementById('hasil').innerHTML = 
            '<div style="background: #ffcccc; padding: 20px; border-radius: 15px; border-left: 5px solid #ff0000;">' +
            '<h3 style="color: #ff0000; margin-bottom: 10px;"><i class="fas fa-exclamation-circle"></i> Input Tidak Valid</h3>' +
            '<p>Masukkan angka atau ekspresi matematika yang valid!</p>' +
            '<p style="margin-top: 10px;"><strong>Contoh:</strong></p>' +
            '<ul style="margin-left: 20px; color: #666;">' +
            '<li>sqrt(4) = 2</li>' +
            '<li>2^3 = 8</li>' +
            '<li>3sqrt(8) = 2</li>' +
            '</ul>' +
            '</div>';
        return;
    }
    
    var un = a * Math.pow(r, n - 1);
    
    var penjelasan = 
        '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">' +
        '<h3 style="text-align: center; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0
