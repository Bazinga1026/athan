const METHOD = 4;

let prayerTimes = null;
let timerInterval = null;
let is12Hour = true;
let isEnglish = false;

const translations = {
    ar: {
        title: 'مواقيت الصلاة',
        city: 'الرياض، المملكة العربية السعودية',
        footer: 'مواقيت الصلاة للرياض | حسب طريقة أم القرى',
        langBtn: 'EN',
        timerStatusCountdown: 'الوقت المتبقي للأذان',
        timerStatusElapsed: 'مرّ منذ الأذان',
        timerStatusDone: 'انتهى وقت الصلاة',
        adhanOf: 'أذان',
        nowText: 'آن',
        nextPrayerLabel: 'الصلاة القادمة',
        loadError: 'خطأ في تحميل البيانات',
        prayers: {
            Fajr: 'الفجر',
            Dhuhr: 'الظهر',
            Asr: 'العصر',
            Maghrib: 'المغرب',
            Isha: 'العشاء'
        }
    },
    en: {
        title: 'Prayer Times',
        city: 'Riyadh, Saudi Arabia',
        footer: 'Prayer Times for Riyadh | Umm Al-Qura Method',
        langBtn: 'عر',
        timerStatusCountdown: 'Time Until Adhan',
        timerStatusElapsed: 'Time Since Adhan',
        timerStatusDone: 'Prayer Time Ended',
        adhanOf: 'Adhan',
        nowText: 'now',
        nextPrayerLabel: 'Next Prayer',
        loadError: 'Error loading data',
        prayers: {
            Fajr: 'Fajr',
            Dhuhr: 'Dhuhr',
            Asr: 'Asr',
            Maghrib: 'Maghrib',
            Isha: 'Isha'
        }
    }
};

function t(key) {
    const lang = isEnglish ? 'en' : 'ar';
    return translations[lang][key];
}

function tPrayer(name) {
    const lang = isEnglish ? 'en' : 'ar';
    return translations[lang].prayers[name];
}

function updateLanguage() {
    document.getElementById('lang-btn').textContent = t('langBtn');
    document.getElementById('title').textContent = t('title');
    document.getElementById('city').textContent = t('city');
    document.getElementById('footer-text').textContent = t('footer');
    document.getElementById('fajr-name').textContent = tPrayer('Fajr');
    document.getElementById('dhuhr-name').textContent = tPrayer('Dhuhr');
    document.getElementById('asr-name').textContent = tPrayer('Asr');
    document.getElementById('maghrib-name').textContent = tPrayer('Maghrib');
    document.getElementById('isha-name').textContent = tPrayer('Isha');

    if (isEnglish) {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        document.body.classList.add('ltr');
    } else {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        document.body.classList.remove('ltr');
    }

    displayHijriDate();
}

const hijriMonthsAr = ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const hijriMonthsEn = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];

function gmod(n, m) {
    return ((n % m) + m) % m;
}

