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

    document.querySelector('.sun-arc').setAttribute('d', arc);
    document.querySelector('.sun-icon').setAttribute('cx', x);
    document.querySelector('.sun-icon').setAttribute('cy', y);

    const currentHour = new Date(currentTime).getHours();
    const currentMinutes = new Date(currentTime).getMinutes();
    document.querySelector('.time-value').textContent = `${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;
}

// Example: Set sunrise to 6:00 AM, sunset to 6:00 PM, and current time to 9:30 AM
updateSunDial("2024-07-16T06:00:00", "2024-07-16T18:00:00", "2024-07-16T09:30:00");