// Shared result-display helpers, styled to match Modules/Input.
// Import what you need per calculator.

function fmtNumber(value, decimals = 0) {
    if (!isFinite(value)) return "—";
    return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export function fmtCurrency(value, decimals = 0) {
    if (!isFinite(value)) return "—";
    const sign = value < 0 ? "-" : "";
    return `${sign}$${fmtNumber(Math.abs(value), decimals)}`;
}

export function fmtPercent(value, decimals = 1) {
    if (!isFinite(value)) return "—";
    return `${fmtNumber(value, decimals)}%`;
}

export { fmtNumber };

/**
 * Big headline result card — the "answer" of the calculator.
 * resultHero(parent, "Your monthly payment", "$1,432", "Principal & interest")
 */
export function resultHero(parentelement, label, value, sublabel = "") {
    const card = document.createElement("div");
    card.className = "result-hero";
    card.innerHTML = `
        <p class="result-hero-label">${label}</p>
        <p class="result-hero-value">${value}</p>
        ${sublabel ? `<p class="result-hero-sublabel">${sublabel}</p>` : ""}
    `;
    parentelement.appendChild(card);
    return card;
}

/**
 * Small labeled stat block. Use several side by side inside a resultGrid.
 */
export function resultStat(parentelement, label, value) {
    const stat = document.createElement("div");
    stat.className = "result-stat";
    stat.innerHTML = `
        <p class="result-stat-label">${label}</p>
        <p class="result-stat-value">${value}</p>
    `;
    parentelement.appendChild(stat);
    return stat;
}

/**
 * Row container for resultStat children (flex-wrapped grid).
 */
export function resultGrid(parentelement) {
    const grid = document.createElement("div");
    grid.className = "result-grid";
    parentelement.appendChild(grid);
    return grid;
}

/**
 * A single label/value line item, e.g. inside a breakdown card.
 */
export function resultRow(parentelement, label, value, emphasis = false) {
    const row = document.createElement("div");
    row.className = "result-row" + (emphasis ? " result-row-emphasis" : "");
    row.innerHTML = `
        <span class="result-row-label">${label}</span>
        <span class="result-row-value">${value}</span>
    `;
    parentelement.appendChild(row);
    return row;
}

/**
 * Wraps resultRow children in a bordered card.
 */
export function resultCard(parentelement, title = "") {
    const card = document.createElement("div");
    card.className = "result-card";
    if (title) {
        const heading = document.createElement("p");
        heading.className = "result-card-title";
        heading.textContent = title;
        card.appendChild(heading);
    }
    parentelement.appendChild(card);
    return card;
}

/**
 * Scrollable data table. headers: string[]; rows: string[][]
 */
export function resultTable(parentelement, headers, rows, options = {}) {
    const wrap = document.createElement("div");
    wrap.className = "result-table-wrap";

    const table = document.createElement("table");
    table.className = "result-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headers.forEach((h) => {
        const th = document.createElement("th");
        th.textContent = h;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((r, i) => {
        const tr = document.createElement("tr");
        if (options.highlightRow && options.highlightRow(i, r)) {
            tr.className = "result-table-highlight";
        }
        r.forEach((cell) => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrap.appendChild(table);
    parentelement.appendChild(wrap);
    return wrap;
}

/**
 * Dependency-free SVG multi-series line chart.
 * series: [{ name, color, points: [{x, y}, ...] }]
 * options: { width, height, yPrefix, yFormatter, xFormatter }
 */
export function lineChart(parentelement, series, options = {}) {
    const width = options.width || 640;
    const height = options.height || 280;
    const padding = { top: 16, right: 16, bottom: 32, left: 64 };

    const allPoints = series.flatMap((s) => s.points);
    const xs = allPoints.map((p) => p.x);
    const ys = allPoints.map((p) => p.y);
    let minX = Math.min(...xs), maxX = Math.max(...xs);
    let minY = Math.min(0, ...ys), maxY = Math.max(...ys);
    if (minX === maxX) maxX = minX + 1;
    if (minY === maxY) maxY = minY + 1;

    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const sx = (x) => padding.left + ((x - minX) / (maxX - minX)) * innerW;
    const sy = (y) => padding.top + innerH - ((y - minY) / (maxY - minY)) * innerH;

    const yFormatter = options.yFormatter || ((v) => fmtCurrency(v));
    const xFormatter = options.xFormatter || ((v) => `${Math.round(v)}`);

    const gridLines = 4;
    let gridSvg = "";
    let gridLabels = "";
    for (let i = 0; i <= gridLines; i++) {
        const yVal = minY + ((maxY - minY) * i) / gridLines;
        const yPos = sy(yVal);
        gridSvg += `<line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" class="chart-gridline" />`;
        gridLabels += `<text x="${padding.left - 8}" y="${yPos + 4}" class="chart-axis-label" text-anchor="end">${yFormatter(yVal)}</text>`;
    }

    const xTicks = Math.min(6, allPoints.length);
    let xLabels = "";
    for (let i = 0; i <= xTicks; i++) {
        const xVal = minX + ((maxX - minX) * i) / xTicks;
        xLabels += `<text x="${sx(xVal)}" y="${height - padding.bottom + 20}" class="chart-axis-label" text-anchor="middle">${xFormatter(xVal)}</text>`;
    }

    let seriesSvg = "";
    let legendSvg = "";
    series.forEach((s, i) => {
        const color = s.color || (i === 0 ? "var(--accent)" : "var(--muted)");
        const path = s.points
            .map((p, idx) => `${idx === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`)
            .join(" ");
        const areaPath =
            i === 0
                ? `${path} L${sx(s.points[s.points.length - 1].x)},${sy(minY)} L${sx(s.points[0].x)},${sy(minY)} Z`
                : "";
        if (areaPath) {
            seriesSvg += `<path d="${areaPath}" fill="${color}" fill-opacity="0.08" stroke="none" />`;
        }
        seriesSvg += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />`;

        if (s.name) {
            legendSvg += `<span class="chart-legend-item"><span class="chart-legend-swatch" style="background:${color}"></span>${s.name}</span>`;
        }
    });

    const wrap = document.createElement("div");
    wrap.className = "result-chart";
    wrap.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
            ${gridSvg}
            ${gridLabels}
            ${xLabels}
            ${seriesSvg}
        </svg>
        ${legendSvg ? `<div class="chart-legend">${legendSvg}</div>` : ""}
    `;
    parentelement.appendChild(wrap);
    return wrap;
}

/**
 * Simple vertical bar chart for comparing a small number of categories.
 * bars: [{ label, value, color }]
 */
export function barChart(parentelement, bars, options = {}) {
    const width = options.width || 640;
    const height = options.height || 240;
    const padding = { top: 16, right: 16, bottom: 40, left: 64 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...bars.map((b) => b.value), 1);
    const yFormatter = options.yFormatter || ((v) => fmtCurrency(v));

    const gap = 24;
    const barWidth = (innerW - gap * (bars.length - 1)) / bars.length;

    let barsSvg = "";
    let labelsSvg = "";
    bars.forEach((b, i) => {
        const barHeight = (b.value / maxVal) * innerH;
        const x = padding.left + i * (barWidth + gap);
        const y = padding.top + innerH - barHeight;
        const color = b.color || "var(--accent)";
        barsSvg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${color}" />`;
        barsSvg += `<text x="${x + barWidth / 2}" y="${y - 8}" class="chart-axis-label" text-anchor="middle">${yFormatter(b.value)}</text>`;
        labelsSvg += `<text x="${x + barWidth / 2}" y="${height - padding.bottom + 20}" class="chart-axis-label" text-anchor="middle">${b.label}</text>`;
    });

    const wrap = document.createElement("div");
    wrap.className = "result-chart";
    wrap.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
            ${barsSvg}
            ${labelsSvg}
        </svg>
    `;
    parentelement.appendChild(wrap);
    return wrap;
}

/**
 * Short callout / note strip, e.g. warnings or takeaways.
 */
export function resultNote(parentelement, text, tone = "neutral") {
    const note = document.createElement("p");
    note.className = "result-note result-note-" + tone;
    note.textContent = text;
    parentelement.appendChild(note);
    return note;
}

export function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}