function toHijri(gYear, gMonth, gDay) {
    var y = gYear;
    var m = gMonth;
    var d = gDay;

    if (m < 3) {
        y -= 1;
        m += 12;
    }

    var a = Math.floor(y / 100);
    var b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y === 1582) {
        if (m > 10) b = -10;
        if (m === 10) {
            b = 0;
            if (d > 4) b = -10;
        }
    }

    var jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;

    var a2 = 0;
    if (jd > 2299160) {
        a2 = Math.floor((jd - 1867216.25) / 36524.25);
        b = 1 + a2 - Math.floor(a2 / 4);
    }

    var bb = jd + b + 1524;
    var cc = Math.floor((bb - 122.1) / 365.25);
    var dd = Math.floor(365.25 * cc);
    var ee = Math.floor((bb - dd) / 30.6001);

    var gDay2 = bb - dd - Math.floor(30.6001 * ee);
    var gMonth2 = ee < 14 ? ee - 1 : ee - 13;
    var gYear2 = cc - 4716;

    var iyear = 10631 / 30;
    var epochastro = 1948084;
    var epochcivil = 1948085;

    var shift1 = 8.01 / 60;
    var z = jd - epochastro;
    var cyc = Math.floor(z / 10631);
    z = z - cyc * 10631;
    var j = Math.floor((z - shift1) / 325.0334);
    var i = 30 * j + j;
    z = z - i;
    j = Math.floor((z - 0.0926) / (325.0334 / 30));
    i = 30 * j + j;
    z = z - i;
    i = Math.floor((z + 0.0926) / (325.0334 / 30));
    z = z - Math.floor(i * (325.0334 / 30));

    var iy = cyc * 30 + j + i;
    var im = z + 1;
    var id = z + 1;

    // Fix day calculation
    var k = 1;
    var monthLength = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

    // Leap year check for 30-year cycle
    var ly = iy % 30;
    if (ly === 2 || ly === 5 || ly === 7 || ly === 10 || ly === 13 || ly === 16 || ly === 18 || ly === 21 || ly === 24 || ly === 26 || ly === 29) {
        monthLength[11] = 30;
    }

    // Recalculate properly
    var l = Math.floor((30 * iy + 3) / 10);
    var q = Math.floor((l - 1) / 11);
    var r = l - 1 - 11 * q;
    var jj = 1 + Math.floor((iy - 1) * 10.631) / 325.0334;

    // Use Kuwaiti algorithm result
    var hijriDay = Math.floor(jd - epochastro - Math.floor((iy * 10631) / 30)) + 1;
    var hijriMonth = Math.floor((32 * (jd - epochastro - Math.floor((iy * 10631) / 30) + 1 - hijriDay)) / 325);
    var hijriYear = iy;

    // Adjust for the epoch
    var l2 = epochastro + hijriDay + Math.floor((32 * hijriMonth) / 325);
    hijriMonth = Math.floor((30 * (l2 - epochastro + 1) + 10631) / 325.0334) - 30;
    hijriDay = l2 - epochastro - Math.floor((30 * hijriMonth + 3) / 10) + 1;
    hijriMonth = Math.floor(((jd - epochastro) * 10) / 325.0334);
    hijriDay = Math.floor(jd - epochastro - Math.floor(hijriMonth * 325.0334 / 10)) + 1;
    hijriYear = Math.floor((jd - epochastro) / iyear) + 1;

    // Reset and use the proven Kuwaiti algorithm
    var jd2 = Math.floor(365.25 * (gYear + 4716)) + Math.floor(30.6001 * (gMonth + 1)) + gDay - 1524.5;

    var l3 = Math.floor(jd2 - 1948439.5 + 10632);
    var n = Math.floor((l3 - 1) / 10631);
    l3 = l3 - 10631 * n + 354;
    var j2 = Math.floor((10985 - l3) / 5316) * Math.floor((50 * l3) / 17719) + Math.floor(l3 / 5670) * Math.floor((43 * l3) / 15238);
    l3 = l3 - Math.floor((30 - j2) / 15) * Math.floor((17719 * j2) / 50) - Math.floor(j2 / 16) * Math.floor((15238 * j2) / 43) + 29;
    var hm = Math.floor((24 * l3) / 709);
    var hd = l3 - Math.floor((709 * hm) / 24);
    var hy = 30 * n + j2 - 30;

    return { year: hy, month: hm, day: hd };
}

function displayHijriDate() {
    var now = new Date();
    var h = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
    if (isEnglish) {
        document.getElementById('hijri-date').textContent = h.day + ' ' + hijriMonthsEn[h.month - 1] + ' ' + h.year + ' AH';
    } else {
        document.getElementById('hijri-date').textContent = h.day + ' ' + hijriMonthsAr[h.month - 1] + ' ' + h.year + ' هـ';
    }
}

async function fetchPrayerTimes() {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Riyadh&country=Saudi+Arabia&method=${METHOD}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
            prayerTimes = data.data.timings;

            displayHijriDate();
            updatePrayerTimesDisplay();
            startTimer();
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        document.getElementById('hijri-date').textContent = t('loadError');
    }
}

