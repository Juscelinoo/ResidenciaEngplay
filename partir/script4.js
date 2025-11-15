document.addEventListener('DOMContentLoaded', () => {
  // Lista das classes que representam os botões de nota (0-5) em todas as seções
  const noteSelectors = [
    '.component', '.element-wrapper', '.div-wrapper', '.component-2', '.component-3', '.component-4',
    '.component-5', '.component-6', '.component-7', '.component-8', '.component-9', '.component-10',
    '.component-11', '.component-12', '.component-13', '.component-14', '.component-15', '.component-16',
    '.component-17', '.component-18', '.component-19', '.component-20', '.component-21', '.component-22',
    '.component-23', '.component-24', '.component-25', '.component-26', '.component-27', '.component-28'
  ];

  // Adiciona textarea nas caixas brancas (se já não existir) e conecta com o texto "pode nos contar um pouco mais"
  const textContainers = ['.rectangle-4', '.rectangle-6', '.rectangle-11', '.rectangle-13', '.rectangle-16'];
  const placeholderMap = {
    '.rectangle-4': '.text-wrapper-7',
    '.rectangle-6': '.text-wrapper-10',
    '.rectangle-11': '.text-wrapper-12',
    '.rectangle-13': '.text-wrapper-14',
    '.rectangle-16': '.text-wrapper-16'
  };

  textContainers.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (!el.querySelector('textarea')) {
      const ta = document.createElement('textarea');
      ta.placeholder = '';
      ta.style.width = '100%';
      ta.style.height = '100%';
      ta.style.border = 'none';
      ta.style.background = 'transparent';
      ta.style.resize = 'none';
  ta.style.fontSize = '18px';
      ta.style.fontFamily = '"SF Pro Rounded-Light", Helvetica';
      ta.style.color = '#0e4194';

      // Conectar ao texto explicativo que fica por perto (ex: "pode nos contar um pouco mais?")
      const placeholderSelector = placeholderMap[sel];
      const placeholderEl = placeholderSelector ? document.querySelector(placeholderSelector) : null;

      // Se existir o elemento de placeholder, permitir que ao clicar nele foque o textarea
      if (placeholderEl) {
        // garante que pareça clicável
        placeholderEl.style.cursor = 'text';
        placeholderEl.addEventListener('click', () => {
          // esconde o texto e foca o textarea
          placeholderEl.style.display = 'none';
          ta.focus();
        });
      }

      // Ao focar, esconder o texto explicativo
      ta.addEventListener('focus', () => {
        if (placeholderEl) placeholderEl.style.display = 'none';
      });

      // Ao desfocar, se estiver vazio, mostrar o texto explicativo
      ta.addEventListener('blur', () => {
        if (placeholderEl && ta.value.trim() === '') {
          placeholderEl.style.display = 'block';
        }
      });

      // ao digitar, reavaliar o botão continuar
      ta.addEventListener('input', checkEnableContinue);

      // limpar conteúdo pré-existente da caixa e inserir textarea
      el.innerHTML = '';
      el.appendChild(ta);

      // se o textarea já tiver conteúdo (por restauração), esconder o placeholder
      if (ta.value && ta.value.trim().length > 0 && placeholderEl) {
        placeholderEl.style.display = 'none';
      }
    }
  });

  // Função que habilita/desabilita o botão continuar com base em seleção ou comentários
  const continueButton = document.querySelector('.boto-continuar');
  function checkEnableContinue() {
    if (!continueButton) return;
    const anySelected = noteSelectors.some(sel => Array.from(document.querySelectorAll(sel)).some(n => n.classList.contains('selected')));
    const anyComment = Array.from(document.querySelectorAll('textarea')).some(t => t.value.trim().length > 0);

    if (anySelected || anyComment) {
      continueButton.classList.remove('disabled');
      continueButton.style.pointerEvents = 'auto';
      continueButton.style.opacity = '1';
    } else {
      continueButton.classList.add('disabled');
      continueButton.style.pointerEvents = 'none';
      continueButton.style.opacity = '0.6';
    }
  }

  // Anexa ouvintes de clique/teclado a todos os botões de nota
  noteSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // acessibilidade
      el.setAttribute('role', 'checkbox');
      el.setAttribute('tabindex', '0');

      el.addEventListener('click', () => {
        el.classList.toggle('selected');
        el.setAttribute('aria-checked', el.classList.contains('selected'));
        checkEnableContinue();
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.classList.toggle('selected');
          el.setAttribute('aria-checked', el.classList.contains('selected'));
          checkEnableContinue();
        }
      });
    });
  });

  // Estado inicial do botão continuar
  checkEnableContinue();
});