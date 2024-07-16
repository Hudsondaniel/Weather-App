        // Example value (replace with your actual value)
        let value = 5.60;

        // Calculate angle for the blue arc based on the value
        const maxValue = 8; // Assuming the maximum value on the dial is 8
        const angle = value / maxValue * Math.PI; // Calculate the angle for the blue arc

        // Define arc generator for the blue arc
        const arcGenerator = d3.arc()
            .innerRadius(115) // Adjusted inner radius for the blue arc
            .outerRadius(135) // Adjusted outer radius for the blue arc
            .startAngle(-Math.PI / 2) // Starting angle (left side of semi-circle)
            .endAngle(-Math.PI / 2 + angle); // Ending angle based on the value

        // Select the blue arc path and update its d attribute
        d3.select(".blue-arc")
            .attr("d", arcGenerator);

        // Display the value in the center
        d3.select(".uv-value")
            .text(value.toFixed(2) + " uv");