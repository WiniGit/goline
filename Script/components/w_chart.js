function createChartHTML(item) {
    item.value = createChart(item);
}

function createChart(item) {
    let chart = item.value?.id ? item.value : document.createElement("div");
    $(chart).addClass("w-chart");
    let chartCanvas = document.createElement("canvas");
    let labelStyle = item.StyleItem.TextStyleItem;
    const config = {
        type: item.JsonItem.Type,
        data: item.ChartData,
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: ChartType.axes_chart.some(chartType => chartType === item.JsonItem.Type) ? {
                x: {
                    ticks: {
                        color: `#${labelStyle.ColorValue.substring(2)}${labelStyle.ColorValue.substring(0, 2)}`,
                        font: {
                            size: labelStyle.FontSize,
                            weight: labelStyle.FontWeight,
                            family: labelStyle.FontFamily
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: item.JsonItem.MaxValue,
                    ticks: {
                        stepSize: item.JsonItem.StepSize,
                        color: `#${labelStyle.ColorValue.substring(2)}${labelStyle.ColorValue.substring(0, 2)}`,
                        font: {
                            size: labelStyle.FontSize,
                            weight: labelStyle.FontWeight,
                            family: labelStyle.FontFamily
                        }
                    }
                }
            } : null
        },
    };
    if (item.build) {
        chart.setAttribute("config", JSON.stringify(config));
    } else {
        new Chart(chartCanvas, config);
    }
    chart.replaceChildren(chartCanvas);
    return chart;
}