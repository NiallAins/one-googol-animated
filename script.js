const
    CN = document.createElement('canvas'),
    CW = window.innerWidth,
    CH = window.innerHeight * 0.7,
    CS = CW < 500 ? 8 : CW < 800 ? 10 : 12,
    CQ = 2,
    INP = document.getElementById('inp_num'),
    C    = CN.getContext('2d');

CN.width = CW * CQ;
CN.height = CH * CQ;
CN.style.width = CW + 'px';
CN.style.height = CH + 'px';
CN.style.position = 'fixed';
CN.style.inset = '0 0 auto 0';
document.body.appendChild(CN);

C.scale(CQ, CQ);
C.translate(CW * 0.5, CH * 0.5);
C.fillStyle = '#fff';
C.strokeStyle = '#000';
C.scale(CS, CS);
C.lineWidth = 2 / CS;

function drawFrame(step = 1000, showPrev) {
    C.clearRect(
        CW * -0.5, CH * -0.5,
        CW, CH
    );
    
    if (step < 1 && showPrev) {
        step = 1;
    }
    let num = Math.min(step, 1000);
    
    C.save();
        if (step > 1000) {
            let f = (step - 1000) / 50;
            f = 1 - Math.pow(1 - f, 3);
            C.translate(0, 2 * f);
            C.scale(1 - (0.9 * f), 1 - (0.9 * f));
            C.lineWidth = (2 / CS) + (0.375 * f);
        }
        const TZ = Math.floor(num / 100);
        for (let z = 0; z < TZ - 1; z++) {
            for (let x = 1; x <= 10; x++) {
                drawCube(x, 10, z);
                drawCube(10, x, z);
            }
        }
        if (TZ > 0) {
            for (let y = 1; y <= 10; y++) {
                for (let x = 1; x <= 10; x++) {
                    drawCube(x, y, TZ - 1);
                }
            }
        }
        outer: {
            for (let y = 1; y <= 10; y++) {
                for (let x = 1; x <= 10; x++) {
                    if ((TZ * 100) + ((y - 1) * 10) + x > num) {
                        break outer;
                    }
                    if (showPrev && num <= 100 && x === 1 && y === 1) {
                        C.save();
                            C.translate(0, 1.8);
                            C.scale(0.1, 0.1);
                            C.lineWidth = 0.5;
                            drawFrame();
                        C.restore();
                        drawCube(x, y, TZ, true);
                    } else {
                        drawCube(x, y, TZ);
                    }
                }
            }
        }
    C.restore();
}

function drawCube(x, y, z, nofill) {
    C.save();
        C.beginPath();
        C.translate(
            (x * -2) + (y * 2),
            x + y + (z * -2)
        );
        C.moveTo( 0,    0);
        C.lineTo(-2, -1);
        C.lineTo( 0, -2);
        C.lineTo( 2, -1);
        C.lineTo( 0,    0);
        C.lineTo( 0,    2);
        C.lineTo( 2,    1);
        C.lineTo( 2, -1);
        C.moveTo( 0,    2);
        C.lineTo(-2,    1);
        C.lineTo(-2, -1);
        C.lineTo( 0,    0);
        if (!nofill) {
            C.fill();
        }
        C.stroke();
    C.restore();
}

function updateInput(inp) {
    inp.style.setProperty('--value', (100 * inp.value / inp.max) + '%' )
    window.requestAnimationFrame(() => updateNum(inp.value));
}

function updateNum(num) {
    num = Math.floor(
            Math.min(1e100, Math.pow(num, Math.max(1, num)))
        )
        .toString()
        .replace(
            /(\.[0-9]+)?e\+([0-9]*)/,
            (_, m1, m2) => (m1 ? m1.substr(1) : '') +
                Array(parseInt(m2) - (m1 ? (m1.length - 1) : 0))
                .fill(0)
                .join('')
        )
        .replace('.', '');
    num = num
        .split('').reverse().join('')
        .replace(/([0-9]{3})/g, '$1,')
        .replace(/,$/, '')
        .split('').reverse().join('');
    tarFr =
        ((num.split(',').length - 1) * 1050) +
        parseInt(num.split(',')[0]) +
        (parseInt(num.split(',')[1] || 0) * 0.001);
    tarFr = Math.round(tarFr);
    txt_num.innerText = num;
    txt_name.innerText = getName(num);
}

const NAMES = {
    units: [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen'
    ],
    tens: [
        '',
        'ten',
        'twenty',
        'thirty',
        'fourty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninty'
    ],
    suffixs: [
        '',
        '',
        'thousand',    
        'million',
        'billion',
        'trillion',
        'quadrillion',
        'quintillion',
        'sextillion',
        'septillion',
        'octillion',
        'nonillion',
        'decillion',
        'undecillion',
        'duodecillion',
        'tredecillion',
        'quattuordecillion',
        'quindecillion',
        'sexdecillion',
        'septendecillion',
        'octodecillion',
        'novemdecillion',
        'vigintillion',
        'unvigintillion',
        'duovigintillion',
        'trevigintillion',
        'quattuorvigintillion',
        'quinvigintillion',
        'sexvigintillion',
        'septenvigintillion',
        'octovigintillion',
        'novemvigintillion',
        'trigintillion',
        'untrigintillion',
        'duotrigintillion'
    ]
};

function getName(num) {
    if (!num || num === '0') {
        return 'Zero';
    }
    if (num.match(/10(,000){33}/)) {
        return 'one googol';
    }
    return num
        .split(',')
        .map((n, i, a) => {
            n = parseInt(n);
            if (n === 0) {
                return '';
            }
            let str = [];
            if (n > 99) {
                str.push(NAMES.units[Math.floor(n / 100)] + ' hundred');
                n %= 100;
                if (n !== 0) {
                    str.push('and')
                }
            }
            if (n > 19) {
                str.push(
                    NAMES.tens[Math.floor(n / 10)],
                    NAMES.units[Math.floor(n % 10)]
                );
            } else if (n > 0) {
                str.push(NAMES.units[n]);
            }
            return str.join(' ') + ' ' + NAMES.suffixs[a.length - i];
        })
        .filter(a => a)
        .join(', ')
}

function animate() {
    if (curFr !== tarFr) {
        if (Math.abs(curFr - tarFr) < 1) {
            curFr = tarFr;
        } else {
            curFr += (tarFr - curFr) / 20;
        }
        drawFrame(Math.floor(curFr) % 1050, curFr > 1000);
    }
    window.requestAnimationFrame(animate);
}

let tarFr = curFr = 2;
INP.value = curFr;
updateInput(INP);
animate();