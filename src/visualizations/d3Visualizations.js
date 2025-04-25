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
    
    // Create new SVG
    const svg = container.append('svg')
        .attr('viewBox', '-50 -50 100 100')
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const radius = 40;

    // Create compass rose
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionAngles = [0, 45, 90, 135, 180, 225, 270, 315];

    // Draw compass circle
    svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', 0.5);

    // Add direction labels
    directions.forEach((dir, i) => {
        const angle = (directionAngles[i] - 90) * Math.PI / 180;
        const x = (radius + 8) * Math.cos(angle);
        const y = (radius + 8) * Math.sin(angle);

        svg.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '8px')
            .style('fill', 'rgba(255, 255, 255, 0.5)')
            .text(dir);
    });

    // Convert wind direction to angle
    const directionToAngle = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };

    const angle = directionToAngle[windDirection] || 0;

    // Draw wind arrow
    const arrowLength = radius * (Math.min(windSpeed, 50) / 50);
    const arrowAngle = (angle - 90) * Math.PI / 180;
    const arrowX = arrowLength * Math.cos(arrowAngle);
    const arrowY = arrowLength * Math.sin(arrowAngle);

    // Arrow body
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', arrowX)
        .attr('y2', arrowY)
        .attr('stroke', '#4CAF50')
        .attr('stroke-width', 1);

    // Arrow head
    const headLength = 4;
    const headAngle = Math.PI / 6;
    const head1X = arrowX - headLength * Math.cos(arrowAngle - headAngle);
    const head1Y = arrowY - headLength * Math.sin(arrowAngle - headAngle);
    const head2X = arrowX - headLength * Math.cos(arrowAngle + headAngle);
    const head2Y = arrowY - headLength * Math.sin(arrowAngle + headAngle);

    svg.append('path')
        .attr('d', `M ${arrowX} ${arrowY} L ${head1X} ${head1Y} L ${head2X} ${head2Y} Z`)
        .attr('fill', '#4CAF50');
} 