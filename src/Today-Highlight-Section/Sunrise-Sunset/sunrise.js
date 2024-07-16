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

// Example: Set sunrise to 6:00 AM, sunset to 6:00 PM, and current time to 5:01 AM
updateSunDial("2024-07-16T06:00:00", "2024-07-16T18:00:00", "2024-07-16T05:01:00");