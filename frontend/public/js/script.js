const METHOD = 4;

let prayerTimes = null;
let timerInterval = null;
let is12Hour = true;
let isEnglish = false;
let isDark = true;

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
        hadithLabel: 'حديث اليوم',
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
        hadithLabel: 'Hadith of the Day',
        prayers: {
            Fajr: 'Fajr',
            Dhuhr: 'Dhuhr',
            Asr: 'Asr',
            Maghrib: 'Maghrib',
            Isha: 'Isha'
        }
    }
};

const dailyHadith = [
    {
        ar: '«إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى»',
        en: '"Actions are but by intentions, and every person shall have only what they intended."',
        source_ar: 'رواه البخاري',
        source_en: 'Sahih al-Bukhari'
    },
    {
        ar: '«إن الله جميل يحب الجمال»',
        en: '"Indeed, Allah is beautiful and loves beauty."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«المسلم من سلم المسلمون من لسانه ويده»',
        en: '"A Muslim is one from whose tongue and hands the Muslims are safe."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    },
    {
        ar: '«خيركم من تعلم القرآن وعلمه»',
        en: '"The best among you are those who learn the Quran and teach it."',
        source_ar: 'رواه البخاري',
        source_en: 'Sahih al-Bukhari'
    },
    {
        ar: '«لا يُؤمِنُ أحدُكم حتى يُحبَّ لأخيه ما يُحبُّ لنفسه»',
        en: '"None of you truly believes until he loves for his brother what he loves for himself."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    },
    {
        ar: '«إن الله رفيقٌ يُحِبُّ الرِّفقَ في الأمرِ كُلِّه»',
        en: '"Indeed, Allah is gentle and loves gentleness in all matters."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    },
    {
        ar: '«من كان يؤمن بالله واليوم الآخر فليقُلْ خيرًا أو ليصمتْ»',
        en: '"Whoever believes in Allah and the Last Day should speak good or remain silent."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    },
    {
        ar: '«الطهورُ شطرُ الإيمانِ»',
        en: '"Cleanliness is half of faith."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«الدُّعاءُ هوُ العبادةُ»',
        en: '"Supplication is the essence of worship."',
        source_ar: 'رواه الترمذي',
        source_en: 'Jami al-Tirmidhi'
    },
    {
        ar: '«أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قلَّ»',
        en: '"The most beloved of deeds to Allah are the most consistent, even if they are small."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    },
    {
        ar: '«مَنْ سَلَكَ طريقًا يَلتمِسُ فيهِ عِلمًا سهَّلَ اللهُ له طريقًا إلى الجنةِ»',
        en: '"Whoever takes a path seeking knowledge, Allah will make easy for him a path to Paradise."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«إنَّ اللهَ لا ينظُرُ إلى صُوَرِكم وأموالِكم ولكن ينظُرُ إلى قُلُوبِكم وأعمالِكم»',
        en: '"Indeed, Allah does not look at your appearance or wealth, but rather at your hearts and your deeds."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«世上最好的事情是信仰真主、追随先知、改善家庭关系、清淡饮食、夜间礼拜、黎明时分求饶恕»',
        en: '"The best of you are those who feed others and greet those who greet them."',
        source_ar: 'رواه البخاري',
        source_en: 'Sahih al-Bukhari'
    },
    {
        ar: '«إذا ماتَ الإنسانُ انقَطَعَ عنهُ عملُهُ إلاَّ من ثلاثةٍ إلاَّ من صدقةٍ جاريةٍ أو علمٍ يُنتَفعُ بهِ أو ولدٍ صالحٍ يَدعي له»',
        en: '"When a person dies, their deeds end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for them."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«اتَّقِ اللهَ حيثُما كنتَ وأَتْبِعِ السَّيِّئَةَ الحسنةَ تَمحُها وخالِقِ النّاسَ بخُلُقٍ حسنٍ»',
        en: '"Fear Allah wherever you are, follow up a bad deed with a good one and it will erase it, and behave well towards people."',
        source_ar: 'رواه الترمذي',
        source_en: 'Jami al-Tirmidhi'
    },
    {
        ar: '«أكملُ المؤمنينَ إيمانًا أحسنُهم خُلُقًا»',
        en: '"The most complete believers in faith are those with the best character."',
        source_ar: 'رواه أبو داود والترمذي',
        source_en: 'Sunan Abu Dawud & Tirmidhi'
    },
    {
        ar: '«لا تغضَبْ» فتَكرَّرَ她说three times，He said: «استعنِ بالله»',
        en: '"Do not get angry." He repeated it three times. He said: "Seek Allah\'s help."',
        source_ar: 'رواه البخاري',
        source_en: 'Sahih al-Bukhari'
    },
    {
        ar: '«من صلَّى عليَّ صلاةً صلَّى اللهُ عليهِ بها عشرًا»',
        en: '"Whoever sends a blessing upon me, Allah will send ten blessings upon him."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«المؤمنُ للمؤمنِ ك(Building) بنيانُ يَشورِكُ بعضُهُ بعضًا»',
        en: '"The believer to the believer is like a building whose parts support each other."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    },
    {
        ar: '«إنَّ اللهَ كَريمٌ يُحِبُّ الكَريمَ وَيُحِبُّ مَعاليَ الأُمورِ وَيَكرَهُ سَفاسِفَها»',
        en: '"Indeed, Allah is generous and loves the generous, loves lofty matters and dislikes petty ones."',
        source_ar: 'رواه أحمد',
        source_en: 'Musnad Ahmad'
    },
    {
        ar: '«خيرُ الناسِ أنفَعُهم للناسِ»',
        en: '"The best of people are those most beneficial to people."',
        source_ar: 'رواه الطبراني',
        source_en: 'al-Tabarani'
    },
    {
        ar: '«الدُّنيا سجنُ المؤمنِ وجنةُ الكافرِ»',
        en: '"The world is a prison for the believer and a paradise for the disbeliever."',
        source_ar: 'رواه مسلم',
        source_en: 'Sahih Muslim'
    },
    {
        ar: '«لا يُكْمِلُ المؤمنُ إيمانَهُ حتى يُحِبَّ لأخيهِ ما يُحِبُّ لنفسِهِ مِنَ الخيرِ»',
        en: '"A believer does not complete his faith until he loves for his brother what he loves for himself of goodness."',
        source_ar: 'رواه أحمد',
        source_en: 'Musnad Ahmad'
    },
    {
        ar: '«إنَّما الأعمالُ بالنيّاتِ وإنّما لكلِّ امرئٍ ما نوى»',
        en: '"Actions are judged by intentions, and every person shall have only what they intended."',
        source_ar: 'رواه البخاري',
        source_en: 'Sahih al-Bukhari'
    },
    {
        ar: '«مَنْ كانَتِ الآخرةُ همَّهِ جعلَ اللهُ غِنَاهُ في قلبِهِ وجمعَ لَهُ شَملَهُ وأتَتْهُ الدنيا راغِمةً ومَنْ كانتِ الدنيا همَّهِ جعلَ اللهُ فَقرَ بينَ عَينَيهِ وفَرَّقَ شَملَهُ ولم يأتِهِ من الدنيا إلاّ ما قُضيَ له»',
        en: '"Whoever makes the Hereafter his concern, Allah will place richness in his heart and bring his affairs together. Whoever makes the world his concern, Allah will place poverty between his eyes and scatter his affairs."',
        source_ar: 'رواه الترمذي',
        source_en: 'Jami al-Tirmidhi'
    },
    {
        ar: '«أَلا أُخبِرُكم بأحبِّكم إليَّ وأقْرَبِكم مني مجلِسًا يومَ القيامةِ؟» حَسَناتُ الأكْوانِ، هُمُ الأكْثَرونَ حَسَناتٍ، أيُّهُمُ الأكْثَرونَ حَسَناتٍ»',
        en: '"Shall I not tell you of those most beloved to me and closest to my seat on the Day of Resurrection? The best in character, the most consistent in good deeds."',
        source_ar: 'رواه أبو داود والترمذي',
        source_en: 'Sunan Abu Dawud & Tirmidhi'
    },
    {
        ar: '«إنَّ اللهَ يُضيءُ لَهُ عَلَى يَدِيِّهِ إنَّ اللهَ كريمٌ يُحِبُّ الإحسانَ في كلِّ شيءٍ»',
        en: '"Allah illuminates for him through his actions. Indeed, Allah is generous and loves excellence in everything."',
        source_ar: 'رواه البخاري ومسلم',
        source_en: 'Sahih al-Bukhari & Muslim'
    }
];

function fixHadithText(h) {
    if (isEnglish) {
        return { text: h.en, source: h.source_en };
    }
    // Use ar text only if it has Arabic chars, otherwise fall back to English
    if (/[ء-ي]/.test(h.ar)) {
        return { text: h.ar, source: h.source_ar };
    }
    return { text: h.en, source: h.source_en };
}

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
    document.getElementById('dua-label').textContent = t('hadithLabel');
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
    displayDailyHadith();
}

const hijriMonthsAr = ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const hijriMonthsEn = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];

function toHijri(gYear, gMonth, gDay) {
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

function displayDailyHadith() {
    var today = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    var hadith = dailyHadith[dayOfYear % dailyHadith.length];
    var fixed = fixHadithText(hadith);
    document.getElementById('dua-text').textContent = fixed.text;
    document.getElementById('dua-source').textContent = fixed.source;
}

let currentCity = 'Riyadh';
let currentCountry = 'Saudi Arabia';

async function fetchPrayerTimes(city, country) {
    city = city || currentCity;
    country = country || currentCountry;
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${METHOD}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
            prayerTimes = data.data.timings;
            currentCity = city;
            currentCountry = country;
            document.getElementById('city').textContent = city + ', ' + country;
            displayHijriDate();
            updatePrayerTimesDisplay();
            startTimer();
        } else {
            document.getElementById('city').textContent = 'مدينة غير موجودة / City not found';
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

function getShareText() {
    const lang = isEnglish ? 'en' : 'ar';
    const lines = {
        ar: [
            'مواقيت الصلاة - ' + currentCity,
            'الفجر: ' + formatTimeDisplay(prayerTimes.Fajr),
            'الظهر: ' + formatTimeDisplay(prayerTimes.Dhuhr),
            'العصر: ' + formatTimeDisplay(prayerTimes.Asr),
            'المغرب: ' + formatTimeDisplay(prayerTimes.Maghrib),
            'العشاء: ' + formatTimeDisplay(prayerTimes.Isha)
        ],
        en: [
            'Prayer Times - ' + currentCity,
            'Fajr: ' + formatTimeDisplay(prayerTimes.Fajr),
            'Dhuhr: ' + formatTimeDisplay(prayerTimes.Dhuhr),
            'Asr: ' + formatTimeDisplay(prayerTimes.Asr),
            'Maghrib: ' + formatTimeDisplay(prayerTimes.Maghrib),
            'Isha: ' + formatTimeDisplay(prayerTimes.Isha)
        ]
    };
    return encodeURIComponent(lines[lang].join('\n'));
}

const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

document.addEventListener('DOMContentLoaded', () => {
    fetchPrayerTimes();
    displayDailyHadith();

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

    document.getElementById('theme-btn').addEventListener('click', () => {
        isDark = !isDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    });

    document.getElementById('share-whatsapp').addEventListener('click', () => {
        if (!prayerTimes) return;
        window.open('https://wa.me/?text=' + getShareText(), '_blank');
    });

    document.getElementById('share-twitter').addEventListener('click', () => {
        if (!prayerTimes) return;
        var text = getShareText();
        window.open('https://twitter.com/intent/tweet?text=' + text, '_blank');
    });

    var locationInput = document.getElementById('location-input');
    var locationGoBtn = document.getElementById('location-go-btn');

    locationGoBtn.addEventListener('click', () => {
        var city = locationInput.value.trim();
        if (city) fetchPrayerTimes(city, currentCountry);
    });

    locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            var city = locationInput.value.trim();
            if (city) fetchPrayerTimes(city, currentCountry);
        }
    });
});
