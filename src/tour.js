function startTour() {
  localStorage.removeItem('gademoTourCompleted');
  location.reload();
}

if (typeof gademoTour === 'undefined') {
  var gademoTour;
}

function startGademoTour(forceRestart = false) {
  if (!forceRestart && localStorage.getItem('gademoTourCompleted')) return;

  const runButton = document.getElementById('runExperimentButton');
  const spinner = document.getElementById('spinner');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  gademoTour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      scrollTo: { behavior: 'smooth', block: 'center' },
      classes: 'shepherd-theme-arrows',
      modalOverlayOpeningPadding: 8,
    }
  });

  gademoTour.addStep({
    id: 'Welcome',
    text: '👋 Welcome to  GADemo Platform!<br>Let me show you the main features.',
    buttons: [
      { text: 'Finish', action: gademoTour.cancel, classes: 'shepherd-button-secondary' },
      { text: 'Start Tour', action: gademoTour.next, classes: 'shepherd-button-primary' }
    ]
  });

  gademoTour.addStep({
    id: 'function-input',
    text: 'In this field, you insert the function to be optimized.',
    attachTo: { element: '#func_str', on: 'bottom' },
    buttons: [
      { text: 'Next', action: gademoTour.next }
    ]
  });

  gademoTour.addStep({
    id: 'open-sidebar',
    text: "Let's open the sidebar with the fields for experiment params!",
    attachTo: { element: '.toggle-button', on: 'right' },
    buttons: [
      {
        text: 'Open',
        action: function () {
          if (!sidebar.classList.contains('aside-visible')) {
            sidebar.classList.add('aside-visible');
            overlay.style.display = 'block';
          }
          setTimeout(() => gademoTour.next(), 500);
        }
      }
    ]
  });

  gademoTour.addStep({
    id: 'sidebar',
    text: 'This is where you enter the values ​​for the parameters of genetic algorithm.',
    attachTo: { element: '#sidebar', on: 'left' },
    buttons: [
      {
        text: 'Next',
        action: () => {
          // ➤ FECHA a sidebar
          sidebar.classList.remove('aside-visible');
          overlay.style.display = 'none';
          gademoTour.next();
        }
      }
    ]
  });

  gademoTour.addStep({
    id: 'run-button',
    text: "After entering the parameters, you will click on 'run' to process the genetic algorithm with the defined parameters. It's important to keep in your mind: when you click Run, you are generating a ROUND.",
    attachTo: { element: '#runExperimentButton', on: 'top' },
    buttons: [
      {
        text: 'Next',
        action: function () {
          runButton.click(); // Simula clique

          const waitForCharts = setInterval(() => {
            const chartReady =
              document.getElementById('myChart')?.offsetHeight > 0 &&
              document.getElementById('box-plot-chart')?.offsetHeight > 0 &&
              spinner.style.display === 'none';

            if (chartReady) {
              clearInterval(waitForCharts);
              gademoTour.next();
            }
          }, 500);
        }
      }
    ]
  });

  gademoTour.addStep({
    id: 'chart-line',
    text: "This is a graph of the average best fitness per generation for each experiment. You can accumulate results by round by clicking on 'Keep Graph'.",
    attachTo: { element: '#myChart', on: 'top' },
    buttons: [
      { text: 'Next', action: gademoTour.next }
    ]
  });

  gademoTour.addStep({
    id: 'results-table',
    text: 'Here are the tabulated results for each experiment in each generation. This table is intended to explain more clearly what is seen in the graph to the side; the values ​​in the Average column are those that are in the graph.',
    attachTo: { element: '#best-values-table', on: 'top' },
    buttons: [
      { text: 'Next', action: gademoTour.next }
    ]
  });

  gademoTour.addStep({
    id: 'chart-boxplot',
    text: 'This box plot shows the distribution of best values ​​per generation across experiments. It shows the result of the last round only.',
    attachTo: { element: '#box-plot-chart', on: 'top' },
    buttons: [
      { text: 'Next', action: gademoTour.next }
    ]
  });

  
  gademoTour.addStep({
       id: 'execution-status',
       text: 'Here are the best individuals and solutions found by experiment.',
       attachTo: { element: '#execution-status', on: 'top' },
       buttons: [
            {
                 text: 'Next',
                 action: gademoTour.next
               }
          ]
     });
     
     gademoTour.addStep({
     id: 'chart-boxplot',
     text: "If you choose to keep the results of each round (Keep Graph selected), the results will be saved and you can always view the previous ones by toggling these arrows. It is important to remember that if you deselect 'Keep Graph', the previous results will be lost when you generate a new round.",
     attachTo: { element: '#buttons-next-prev', on: 'top' },
     buttons: [
       { text: 'Next', action: gademoTour.next }
     ]
   });

  gademoTour.addStep({
    id: 'carousel-charts',
    text: 'For each experiment of the last round, graphs of the evolution of the best fitness is displayed.',
    attachTo: { element: '#lineChartExperiment', on: 'top' },
    buttons: [
      {
        text: 'Next',
        action: gademoTour.next,
        classes: 'shepherd-button-primary'
      }
    ]
  });


  gademoTour.addStep({
  id: 'carousel-histogram',
  text: 'This graph represents the fitness distribution of the last generation for each experiment in the last round.',
  attachTo: { element: '#histogramChartExperiment', on: 'top' },
  buttons: [
    {
      text: 'Finish',
      action: gademoTour.complete,
      classes: 'shepherd-button-primary'
    }
  ]
});

  gademoTour.on('complete', () => localStorage.setItem('gademoTourCompleted', 'true'));
  gademoTour.on('cancel', () => localStorage.setItem('gademoTourCompleted', 'true'));

  gademoTour.start();
}