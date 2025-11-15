document.addEventListener('DOMContentLoaded', () => {
  const checkboxEl = document.querySelector('.div-wrapper');
  const confirmButton = document.querySelector('.boto-continuar');
  // tenta recuperar o <a> que contém o botão (no HTML é: <a href="index.html"><div class="boto-continuar">...)</n  const outerLink = document.querySelector('a[href="index.html"]');

  if (!checkboxEl || !confirmButton) return;

  // Inicializa atributos de acessibilidade
  checkboxEl.setAttribute('role', 'checkbox');
  checkboxEl.setAttribute('tabindex', '0');
  checkboxEl.setAttribute('aria-checked', 'false');

  function setChecked(checked) {
    if (checked) {
      checkboxEl.classList.add('checked');
      checkboxEl.setAttribute('aria-checked', 'true');
      confirmButton.classList.remove('disabled');
      confirmButton.style.pointerEvents = 'auto';
      confirmButton.style.opacity = '1';
    } else {
      checkboxEl.classList.remove('checked');
      checkboxEl.setAttribute('aria-checked', 'false');
      confirmButton.classList.add('disabled');
      confirmButton.style.pointerEvents = 'none';
      confirmButton.style.opacity = '0.6';
    }
  }

  // Restaura estado salvo (se existir)
  const saved = localStorage.getItem('cancelamentoConfirmed');
  setChecked(saved === 'true');

  // Toggle ao clicar
  checkboxEl.addEventListener('click', () => {
    const now = checkboxEl.classList.contains('checked');
    setChecked(!now);
    // atualiza persistência imediata
    localStorage.setItem('cancelamentoConfirmed', (!now).toString());
  });

  // Também permite clicar no quadrado (.rectangle-9) para alternar
  const checkboxSquare = document.querySelector('.rectangle-9');
  if (checkboxSquare) {
    // delega a ação ao clique na área principal
    checkboxSquare.addEventListener('click', () => checkboxEl.click());
    checkboxSquare.setAttribute('role', 'button');
    checkboxSquare.setAttribute('tabindex', '0');
    checkboxSquare.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkboxEl.click();
      }
    });
  }

  // Suporte por teclado (Enter / Espaço)
  checkboxEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      checkboxEl.click();
    }
  });

  // Previne navegação se o botão estiver desabilitado
  if (outerLink) {
    outerLink.addEventListener('click', (e) => {
      if (confirmButton.classList.contains('disabled')) {
        e.preventDefault();
        // feedback simples
        alert('Por favor confirme que está ciente antes de prosseguir.');
      } else {
        // salvar confirmação final
        localStorage.setItem('cancelamentoConfirmed', 'true');
      }
    });
  }
});