function updatePrayerTimesDisplay() {
    document.getElementById('fajr-time').textContent = formatTimeDisplay(prayerTimes.Fajr);
    document.getElementById('dhuhr-time').textContent = formatTimeDisplay(prayerTimes.Dhuhr);
    document.getElementById('asr-time').textContent = formatTimeDisplay(prayerTimes.Asr);
    document.getElementById('maghrib-time').textContent = formatTimeDisplay(prayerTimes.Maghrib);
    document.getElementById('isha-time').textContent = formatTimeDisplay(prayerTimes.Isha);
}

function formatTime(timeStr) {
    return timeStr.split(' ')[0];
}

function formatTimeDisplay(timeStr) {
    const time24 = formatTime(timeStr);
    if (!is12Hour) return time24;
    return to12Hour(time24);
}

function to12Hour(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function getTimerState() {
    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (let i = 0; i < prayerOrder.length; i++) {
        const prayerTimeSeconds = parseTime(formatTime(prayerTimes[prayerOrder[i]])) * 60;
        if (currentSeconds < prayerTimeSeconds) {
            return {
                nextPrayer: prayerOrder[i],
                previousPrayer: i > 0 ? prayerOrder[i - 1] : prayerOrder[prayerOrder.length - 1],
                nextPrayerTime: prayerTimeSeconds,
                previousPrayerTime: i > 0
                    ? parseTime(formatTime(prayerTimes[prayerOrder[i - 1]])) * 60
                    : parseTime(formatTime(prayerTimes[prayerOrder[prayerOrder.length - 1]])) * 60 - 24 * 3600
            };
        }
    }

    return {
        nextPrayer: prayerOrder[0],
        previousPrayer: prayerOrder[prayerOrder.length - 1],
        nextPrayerTime: parseTime(formatTime(prayerTimes[prayerOrder[0]])) * 60 + 24 * 3600,
        previousPrayerTime: parseTime(formatTime(prayerTimes[prayerOrder[prayerOrder.length - 1]])) * 60
    };
}

function updateTimer() {
    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const state = getTimerState();
    const timerEl = document.getElementById('timer');
    const statusEl = document.getElementById('timer-status');
    const nextPrayerEl = document.getElementById('next-prayer');

    const timeUntilNext = state.nextPrayerTime - currentSeconds;
    const timeSincePrev = currentSeconds - state.previousPrayerTime;

    highlightPrayer(state.nextPrayer);

    if (timeSincePrev <= 1800) {
        statusEl.textContent = t('timerStatusElapsed');
        nextPrayerEl.textContent = `${t('adhanOf')} ${tPrayer(state.previousPrayer)} ${t('nowText')}`;
        timerEl.textContent = formatCountdown(timeSincePrev);
        timerEl.style.color = '#fdcb6e';
    } else if (timeUntilNext > 0) {
        statusEl.textContent = t('timerStatusCountdown');
        nextPrayerEl.textContent = `${t('adhanOf')} ${tPrayer(state.nextPrayer)}`;
        timerEl.textContent = formatCountdown(timeUntilNext);
        timerEl.style.color = '#00b894';
    } else {
        statusEl.textContent = t('timerStatusDone');
        nextPrayerEl.textContent = `${t('nextPrayerLabel')}: ${tPrayer(state.nextPrayer)}`;
        timerEl.textContent = '---';
        timerEl.style.color = '#b2bec3';
    }
}

function formatCountdown(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function highlightPrayer(prayerName) {
    const rows = document.querySelectorAll('.prayer-row');
    rows.forEach(row => {
        row.classList.toggle('active', row.dataset.prayer === prayerName);
    });
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

document.addEventListener('DOMContentLoaded', () => {
    fetchPrayerTimes();

    document.getElementById('time-format-toggle').addEventListener('change', (e) => {
        is12Hour = e.target.checked;
        if (prayerTimes) updatePrayerTimesDisplay();
    });

    document.getElementById('lang-btn').addEventListener('click', () => {
        isEnglish = !isEnglish;
        updateLanguage();
        if (prayerTimes) {
            updatePrayerTimesDisplay();
            updateTimer();
        }
    });
});
