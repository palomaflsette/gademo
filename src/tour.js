// ========== GADEMO TOUR COMPLETE ========== //

function startTour() {
  localStorage.removeItem('gademoTourCompleted');
  location.reload();
}

if (typeof gademoTour === 'undefined') {
  var gademoTour;
}

// Função auxiliar para controlar a sidebar na tour
function tourToggleSidebar(open = true) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const body = document.body;
  
  if (!sidebar || !overlay) {
    console.warn('Tour: Sidebar elements not found');
    return false;
  }
  
  if (open) {
    console.log('Tour: Opening sidebar...');
    sidebar.classList.add('aside-visible');
    overlay.style.display = 'block';
    setTimeout(() => {
      overlay.classList.add('visible');
    }, 10);
    body.classList.add('sidebar-open');
  } else {
    console.log('Tour: Closing sidebar...');
    sidebar.classList.remove('aside-visible');
    overlay.classList.remove('visible');
    body.classList.remove('sidebar-open');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }
  return true;
}

function startGademoTour(forceRestart = false) {
  if (!forceRestart && localStorage.getItem('gademoTourCompleted')) return;

  // Aguarda o DOM estar completamente carregado
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => startGademoTour(forceRestart));
    return;
  }

  // Elementos da interface
  const runButton = document.getElementById('runExperimentButton');
  const spinner = document.getElementById('spinner');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // Verifica se os elementos essenciais existem
  if (!runButton || !sidebar || !overlay) {
    console.warn('GADemo Tour: Essential elements not found, retrying in 1 second...');
    setTimeout(() => startGademoTour(forceRestart), 1000);
    return;
  }

  // Inicializa a tour
  gademoTour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      scrollTo: { behavior: 'smooth', block: 'center' },
      classes: 'shepherd-theme-arrows',
      modalOverlayOpeningPadding: 8,
    }
  });

  // ========== STEP 1: WELCOME ========== //
  gademoTour.addStep({
    id: 'welcome',
    text: `
      <div style="text-align: center;">
        <h3>👋 Welcome to GADemo Platform!</h3>
        <p>Let me show you the main features of this Genetic Algorithm demonstration tool.</p>
        <p><strong>This tour will run a demo experiment automatically.</strong></p>
        <br>
        <p>Ready to explore? 🚀</p>
      </div>
    `,
    buttons: [
      { 
        text: 'Skip Tour', 
        action: () => {
          localStorage.setItem('gademoTourCompleted', 'true');
          gademoTour.cancel();
        }, 
        classes: 'shepherd-button-secondary' 
      },
      { 
        text: 'Start Tour', 
        action: gademoTour.next, 
        classes: 'shepherd-button-primary' 
      }
    ]
  });

  // ========== STEP 2: FUNCTION INPUT ========== //
  gademoTour.addStep({
    id: 'function-input',
    text: `
      <div>
        <h4>📝 Function Input</h4>
        <p>In this field, you enter the mathematical function to be optimized by the genetic algorithm.</p>
        <p>You can use the virtual keyboard below or your physical keyboard.</p>
        <p><em>Example: sin(x^2 + y^2) or any mathematical expression with variables x and y.</em></p>
      </div>
    `,
    attachTo: { element: '#func_str', on: 'bottom' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 3: VIRTUAL KEYBOARD ========== //
  gademoTour.addStep({
    id: 'virtual-keyboard',
    text: `
      <div>
        <h4>🔢 Virtual Keyboard</h4>
        <p>Use these buttons to insert mathematical symbols and functions into your expression.</p>
        <p>The keyboard includes:</p>
        <ul style="text-align: left; margin: 10px 0;">
          <li><strong>Functions:</strong> sin, cos, tan, log, sqrt</li>
          <li><strong>Operators:</strong> +, -, *, /, ^</li>
          <li><strong>Constants:</strong> π (pi), e</li>
          <li><strong>Numbers:</strong> 0-9</li>
        </ul>
      </div>
    `,
    attachTo: { element: '.math-keyboard-symbols', on: 'bottom' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 4: OPEN SIDEBAR ========== //
  gademoTour.addStep({
    id: 'open-sidebar',
    text: `
      <div>
        <h4>⚙️ GA Configuration</h4>
        <p>Now let's open the sidebar to configure the genetic algorithm parameters!</p>
        <p>This is where you control how the algorithm behaves.</p>
      </div>
    `,
    attachTo: { element: '.toggle-button', on: 'right' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      {
        text: 'Open Sidebar',
        action: function () {
          // Tenta usar a função toggleAside() se existir, senão usa a função auxiliar
          if (typeof toggleAside === 'function') {
            try {
              toggleAside();
            } catch (e) {
              console.warn('toggleAside failed, using fallback');
              tourToggleSidebar(true);
            }
          } else {
            tourToggleSidebar(true);
          }
          
          // Aguarda a animação e verifica se abriu
          setTimeout(() => {
            const sidebarOpen = sidebar.classList.contains('aside-visible');
            if (!sidebarOpen) {
              console.warn('Sidebar did not open, forcing...');
              tourToggleSidebar(true);
            }
            setTimeout(() => gademoTour.next(), 300);
          }, 800);
        },
        classes: 'shepherd-button-primary'
      }
    ]
  });

  // ========== STEP 5: SIDEBAR OVERVIEW ========== //
  gademoTour.addStep({
    id: 'sidebar-overview',
    text: `
      <div>
        <h4>📊 Configuration Panel</h4>
        <p>This sidebar contains all the genetic algorithm parameters:</p>
        <ul style="text-align: left; margin: 10px 0;">
          <li><strong>Basic Parameters:</strong> Population size, generations, mutation rates</li>
          <li><strong>Objective:</strong> Choose to maximize or minimize the function</li>
          <li><strong>Search Range:</strong> Define the search space boundaries</li>
          <li><strong>Advanced Options:</strong> Crossover types, elitism, normalization</li>
        </ul>
        <p>Each parameter affects how the algorithm explores the solution space!</p>
      </div>
    `,
    attachTo: { element: '#sidebar', on: 'right' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      {
        text: 'Next',
        action: () => {
          // Fecha a sidebar
          if (typeof toggleAside === 'function') {
            try {
              toggleAside();
            } catch (e) {
              console.warn('toggleAside failed, using fallback');
              tourToggleSidebar(false);
            }
          } else {
            tourToggleSidebar(false);
          }
          setTimeout(() => gademoTour.next(), 500);
        },
        classes: 'shepherd-button-primary'
      }
    ]
  });

  // ========== STEP 6: RUN BUTTON ========== //
  gademoTour.addStep({
    id: 'run-button',
    text: `
      <div>
        <h4>🚀 Run Experiment</h4>
        <p>After configuring the parameters, click the <strong>Run</strong> button to start the genetic algorithm.</p>
        <p><strong>Important concepts:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>Each click generates a new <strong>Round</strong></li>
          <li>Each Round contains multiple <strong>Experiments</strong></li>
          <li>Each Experiment runs for the specified number of <strong>Generations</strong></li>
        </ul>
        <p>Let's run a demo now! ⚡</p>
      </div>
    `,
    attachTo: { element: '#runExperimentButton', on: 'left' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      {
        text: 'Run Demo',
        action: function () {
          // Simula o clique no botão Run
          console.log('Tour: Starting demo experiment...');
          runButton.click();

          // Aguarda os gráficos carregarem com timeout de segurança
          let attempts = 0;
          const maxAttempts = 30; // 15 segundos máximo
          
          const waitForCharts = setInterval(() => {
            attempts++;
            
            const lineChart = document.getElementById('myChart');
            const boxPlotChart = document.getElementById('box-plot-chart');
            const resultsTable = document.getElementById('best-values-table');
            const spinnerHidden = !spinner || spinner.style.display === 'none';
            
            const chartsReady = 
              lineChart?.offsetHeight > 0 &&
              boxPlotChart?.offsetHeight > 0 &&
              resultsTable?.rows?.length > 2 &&
              spinnerHidden;

            if (chartsReady || attempts >= maxAttempts) {
              clearInterval(waitForCharts);
              if (chartsReady) {
                console.log('Tour: Charts loaded successfully');
                setTimeout(() => gademoTour.next(), 1000);
              } else {
                console.warn('Tour: Charts loading timeout, continuing anyway');
                gademoTour.next();
              }
            }
          }, 500);
        },
        classes: 'shepherd-button-primary'
      }
    ]
  });

  // ========== STEP 7: MAIN CHART ========== //
  gademoTour.addStep({
    id: 'main-chart',
    text: `
      <div>
        <h4>📈 Evolution Chart</h4>
        <p>This chart shows the <strong>average best fitness per generation</strong> across all experiments in the current round.</p>
        <p><strong>Key features:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>X-axis: Generation number</li>
          <li>Y-axis: Function value (fitness)</li>
          <li>Line: Average of best individuals from all experiments</li>
        </ul>
        <p>💡 Enable <strong>'Keep Graph'</strong> to accumulate results from multiple rounds!</p>
      </div>
    `,
    attachTo: { element: '#chart-line-container', on: 'top' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 8: RESULTS TABLE ========== //
  gademoTour.addStep({
    id: 'results-table',
    text: `
      <div>
        <h4>📋 Results Table</h4>
        <p>Here are the detailed numerical results for each experiment and generation.</p>
        <p><strong>Table structure:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li><strong>Rows:</strong> Each generation (gen 1, gen 2, ...)</li>
          <li><strong>Columns:</strong> Each experiment (1st, 2nd, 3rd, ...)</li>
          <li><strong>Average column:</strong> Values plotted in the chart above</li>
        </ul>
        <p>This gives you precise numerical data behind the visualizations!</p>
      </div>
    `,
    attachTo: { element: '#results-container', on: 'left' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 9: EXPORT BUTTON ========== //
  gademoTour.addStep({
    id: 'export-button',
    text: `
      <div>
        <h4>📊 Export Results</h4>
        <p>Click here to download the current round's results in XLSX format.</p>
        <p><strong>The export includes:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>Complete results table with all experiments</li>
          <li>Used parameters and configuration</li>
          <li>Execution time and metadata</li>
          <li>Timestamp for easy organization</li>
        </ul>
        <p>Perfect for further analysis in Excel or other tools! 📈</p>
      </div>
    `,
    attachTo: { element: '#button-export-results', on: 'bottom' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 10: NAVIGATION BUTTONS ========== //
  gademoTour.addStep({
    id: 'navigation-buttons',
    text: `
      <div>
        <h4>◀️ ▶️ Round Navigation</h4>
        <p>If you keep results from multiple rounds (using <strong>'Keep Graph'</strong>), you can navigate between them using these buttons.</p>
        <p><strong>How it works:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>Each round is stored separately</li>
          <li>Navigate between Round 1, Round 2, etc.</li>
          <li>View different experiments and parameters</li>
        </ul>
        <p>⚠️ <strong>Warning:</strong> If 'Keep Graph' is unchecked, previous results are lost when running new rounds!</p>
      </div>
    `,
    attachTo: { element: '#buttons-next-prev', on: 'top' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 11: EXECUTION STATUS ========== //
  gademoTour.addStep({
    id: 'execution-status',
    text: `
      <div>
        <h4>💻 Execution Details</h4>
        <p>This panel shows detailed information for each experiment:</p>
        <ul style="text-align: left; margin: 10px 0;">
          <li><strong>Best solution found:</strong> The optimal function value</li>
          <li><strong>Best individuals:</strong> The (x,y) coordinates per generation</li>
          <li><strong>Evolution tracking:</strong> How solutions improved over time</li>
        </ul>
        <p>This is where you can see the actual coordinate values that produced the best results!</p>
      </div>
    `,
    attachTo: { element: '#execution-results-container', on: 'left' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 12: BOX PLOT ========== //
  gademoTour.addStep({
    id: 'box-plot-chart',
    text: `
      <div>
        <h4>📦 Distribution Analysis</h4>
        <p>This box plot shows the <strong>distribution of best fitness values per generation</strong> across all experiments.</p>
        <p><strong>What you can see:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li><strong>Median:</strong> Middle line in each box</li>
          <li><strong>Quartiles:</strong> Box boundaries (25% and 75%)</li>
          <li><strong>Outliers:</strong> Points outside the whiskers</li>
          <li><strong>Variability:</strong> How consistent the algorithm is</li>
        </ul>
        <p>Great for understanding the algorithm's reliability and consistency!</p>
      </div>
    `,
    attachTo: { element: '#box-plot-container', on: 'top' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 13: INDIVIDUAL EXPERIMENT CHARTS ========== //
  gademoTour.addStep({
    id: 'experiment-charts',
    text: `
      <div>
        <h4>🔬 Individual Experiment Analysis</h4>
        <p>For each experiment in the last round, you can see detailed charts:</p>
        <ul style="text-align: left; margin: 10px 0;">
          <li><strong>Evolution chart (top):</strong> Best fitness per generation for this specific experiment</li>
          <li><strong>Population histogram (bottom):</strong> Fitness distribution of all individuals in the final generation</li>
        </ul>
        <p>This lets you analyze how each individual experiment performed and see the diversity of solutions found!</p>
      </div>
    `,
    attachTo: { element: '.chart-container', on: 'top' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 14: EXPERIMENT NAVIGATION ========== //
  gademoTour.addStep({
    id: 'experiment-navigation',
    text: `
      <div>
        <h4>🔄 Experiment Navigation</h4>
        <p>Use these navigation buttons to explore the detailed results of each individual experiment from the current round.</p>
        <p><strong>Why this matters:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>Each experiment may find different solutions</li>
          <li>Some may converge faster than others</li>
          <li>Compare evolution patterns between experiments</li>
          <li>Understand algorithm variability</li>
        </ul>
        <p>Try clicking the arrows to see different experiments!</p>
      </div>
    `,
    attachTo: { element: '.carousel-nav', on: 'top' },
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  // ========== STEP 15: FINAL STEP ========== //
  gademoTour.addStep({
    id: 'tour-complete',
    text: `
      <div style="text-align: center;">
        <h3>🎉 Congratulations!</h3>
        <p>You've completed the GADemo Platform tour!</p>
        <br>
        <p><strong>Quick Workflow Summary:</strong></p>
        <ol style="text-align: left; margin: 15px 0; max-width: 300px; margin-left: auto; margin-right: auto;">
          <li>📝 Enter your function to optimize</li>
          <li>⚙️ Configure GA parameters in the sidebar</li>
          <li>🚀 Click Run to generate experiments</li>
          <li>📈 Analyze results in charts and tables</li>
          <li>📊 Export data for further analysis</li>
          <li>🔄 Compare multiple rounds if needed</li>
        </ol>
        <br>
        <p><strong>Pro Tips:</strong></p>
        <ul style="text-align: left; margin: 15px 0; max-width: 300px; margin-left: auto; margin-right: auto;">
          <li>Use 'Keep Graph' to compare rounds</li>
          <li>Try different parameter combinations</li>
          <li>Export results for deeper analysis</li>
          <li>Check individual experiments for insights</li>
        </ul>
        <br>
        <p>Happy optimizing! 🚀✨</p>
      </div>
    `,
    buttons: [
      { text: 'Previous', action: gademoTour.back, classes: 'shepherd-button-secondary' },
      { 
        text: 'Finish Tour', 
        action: () => {
          localStorage.setItem('gademoTourCompleted', 'true');
          gademoTour.complete();
        }, 
        classes: 'shepherd-button-primary' 
      }
    ]
  });

  // ========== EVENT LISTENERS ========== //
  
  // Tour completed
  gademoTour.on('complete', () => {
    localStorage.setItem('gademoTourCompleted', 'true');
    console.log('GADemo Tour completed successfully!');
  });

  // Tour cancelled
  gademoTour.on('cancel', () => {
    // Fecha sidebar se estiver aberta
    if (sidebar.classList.contains('aside-visible')) {
      tourToggleSidebar(false);
    }
    localStorage.setItem('gademoTourCompleted', 'true');
    console.log('GADemo Tour cancelled by user');
  });

  // Error handling para steps
  gademoTour.on('show', (step) => {
    const stepElement = step.options?.attachTo?.element;
    if (stepElement && !document.querySelector(stepElement)) {
      console.warn(`Tour step "${step.id}" element not found: ${stepElement}`);
      // Continua para o próximo step se o elemento não existir
      setTimeout(() => {
        if (gademoTour.getCurrentStep()?.id === step.id) {
          gademoTour.next();
        }
      }, 1000);
    }
  });

  // Debug: Log step changes
  gademoTour.on('show', (step) => {
    console.log(`Tour: Showing step "${step.id}"`);
  });

  // Inicia a tour
  console.log('Starting GADemo Tour...');
  gademoTour.start();
}