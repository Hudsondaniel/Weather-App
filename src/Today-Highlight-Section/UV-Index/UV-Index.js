import currentWeather from "../../weather-Data/weatherData";

const apiKey = "a45efc5b41c54b5b8e6155635240606";

async function getUV() {
    try {
        const uvInfo = await currentWeather(apiKey);
        console.log("UV value is:");
        console.log(uvInfo.current.uv);
        return uvInfo.current.uv;

    } catch (error) {
        console.error("Error fetching UV info:", error);
        return null; // Return null in case of error
    }
}

async function blueArc() {
    let value = await getUV();
    
    if (value === null) {
        console.error("UV value is not available.");
        return;
    }

    // Calculate angle for the blue arc based on the value
    const maxValue = 3; // Assuming the maximum value on the dial is 8
    const angle = (value / maxValue) * Math.PI; // Calculate the angle for the blue arc

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
        .text(value.toFixed(2) + " UV");
}

blueArc(); // Call the function to fetch UV value and update the blue arc accordingly.
