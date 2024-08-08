let myChart;

function toggleAside() {
    const aside = document.getElementById('sidebar');
    aside.classList.toggle('aside-visible');
}

function insertSymbol(symbol) {
    const input = document.getElementById('func_str');
    input.value += symbol;
}

function clearInput() {
    const input = document.getElementById('func_str');
    input.value = '';
}

document.getElementById('normalize_linear').addEventListener('change', function () {
    const normalizeMin = document.getElementById('normalize_min');
    const normalizeMax = document.getElementById('normalize_max');
    normalizeMin.disabled = !this.checked;
    normalizeMax.disabled = !this.checked;
});

document.getElementById('steady_state_without_duplicates').addEventListener('change', function () {
    const gap = document.getElementById('gap');
    gap.disabled = !this.checked;
});

document.getElementById('experimentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const funcStr = document.getElementById('func_str').value;
    const numExperiments = document.getElementById('num_experiments').value;
    const numGenerations = document.getElementById('num_generations').value;
    const populationSize = document.getElementById('population_size').value;
    const crossoverRate = document.getElementById('crossover_rate').value;
    const mutationRate = document.getElementById('mutation_rate').value;
    const maximize = document.querySelector('input[name="objective"]:checked').value === 'true';
    const intervalMin = document.getElementById('interval_min').value;
    const intervalMax = document.getElementById('interval_max').value;
    const crossoverType = document.querySelector('input[name="crossover_type"]:checked').value;
    const normalizeLinear = document.getElementById('normalize_linear').checked;
    const normalizeMin = document.getElementById('normalize_min').value;
    const normalizeMax = document.getElementById('normalize_max').value;
    const elitism = document.getElementById('elitism').checked;
    const steadyState = document.getElementById('steady_state').checked;
    const steadyStateWithoutDuplicates = document.getElementById('steady_state_without_duplicates').checked;
    const gap = document.getElementById('gap').value;

    const requestBody = {
        num_generations: parseInt(numGenerations),
        population_size: parseInt(populationSize),
        crossover_rate: parseFloat(crossoverRate),
        mutation_rate: parseFloat(mutationRate),
        maximize: maximize,
        interval: [parseFloat(intervalMin), parseFloat(intervalMax)],
        crossover_type: {
            one_point: crossoverType === 'one_point',
            two_point: crossoverType === 'two_point',
            uniform: crossoverType === 'uniform'
        },
        normalize_linear: normalizeLinear,
        normalize_min: parseFloat(normalizeMin),
        normalize_max: parseFloat(normalizeMax),
        elitism: elitism,
        steady_state: steadyState,
        steady_state_without_duplicates: steadyStateWithoutDuplicates,
        gap: parseInt(gap)
    };

    const apiUrl = `http://127.0.0.1:8000/run-experiments?func_str=${encodeURIComponent(funcStr)}&num_experiments=${numExperiments}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const meanBestIndividuals = data.mean_best_individuals_per_generation;
    const numGenerationsValue = requestBody.num_generations;

    renderChart(meanBestIndividuals, numGenerationsValue);
});

function renderChart(data, numGenerations) {
    const labels = Array.from({ length: numGenerations }, (_, i) => i + 1);

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mean Best Fitness per Generation',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: '#67A5C8',
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
