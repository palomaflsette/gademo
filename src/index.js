let myChart, boxPlotChart;
let previousResults = [];  // Armazena os resultados anteriores
let currentRunIndex = 0;   // Índice para a rodada atual


function toggleAside() {
    const aside = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');

    if (aside.classList.contains('aside-visible')) {
        aside.classList.remove('aside-visible');
        header.style.marginLeft = '0';
        main.style.marginLeft = '0';
        footer.style.marginLeft = '0';
    } else {
        aside.classList.add('aside-visible');
        header.style.marginLeft = '250px';
        main.style.marginLeft = '250px';
        footer.style.marginLeft = '250px';
    }
}

// Adicionando as funções showSpinner e hideSpinner
function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

// Função para armazenar novos resultados
function storeResults(runData) {
    const keepChart = document.getElementById('keep_chart').checked;

    // Se "Keep Graph" NÃO estiver marcado, reinicia os resultados
    if (!keepChart) {
        previousResults = [];  // Limpa os resultados anteriores
        currentRunIndex = 0;   // Reinicia o índice
    }

    previousResults.push(runData);
    currentRunIndex = previousResults.length - 1;
    updateTableNavigationButtons();
    updateTableTitle(); // Atualiza o título com a rodada correta
    updateUsedParametersDescription(runData.params, runData.numOfExperiments); // Atualiza os parâmetros
}

// Função para atualizar o estado dos botões de navegação
function updateTableNavigationButtons() {
    document.getElementById('prev-run').disabled = currentRunIndex === 0;
    document.getElementById('next-run').disabled = currentRunIndex === previousResults.length - 1;
}

// Função para atualizar o título com o número da rodada atual
function updateTableTitle() {
    const titleElement = document.getElementById('table-title');
    titleElement.innerText = `Best Fitness Per Generation & Experiments (Run ${currentRunIndex + 1})`; // +1 para exibir como 1-based
}

// Listeners para os botões de navegação
document.getElementById('prev-run').addEventListener('click', function() {
    if (currentRunIndex > 0) {
        currentRunIndex--;  // Decrementa o índice da rodada atual
        renderBestValuesTableForCurrentRun();  // Renderiza a tabela para a rodada atual
        updateTableNavigationButtons();  // Atualiza os botões para habilitar/desabilitar
        updateTableTitle();  // Atualiza o título com o número da rodada
        updateUsedParametersDescription(previousResults[currentRunIndex].params, previousResults[currentRunIndex].numOfExperiments); // Atualiza os parâmetros
    }
});

document.getElementById('next-run').addEventListener('click', function() {
    if (currentRunIndex < previousResults.length - 1) {
        currentRunIndex++;  // Incrementa o índice da rodada atual
        renderBestValuesTableForCurrentRun();  // Renderiza a tabela para a rodada atual
        updateTableNavigationButtons();  // Atualiza os botões para habilitar/desabilitar
        updateTableTitle();  // Atualiza o título com o número da rodada
        updateUsedParametersDescription(previousResults[currentRunIndex].params, previousResults[currentRunIndex].numOfExperiments); // Atualiza os parâmetros
    }
});

// Função para renderizar a tabela para a rodada atual
function renderBestValuesTableForCurrentRun() {
    const runData = previousResults[currentRunIndex];
    renderBestValuesTable(runData.bestValuesPerGeneration, runData.meanBestIndividualsPerGeneration);
    updateTableTitle(); // Atualiza o título com o número da rodada
    updateUsedParametersDescription(runData.params, runData.numOfExperiments); // Atualiza os parâmetros
}

function updateUsedParametersDescription(params, numOfExp) {
    const textElement = document.getElementById("used-parameters");
    textElement.innerHTML = `
        <table id="used-parameters-table">
            <tr><td>Number of Experiments:</td><td>${numOfExp || 'N/A'}</td></tr>
            <tr><td>Number of Generations:</td><td>${params.num_generations || 'N/A'}</td></tr>
            <tr><td>Population Size:</td><td>${params.population_size || 'N/A'}</td></tr>
            <tr><td>Crossover Rate:</td><td>${params.crossover_rate || 'N/A'}</td></tr>
            <tr><td>Mutation Rate:</td><td>${params.mutation_rate || 'N/A'}</td></tr>
            <tr><td>Interval Min:</td><td>${params.interval ? params.interval[0] : 'N/A'}</td></tr>
            <tr><td>Interval Max:</td><td>${params.interval ? params.interval[1] : 'N/A'}</td></tr>
            <tr><td>Crossover Type:</td><td>${params.crossover_type ? (params.crossover_type.one_point ? 'One Point' : params.crossover_type.two_point ? 'Two Point' : 'Uniform') : 'N/A'}</td></tr>
            <tr><td>Normalize Linear:</td><td>${params.normalize_linear ? 'Yes' : 'No'}</td></tr>
            <tr><td>Elitism:</td><td>${params.elitism ? 'Yes' : 'No'}</td></tr>
            <tr><td>Steady State:</td><td>${params.steady_state ? 'Yes' : 'No'}</td></tr>
            <tr><td>Steady State Without Duplicates:</td><td>${params.steady_state_without_duplicates ? 'Yes' : 'No'}</td></tr>
        </table>
    `;
}

