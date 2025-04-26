function updateSunDial(sunrise, sunset, currentTime) {
    const startTime = new Date(sunrise).getTime();
    const endTime = new Date(sunset).getTime();
    const currentTimestamp = new Date(currentTime).getTime();

    const maxTime = endTime - startTime;
    const currentTimeProgress = currentTimestamp - startTime;

    const radius = 130;
    const angle = (Math.PI * currentTimeProgress) / maxTime;
    const x = radius * Math.cos(angle - Math.PI / 2);
    const y = radius * Math.sin(angle - Math.PI / 2);
    const arc = `M -130 0 A 130 130 0 ${currentTimeProgress > maxTime / 2 ? 1 : 0} 1 ${x} ${y}`;

    // Using D3.js to update the elements
    d3.select('.sun-arc').attr('d', arc);
    d3.select('.sun-icon').attr('cx', x).attr('cy', y);

    const currentHour = new Date(currentTime).getHours();
    const currentMinutes = new Date(currentTime).getMinutes();
    d3.select('.time-value').text(`${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`);
}

function getSunriseSunsetFromDOM() {
    const sunriseElem = document.querySelector('.sunrise-time');
    const sunsetElem = document.querySelector('.sunset-time');
    if (!sunriseElem || !sunsetElem) return null;
    return {
        sunrise: sunriseElem.textContent,
        sunset: sunsetElem.textContent
    };
}

function parseTimeToToday(timeStr) {
    // Handles '6:55 AM' or '18:43 PM' format, returns ISO string for today
    if (!timeStr) return null;
    const now = new Date();
    const [time, period] = timeStr.split(' ');
    if (!time || !period) return null;
    let [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return date.toISOString();
}

function updateSunDialRealTime() {
    const times = getSunriseSunsetFromDOM();
    if (!times) return;
    const sunriseISO = parseTimeToToday(times.sunrise);
    const sunsetISO = parseTimeToToday(times.sunset);
    const nowISO = new Date().toISOString();
    if (sunriseISO && sunsetISO) {
        updateSunDial(sunriseISO, sunsetISO, nowISO);
    }
}

// Initial call with real data if possible, else fallback to static example
updateSunDialRealTime();
setInterval(updateSunDialRealTime, 60000);