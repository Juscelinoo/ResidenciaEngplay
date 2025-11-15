// Espera o documento HTML ser completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  // Seletores das cards de motivo existentes na página
  const reasonSelectors = [
    "#motivos",
    ".perca-interesse",
    ".ja-fiz-o-curso",
    ".sem-tempo",
    ".falta-de-novos-c",
    ".falta-evoluo",
    ".muitas-dvidas",
    ".muitas-dvidas-2",
    ".outro-curso",
  ];

  const reasonBoxes = Array.from(document.querySelectorAll(reasonSelectors.join(", ")));
  const continueButton = document.querySelector(".boto-continuar");

  // Agora suportamos múltiplas seleções
  const selectedReasons = new Set();

  function updateContinueButtonState() {
    if (!continueButton) return;
    const hasAny = selectedReasons.size > 0;
    if (!hasAny) {
      continueButton.classList.add("disabled");
      continueButton.setAttribute('aria-disabled', 'true');
      continueButton.style.pointerEvents = 'none';
      continueButton.style.opacity = '0.6';
    } else {
      continueButton.classList.remove("disabled");
      continueButton.setAttribute('aria-disabled', 'false');
      continueButton.style.pointerEvents = '';
      continueButton.style.opacity = '';
    }
  }

  // função para extrair um id/slug do elemento para armazenamento
  function reasonIdFromBox(box) {
    if (!box) return null;
    if (box.id) return box.id;
    // fallback: usar a primeira classe que não seja 'motivo-card'
    const cls = Array.from(box.classList).find((c) => c !== 'motivo-card');
    return cls || null;
  }

  reasonBoxes.forEach((box) => {
    // ensure accessible
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '0');
    box.setAttribute('role', 'button');
    box.setAttribute('aria-pressed', 'false');

    function toggleSelect() {
      const id = reasonIdFromBox(box);
      const isSelected = box.classList.toggle('selected');
      box.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

      if (isSelected) {
        selectedReasons.add(id);
        // quick selection pop animation: add a transient class then remove
        box.classList.add('just-selected');
        window.setTimeout(() => box.classList.remove('just-selected'), 220);
      } else {
        selectedReasons.delete(id);
      }

      updateContinueButtonState();
    }

    box.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSelect();
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSelect();
      }
    });
  });

  if (continueButton) {
    continueButton.addEventListener('click', (event) => {
      if (selectedReasons.size === 0) {
        event.preventDefault();
        alert('Por favor, selecione ao menos um motivo para continuar.');
        return;
      }

      // Salvar array de motivos no localStorage como JSON
      const arr = Array.from(selectedReasons).filter(Boolean);
      try {
        localStorage.setItem('motivoCancelamento', JSON.stringify(arr));
      } catch (err) {
        console.warn('Erro ao salvar motivoCancelamento:', err);
      }
      // link segue naturalmente
    });
  }

  // Estado inicial do botão
  updateContinueButtonState();
});