// Função de escuta para o envio do formulário
document.getElementById('experimentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    showSpinner();

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
        elitism: document.getElementById('elitism').checked,
        steady_state: document.getElementById('steady_state').checked,
        steady_state_without_duplicates: document.getElementById('steady_state_without_duplicates').checked
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/run-experiments?func_str=${encodeURIComponent(funcStr)}&num_experiments=${numExperiments}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const meanBestIndividuals = data.mean_best_individuals_per_generation;
        const bestValuesPerGeneration = data.best_values_per_generation;

        renderChart(meanBestIndividuals, requestBody.num_generations);

        // Salva os dados da rodada e renderiza a tabela
        storeResults({
            bestValuesPerGeneration: bestValuesPerGeneration,
            meanBestIndividualsPerGeneration: meanBestIndividuals,
            params: requestBody, // Armazenando parâmetros da execução
            numOfExperiments: numExperiments
        });
        renderBestValuesTableForCurrentRun();
        renderBoxPlot(meanBestIndividuals);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideSpinner();
    }
});

// Funções para renderizar o gráfico e tabela
function renderChart(data, numGenerations) {
    const labels = Array.from({ length: numGenerations }, (_, i) => i + 1);

    const keepChart = document.getElementById('keep_chart').checked;

    document.getElementById('download-chart').addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = myChart.toBase64Image();
        link.download = 'chart_image.png';  // Nome do arquivo baixado
        link.click();
    });

    if (!keepChart && myChart) {
        myChart.destroy();
    }

    if (keepChart && myChart) {
        const newDataset = {
            label: `Run ${myChart.data.datasets.length + 1}`,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            fill: false
        };
        myChart.data.datasets.push(newDataset);
        myChart.update();
    } else {
        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Run 1',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: '#67A5C8',
                    borderWidth: 3,
                    fill: false
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Mean Best Fitness per Generation',
                        font: {
                            size: 24,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Generation'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Function Value'
                        }
                    }
                }
            }
        });
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function renderBestValuesTable(bestValuesPerGeneration, meanBestIndividualsPerGeneration) {
    const table = document.getElementById('best-values-table');
    table.innerHTML = ''; // Limpa a tabela anterior

    const numExperiments = bestValuesPerGeneration.length;
    const numGenerations = bestValuesPerGeneration[0].length;

    // Cabeçalho com as colunas principais
    let headerRow = `
        <tr>
            <th rowspan="2">Generations</th>
            <th colspan="${numExperiments}">Experiments</th>
            <th rowspan="2">Average</th>
        </tr>
        <tr>`;

    // Subcabeçalhos das colunas de experimentos (1º, 2º, 3º, etc.)
    for (let i = 1; i <= numExperiments; i++) {
        headerRow += `<th>${i}º</th>`;
    }
    headerRow += '</tr>';

    // Adiciona a linha de cabeçalho ao conteúdo da tabela
    table.innerHTML += headerRow;

    // Adiciona as linhas dos dados
    for (let i = 0; i < numGenerations; i++) {
        let row = `<tr><td>gen ${i + 1}</td>`;
        for (let j = 0; j < numExperiments; j++) {
            row += `<td>${bestValuesPerGeneration[j][i].toFixed(4)}</td>`;
        }
        row += `<td><strong>${meanBestIndividualsPerGeneration[i].toFixed(4)}</strong></td></tr>`;
        table.innerHTML += row;
    }
}

function renderBoxPlot(data) {
    var trace = {
        y: data,
        type: 'box',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        marker: {
            color: 'red',
            size: 6
        },
        line: {
            width: 2
        },
        boxmean: true
    };

    var layout = {
        title: 'Box Plot for Fitness',
        yaxis: {
            title: 'Fitness Values',
            zeroline: true,
            gridcolor: 'light grey'
        },
        xaxis: {
            title: 'Fitness',
            zeroline: false
        },
        margin: {
            l: 50,
            r: 30,
            b: 50,
            t: 50
        },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        showlegend: false,
        autosize: true,
        responsive: true 
    };

    Plotly.newPlot('box-plot-chart', [trace], layout);
}
