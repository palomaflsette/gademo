document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('gademoTourCompleted')) return;

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      scrollTo: { behavior: 'smooth', block: 'center' },
      classes: 'shepherd-theme-arrows',
      modalOverlayOpeningPadding: 8,
    }
  });

  // Passo 1 - welcome
  tour.addStep({
    id: 'welcome',
    text: '👋 Bem-vindo(a) à plataforma GAdemo!<br>Queremos te apresentar os principais recursos.',
    buttons: [
      {
        text: 'Finalizar',
        action: tour.cancel,
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Iniciar Tour',
        action: tour.next,
        classes: 'shepherd-button-primary'
      }
    ]
  });

  // Passo 2 - Campo de função
  tour.addStep({
    id: 'function-input',
    text: 'Aqui você insere a função que será otimizada.',
    attachTo: {
      element: '#func_str',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Próximo',
        action: tour.next
      }
    ]
  });

  // Passo 3 - Botão hamburguer e abertura da sidebar
  tour.addStep({
    id: 'open-sidebar',
    text: 'Vamos abrir a barra lateral com os parâmetros do experimento!',
    attachTo: {
      element: '.toggle-button',
      on: 'right'
    },
    buttons: [
      {
        text: 'Abrir',
        action: function () {
          // Abre a sidebar
          const sidebar = document.getElementById('sidebar');
          const overlay = document.getElementById('overlay');

          if (!sidebar.classList.contains('aside-visible')) {
            sidebar.classList.add('aside-visible');
            overlay.style.display = 'block';
          }

          // Aguarda um momento para abrir antes de ir pro próximo passo
          setTimeout(() => tour.next(), 500);
        }
      }
    ]
  });

  // Passo 4 - Sidebar em si
  tour.addStep({
    id: 'sidebar',
    text: 'Essa barra lateral contém os parâmetros do seu experimento.',
    attachTo: {
      element: '#sidebar',
      on: 'left'
    },
    buttons: [
      {
        text: 'Próximo',
        action: tour.next
      }
    ]
  });

  // Passo 5 - Botão de execução
  tour.addStep({
    id: 'run-button',
    text: 'Clique aqui para executar o algoritmo com os parâmetros definidos.',
    attachTo: {
      element: '#runExperimentButton',
      on: 'top'
    },
    buttons: [
      {
        text: 'Finalizar',
        action: tour.complete
      }
    ]
  });

  // Inicia o tour
  tour.start();

  // Marca que o tour foi concluído ou cancelado
  tour.on('complete', () => {
    localStorage.setItem('gademoTourCompleted', 'true');
  });

  tour.on('cancel', () => {
    localStorage.setItem('gademoTourCompleted', 'true');
  });
});
