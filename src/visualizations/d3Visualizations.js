// D3 Visualizations for Weather App

// UV Index Visualization
export function updateUVIndex(uvValue) {
    const svg = d3.select('.UV-Dial svg');
    
    // Update the gray background arc
    svg.select('.dial-line')
        .attr('d', 'M -130 0 A 130 130 0 0 1 130 0')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', '8')
        .attr('fill', 'none');

    // Calculate the angle based on UV value
    const angle = (uvValue / 12) * 180;
    
    // Create arc generator for the blue arc
    const arc = d3.arc()
        .innerRadius(122)
        .outerRadius(130)
        .startAngle(-Math.PI / 2)
        .endAngle((angle * Math.PI / 180) - Math.PI / 2);

    // Update the blue arc
    svg.select('.blue-arc')
        .attr('d', arc)
        .attr('fill', 'url(#gradient)');

    // Add UV value markers
    const markerGroup = svg.select('g');
    markerGroup.selectAll('.marker-group').remove();

    const markers = [0, 3, 6, 9, 12];
    markers.forEach(value => {
        const markerAngle = (value / 12) * 180 - 90;
        const x = 130 * Math.cos((markerAngle * Math.PI) / 180);
        const y = 130 * Math.sin((markerAngle * Math.PI) / 180);
        
        const markerG = markerGroup.append('g')
            .attr('class', 'marker-group');

        markerG.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 3)
            .attr('fill', value <= uvValue ? '#4CAF50' : '#ccc');

        markerG.append('text')
            .attr('x', x * 1.2)
            .attr('y', y * 1.2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '12px')
            .style('fill', value <= uvValue ? '#4CAF50' : '#ccc')
            .text(value);
    });
}

// Sunrise & Sunset Visualization
export function updateSunriseSunset(sunriseTime, sunsetTime) {
    const svg = d3.select('.sunrise-dial svg');
    
    // Update the gray background arc
    svg.select('.dial-line')
        .attr('d', 'M -130 0 A 130 130 0 0 1 130 0')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', '8')
        .attr('fill', 'none');

    // Convert times to minutes since midnight
    const getMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const sunriseMinutes = getMinutes(sunriseTime);
    const sunsetMinutes = getMinutes(sunsetTime);
    const dayLength = sunsetMinutes - sunriseMinutes;

    // Create arc for sun path
    const arc = d3.arc()
        .innerRadius(122)
        .outerRadius(130)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

    // Update the sun path
    svg.select('.sun-arc')
        .attr('d', arc)
        .attr('fill', 'url(#sun-gradient)');

    // Calculate current sun position
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const progress = Math.max(0, Math.min(1, (currentMinutes - sunriseMinutes) / dayLength));
    const sunAngle = -90 + (progress * 180);
    const sunX = 130 * Math.cos((sunAngle * Math.PI) / 180);
    const sunY = 130 * Math.sin((sunAngle * Math.PI) / 180);

    // Update sun position
    svg.select('.sun-icon')
        .attr('cx', sunX)
        .attr('cy', sunY)
        .attr('r', 6)
        .attr('fill', '#FFD700')
        .attr('filter', 'url(#sun-shadow)');
}

// Wind Status Visualization
export function updateWindStatus(windSpeed, windDirection) {
    // Clear existing content
    const container = d3.select('.wind-status .graph').html('');
    
    // Create new SVG (semi-circle, UV-index style)
    const svg = container.append('svg')
        .attr('viewBox', '0 0 300 120')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('width', '100%')
        .style('height', '100%')
        .style('display', 'block');

    const centerX = 150;
    const centerY = 150;
    const radius = 130;

    // Draw the gray background arc (semi-circle)
    svg.append('path')
        .attr('d', d3.arc()
            .innerRadius(radius - 8)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2)
        )
        .attr('transform', `translate(${centerX},${centerY})`)
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', 0)
        .attr('fill', 'rgba(255,255,255,0.08)');

    // Convert wind direction to angle (semi-circle)
    const directionToAngle = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 90, 'SE': 90, 'SSE': 90, // Clamp to edge
        'S': 90, 'SSW': 90, 'SW': -90, 'WSW': -90,
        'W': -90, 'WNW': -45, 'NW': -45, 'NNW': -22.5
    };
    let angle = directionToAngle[windDirection] ?? 0;
    angle = Math.max(-90, Math.min(90, angle));

    // Draw colored arc for wind direction (like UV index blue arc)
    svg.append('path')
        .attr('d', d3.arc()
            .innerRadius(radius - 8)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle((angle * Math.PI / 180))
        )
        .attr('transform', `translate(${centerX},${centerY})`)
        .attr('fill', 'url(#wind-gradient)');

    // Add gradient definition for wind arc
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'wind-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#4CAF50');
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#2196F3');

    // Draw indicator/arrow at the end of the arc
    const indicatorRadius = radius - 4;
    const indicatorAngle = (angle - 90) * Math.PI / 180;
    const indicatorX = centerX + indicatorRadius * Math.cos(indicatorAngle);
    const indicatorY = centerY + indicatorRadius * Math.sin(indicatorAngle);
    svg.append('circle')
        .attr('cx', indicatorX)
        .attr('cy', indicatorY)
        .attr('r', 7)
        .attr('fill', '#4CAF50')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('filter', 'drop-shadow(0 2px 4px rgba(76,175,80,0.3))');

    // Optionally, add the wind direction text below the arc (centered)
    svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY - radius + 30)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '22px')
        .style('fill', '#fff')
        .style('opacity', 0.7)
        .text(windDirection);
} 